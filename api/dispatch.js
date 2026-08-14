import { dispatchPrint, getDispatchConfig } from '../server/dispatch.js';

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { telegram, email } = getDispatchConfig();
    res.status(200).json({ telegram, email });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const result = await dispatchPrint({ body: req.body, ip: clientIp(req) });
  res.status(result.status).json(result.body);
}
