const TTL_MS = 10 * 60 * 1000;
const memoryJobs = new Map();

export function resetMemoryStore() {
  memoryJobs.clear();
}

function sweepMemory() {
  const now = Date.now();
  for (const [id, entry] of memoryJobs) {
    if (now - entry.createdAt > TTL_MS) memoryJobs.delete(id);
  }
}

export function createMemoryStore() {
  return {
    async get(jobId) {
      sweepMemory();
      return memoryJobs.get(jobId)?.payload ?? null;
    },
    async set(jobId, payload) {
      sweepMemory();
      memoryJobs.set(jobId, { payload, createdAt: Date.now() });
    }
  };
}

function jobPath(jobId) {
  return `jobs/${jobId}.json`;
}

function blobOptions(env = process.env) {
  const options = { access: 'private' };
  if (env.BLOB_STORE_ID) options.storeId = env.BLOB_STORE_ID;
  if (env.BLOB_READ_WRITE_TOKEN) options.token = env.BLOB_READ_WRITE_TOKEN;
  return options;
}

export function createBlobStore({ putFn, getFn, env = process.env } = {}) {
  const auth = blobOptions(env);

  return {
    async get(jobId) {
      const { get } = await import('@vercel/blob');
      const fetchBlob = getFn || get;
      const result = await fetchBlob(jobPath(jobId), {
        ...auth,
        useCache: false
      });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      const text = await new Response(result.stream).text();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    },
    async set(jobId, payload) {
      const { put } = await import('@vercel/blob');
      const upload = putFn || put;
      await upload(jobPath(jobId), JSON.stringify(payload), {
        ...auth,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 60
      });
    }
  };
}

export function hasBlobConfig(env = process.env) {
  if (env.BLOB_READ_WRITE_TOKEN) return true;
  if (env.VERCEL_OIDC_TOKEN && env.BLOB_STORE_ID) return true;
  return false;
}

export function createJobStore(env = process.env) {
  if (env.VERCEL && hasBlobConfig(env)) return createBlobStore({ env });
  return createMemoryStore();
}
