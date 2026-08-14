import nodemailer from 'nodemailer';

const MAX_IMAGE = 4_000_000;
const MAX_CAPTION = 1024;
const DEFAULT_RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 10 };

const rateBuckets = new Map();

export function resetDispatchRateLimit() {
  rateBuckets.clear();
}

function envVal(value, fallback = '') {
  if (value == null) return fallback;
  const trimmed = String(value).split('#')[0].trim();
  return trimmed || fallback;
}

function isLoopback(ip) {
  return !ip
    || ip === 'local'
    || ip === '127.0.0.1'
    || ip === '::1'
    || ip === '::ffff:127.0.0.1';
}

function checkRateLimit(ip, { windowMs, max }) {
  if (isLoopback(ip)) return true;
  const key = ip || 'unknown';
  const now = Date.now();
  const hits = (rateBuckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  rateBuckets.set(key, hits);
  return true;
}

function smtpPort(env) {
  const raw = envVal(env.SMTP_PORT);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 465;
}

function smtpSecure(env, port) {
  const raw = envVal(env.SMTP_SECURE).toLowerCase();
  if (raw === '1' || raw === 'true') return true;
  if (raw === '0' || raw === 'false') return false;
  return port === 465;
}

function getDispatchRuntime(env = process.env) {
  const token = envVal(env.TELEGRAM_BOT_TOKEN);
  const chatId = envVal(env.TELEGRAM_CHAT_ID);
  const host = envVal(env.SMTP_HOST);
  const to = envVal(env.DISPATCH_EMAIL_TO);
  const user = envVal(env.SMTP_USER);
  const pass = envVal(env.SMTP_PASS);
  const from = envVal(env.DISPATCH_EMAIL_FROM, user);

  return {
    telegram: Boolean(token && chatId),
    email: Boolean(host && to && (from || (user && pass))),
    telegramToken: token,
    telegramChatId: chatId,
    smtp: {
      host,
      port: smtpPort(env),
      secure: smtpSecure(env, smtpPort(env)),
      user,
      pass,
      from,
      to
    }
  };
}

export function getDispatchConfig(env = process.env) {
  const runtime = getDispatchRuntime(env);
  return { telegram: runtime.telegram, email: runtime.email };
}

function caption({ title, metadata }) {
  return [
    `Заказ на печать: ${title}`,
    metadata,
    new Date().toLocaleString('ru-RU')
  ].filter(Boolean).join('\n').slice(0, MAX_CAPTION);
}

async function loadImage(imageUrl, fetchFn) {
  if (imageUrl.startsWith('data:image')) {
    const m = imageUrl.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
    if (!m) throw new Error('Кривой data URL');
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > MAX_IMAGE) throw new Error('Картинка слишком большая');
    const ext = m[1].includes('png') ? 'png' : 'jpg';
    return { buf, mime: m[1], filename: `print.${ext}` };
  }

  if (/^https?:\/\//.test(imageUrl)) {
    const res = await fetchFn(imageUrl, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`Не скачать картинку: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_IMAGE) throw new Error('Картинка слишком большая');
    const mime = res.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg';
    const ext = mime.includes('png') ? 'png' : 'jpg';
    return { buf, mime, filename: `print.${ext}` };
  }

  throw new Error('Нет imageUrl');
}

function asPhotoPart(image) {
  const bytes = new Uint8Array(image.buf);
  if (typeof File !== 'undefined') {
    return new File([bytes], image.filename, { type: image.mime });
  }
  return new Blob([bytes], { type: image.mime });
}

async function sendTelegram({ image, title, metadata, config, fetchFn }) {
  const form = new FormData();
  form.append('chat_id', config.telegramChatId);
  form.append('caption', caption({ title, metadata }));
  form.append('photo', asPhotoPart(image), image.filename);

  const res = await fetchFn(
    `https://api.telegram.org/bot${config.telegramToken}/sendPhoto`,
    { method: 'POST', body: form, signal: AbortSignal.timeout(30_000) }
  );

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.description || `Telegram API ${res.status}`);
  }
}

async function defaultSendMail({ from, to, subject, text, html, attachments, smtp }) {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    requireTLS: !smtp.secure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 25_000,
    auth: smtp.user && smtp.pass ? { user: smtp.user, pass: smtp.pass } : undefined
  });

  await transporter.sendMail({ from, to, subject, text, html, attachments });
}

async function sendEmail({ image, title, metadata, config, sendMailFn }) {
  const { smtp } = config;
  const from = smtp.from || smtp.user;
  if (!from) throw new Error('DISPATCH_EMAIL_FROM не задан');

  await sendMailFn({
    from,
    to: smtp.to,
    subject: `Печать: ${title}`,
    text: [title, metadata].filter(Boolean).join('\n\n'),
    html: `<p>${escapeHtml(title)}</p><p>${escapeHtml(metadata || '')}</p>`,
    attachments: [{
      filename: image.filename,
      content: image.buf,
      contentType: image.mime
    }],
    smtp
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function channelResult(settled) {
  if (settled.status === 'fulfilled') return { ok: true };
  return { ok: false, error: settled.reason?.message || String(settled.reason) };
}

export async function dispatchPrint({
  body,
  ip,
  env = process.env,
  fetchFn = fetch,
  sendMailFn = defaultSendMail,
  rateLimit = DEFAULT_RATE_LIMIT
} = {}) {
  const payload = body && typeof body === 'object' ? body : {};
  const imageUrl = typeof payload.imageUrl === 'string' ? payload.imageUrl.trim() : '';
  const title = String(payload.title || 'Макет').slice(0, 200);
  const metadata = String(payload.metadata || '').slice(0, 1000);

  const config = getDispatchRuntime(env);
  if (!config.telegram && !config.email) {
    return { status: 503, body: { success: false, error: 'no_channels' } };
  }

  if (!imageUrl) {
    return { status: 400, body: { success: false, error: 'Нет imageUrl' } };
  }

  if (!checkRateLimit(ip, rateLimit)) {
    return { status: 429, body: { success: false, error: 'Слишком много запросов. Подождите несколько минут.' } };
  }

  let image;
  try {
    image = await loadImage(imageUrl, fetchFn);
  } catch (err) {
    return { status: 400, body: { success: false, error: err.message } };
  }

  const jobs = [];
  const labels = [];
  if (config.telegram) {
    labels.push('telegram');
    jobs.push(sendTelegram({ image, title, metadata, config, fetchFn }));
  }
  if (config.email) {
    labels.push('email');
    jobs.push(sendEmail({ image, title, metadata, config, sendMailFn }));
  }

  const settled = await Promise.allSettled(jobs);
  const bodyOut = { success: false };

  settled.forEach((result, i) => {
    bodyOut[labels[i]] = channelResult(result);
  });

  bodyOut.success = labels.some((key) => bodyOut[key]?.ok);
  return {
    status: bodyOut.success ? 200 : 502,
    body: bodyOut
  };
}
