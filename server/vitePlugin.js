import { createJobStore } from './jobStore.js';
import { startGenerateJob, runGenerateJob, getGenerateJob } from './jobs.js';
import { dispatchPrint, getDispatchConfig } from './dispatch.js';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function jobIdFromUrl(url) {
  try {
    return new URL(url, 'http://localhost').searchParams.get('job');
  } catch {
    return null;
  }
}

export function localGenerateApiPlugin(env) {
  const store = createJobStore(env);

  const handle = async (req, res, next) => {
    const path = req.url?.split('?')[0];

    if (path === '/api/dispatch') {
      if (req.method === 'GET') {
        const { telegram, email } = getDispatchConfig(env);
        sendJson(res, 200, { telegram, email });
        return;
      }

      if (req.method !== 'POST') {
        sendJson(res, 405, { success: false, error: 'Method not allowed' });
        return;
      }

      try {
        const body = await readJsonBody(req);
        const ip = req.socket?.remoteAddress || 'local';
        const result = await dispatchPrint({ body, ip, env });
        sendJson(res, result.status, result.body);
      } catch {
        sendJson(res, 400, { success: false, error: 'Некорректный JSON.' });
      }
      return;
    }

    if (path !== '/api/generate') {
      next();
      return;
    }

    if (req.method === 'GET') {
      const result = await getGenerateJob({ jobId: jobIdFromUrl(req.url), store });
      sendJson(res, result.status, result.body);
      return;
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { success: false, error: 'Method not allowed' });
      return;
    }

    try {
      const body = await readJsonBody(req);
      const ip = req.socket?.remoteAddress || 'local';
      const started = await startGenerateJob({ store });
      void runGenerateJob({ jobId: started.jobId, body, ip, env, store });
      sendJson(res, started.status, started.body);
    } catch {
      sendJson(res, 400, { success: false, error: 'Некорректный JSON.' });
    }
  };

  return {
    name: 'local-generate-api',
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    }
  };
}
