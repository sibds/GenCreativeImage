import { handleGenerate } from './generate.js';

const JOB_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isJobId(id) {
  return typeof id === 'string' && JOB_ID_RE.test(id);
}

export async function startGenerateJob({ store }) {
  const jobId = crypto.randomUUID();
  await store.set(jobId, { status: 'pending' });
  return {
    status: 202,
    body: { jobId, status: 'pending' },
    jobId
  };
}

export async function runGenerateJob({
  jobId,
  body,
  ip,
  env,
  store,
  fetchFn,
  rateLimit
}) {
  try {
    const result = await handleGenerate({ body, ip, env, fetchFn, rateLimit });
    await store.set(jobId, result.body);
  } catch (err) {
    await store.set(jobId, {
      success: false,
      error: err.message || 'Ошибка генерации.'
    });
  }
}

export async function getGenerateJob({ jobId, store }) {
  if (!isJobId(jobId)) {
    return { status: 400, body: { success: false, error: 'Некорректный job id.' } };
  }

  const job = await store.get(jobId);
  if (!job) {
    return { status: 404, body: { success: false, error: 'Задача не найдена.' } };
  }

  if (job.status === 'pending') {
    return { status: 200, body: { status: 'pending' } };
  }

  return { status: 200, body: job };
}
