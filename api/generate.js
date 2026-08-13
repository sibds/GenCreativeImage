import { handleGenerate } from '../server/generate.js';

export const maxDuration = 300;

export const config = {
  maxDuration: 300
};

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function startSse(res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  res.write(':\n\n');
}

function writeSseData(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  startSse(res);
  const ping = setInterval(() => {
    res.write(':\n\n');
  }, 8000);

  try {
    const result = await handleGenerate({
      body: req.body,
      ip: clientIp(req)
    });
    writeSseData(res, result.body);
  } catch (err) {
    writeSseData(res, { success: false, error: err.message || 'Ошибка генерации.' });
  } finally {
    clearInterval(ping);
    res.end();
  }
}
