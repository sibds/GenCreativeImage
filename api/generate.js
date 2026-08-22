import { waitUntil } from '@vercel/functions';
import { createJobStore, hasBlobConfig } from '../server/jobStore.js';
import { startGenerateJob, runGenerateJob, getGenerateJob } from '../server/jobs.js';
import { handleGenerate } from '../server/generate.js';

export const maxDuration = 300;

export const config = {
  maxDuration: 300
};

const store = createJobStore();
const preferAsyncJobs = !process.env.VERCEL || hasBlobConfig();

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function jobIdFromReq(req) {
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url, `http://${host}`);
  return url.searchParams.get('job');
}

function isBlobError(err) {
  const msg = (err?.message || '').toLowerCase();
  return msg.includes('blob')
    || msg.includes('usage limit')
    || msg.includes('quota');
}

async function generateSync(req, res, ip) {
  const result = await handleGenerate({ body: req.body, ip });
  res.status(result.status).json(result.body);
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!preferAsyncJobs) {
        res.status(404).json({ success: false, error: 'Задача не найдена.' });
        return;
      }
      const result = await getGenerateJob({ jobId: jobIdFromReq(req), store });
      res.status(result.status).json(result.body);
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: 'Method not allowed' });
      return;
    }

    const ip = clientIp(req);

    if (!preferAsyncJobs) {
      await generateSync(req, res, ip);
      return;
    }

    try {
      const started = await startGenerateJob({ store });
      waitUntil(runGenerateJob({
        jobId: started.jobId,
        body: req.body,
        ip,
        store
      }));
      res.status(started.status).json(started.body);
    } catch (err) {
      if (isBlobError(err)) {
        console.warn('[api/generate] blob unavailable, sync fallback:', err.message);
        await generateSync(req, res, ip);
        return;
      }
      throw err;
    }
  } catch (err) {
    console.error('[api/generate]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Ошибка сервера.'
    });
  }
}
