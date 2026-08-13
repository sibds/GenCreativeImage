import { waitUntil } from '@vercel/functions';
import { createJobStore } from '../server/jobStore.js';
import { startGenerateJob, runGenerateJob, getGenerateJob } from '../server/jobs.js';

export const maxDuration = 300;

export const config = {
  maxDuration: 300
};

const store = createJobStore();

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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await getGenerateJob({ jobId: jobIdFromReq(req), store });
    res.status(result.status).json(result.body);
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const ip = clientIp(req);
  const started = await startGenerateJob({ store });
  waitUntil(runGenerateJob({
    jobId: started.jobId,
    body: req.body,
    ip,
    store
  }));
  res.status(started.status).json(started.body);
}
