import { handleGenerate } from '../server/generate.js';

export const config = {
  maxDuration: 60
};

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const result = await handleGenerate({
    body: req.body,
    ip: clientIp(req)
  });

  res.status(result.status).json(result.body);
}
