const PLACEHOLDER_KEY = 'your_openrouter_api_key_here';
const ALLOWED_MODES = new Set(['crest', 'ornament']);
const MAX_PROMPT_LENGTH = 4000;
const DEFAULT_ENDPOINT = 'https://openrouter.ai/api/v1';
const DEFAULT_IMAGE_MODEL = 'google/gemini-3-pro-image';
const DEFAULT_RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 8 };

const CREST_ENHANCE_SYSTEM = `The user message is already a complete image-generation prompt for a family emblem in flat 2D ethnographic folk-art style.

Preserve its structure, palette, shield description, motto, Visual style block, and Avoid list.
Keep the named animal and the named shield geometry exactly as given. Do not substitute a bear or a pointed heater shield if the prompt asks for a different animal or shape.
You may add a few named folk motifs (embroidery, wood carving, solar signs) in the same register.
Do not turn it into European heraldry or a royal coat of arms.

Forbidden in the output: photorealism, photorealistic, 8k, high-detail heraldry, gold embroidery, gold filigree, regal, royal, luxurious, metallic, coat of arms, cinematic lighting, 3D, gradients, realistic fur, realistic fire, baroque.

Opening must stay: Family emblem, ethnographic folk crest
The Avoid list must remain.

Output ONLY the prompt, nothing else.`;

const ORNAMENT_ENHANCE_SYSTEM = `The user message is already a complete image-generation prompt for a Kama-region geometric ornament in flat 2D vector style.

Preserve its structure, COMPOSITION TYPE, spatial layout, selected symbols, palette, Visual style block, and Avoid list.
Keep the named composition geometry exactly as given. Do not turn a tile into a medallion, a border into a full-page pattern, a medallion into a carpet, or a frame into a filled field.
You may add a few named folk motifs (embroidery, wood carving, solar signs) in the same register.

Forbidden in the output: extra embellishment, 8k, high-detail, intricate patterns, masterpiece, photorealism, photorealistic, people, humans, gradients, shadows, 3D.

Opening must stay: COMPOSITION TYPE
The Avoid list must remain.

Output ONLY the prompt, nothing else.`;

const rateBuckets = new Map();

export function resetRateLimit() {
  rateBuckets.clear();
}

function envVal(value, fallback = '') {
  if (value == null) return fallback;
  const trimmed = String(value).split('#')[0].trim();
  return trimmed || fallback;
}

function getServerConfig(env = process.env) {
  return {
    apiKey: envVal(env.OPENROUTER_API_KEY),
    imageModel: envVal(env.OPENROUTER_IMAGE_MODEL, DEFAULT_IMAGE_MODEL),
    textModel: envVal(env.OPENROUTER_TEXT_MODEL),
    endpoint: envVal(env.OPENROUTER_ENDPOINT, DEFAULT_ENDPOINT).replace(/\/+$/, '')
  };
}

function snippet(text, max = 280) {
  if (!text) return '';
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function formatApiError(bodyText, data) {
  const msg = data?.error?.message || data?.error || data?.message || bodyText;
  return snippet(msg);
}

function asImageUrl(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('data:image') || /^https?:\/\//.test(trimmed)) return trimmed;

    const markdown = trimmed.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+|data:image[^)]+)\)/);
    if (markdown) return markdown[1];

    const hosted = trimmed.match(/https?:\/\/images\.openrouter\.ai\/[^\s)"']+/);
    if (hosted) return hosted[0];

    return null;
  }

  if (typeof value !== 'object') return null;

  if (value.image_url?.url) return asImageUrl(value.image_url.url);
  if (typeof value.url === 'string') return asImageUrl(value.url);
  if (value.b64_json) {
    const mime = value.media_type || value.mimeType || 'image/png';
    return `data:${mime};base64,${value.b64_json}`;
  }

  const inline = value.inline_data || value.inlineData;
  if (inline?.data) {
    const mime = inline.mime_type || inline.mimeType || 'image/png';
    return `data:${mime};base64,${inline.data}`;
  }

  return null;
}

function extractImageFromResponse(data) {
  if (!data || typeof data !== 'object') return null;

  if (Array.isArray(data.data) && data.data[0]) {
    const fromData = asImageUrl(data.data[0]);
    if (fromData) return fromData;
  }

  if (Array.isArray(data.images) && data.images[0]) {
    const fromImages = asImageUrl(data.images[0]);
    if (fromImages) return fromImages;
  }

  const msg = data.choices?.[0]?.message;
  if (!msg) return null;

  if (Array.isArray(msg.images) && msg.images.length > 0) {
    for (const img of msg.images) {
      const url = asImageUrl(img);
      if (url) return url;
    }
  }

  if (Array.isArray(msg.content)) {
    for (const part of msg.content) {
      const url = asImageUrl(part);
      if (url) return url;
      if (part?.type === 'text') {
        const fromText = asImageUrl(part.text);
        if (fromText) return fromText;
      }
    }
  }

  if (typeof msg.content === 'string') {
    return asImageUrl(msg.content);
  }

  return null;
}

function authHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://gencreativeimage.vercel.app',
    'X-Title': 'Permia Creative Generator'
  };
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

function fail(status, error) {
  return { status, body: { success: false, error } };
}

function okImage({ imageUrl, model, prompt }) {
  return {
    status: 200,
    body: {
      success: true,
      imageUrl,
      prompt,
      source: `OpenRouter — ${model}`,
      message: `Готово! Модель: ${model}`
    }
  };
}

async function parseJsonResponse(res) {
  const bodyText = await res.text();
  let data = null;
  try {
    data = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    data = null;
  }
  return { bodyText, data };
}

async function enhancePrompt(rawPrompt, mode, config, fetchFn) {
  if (!config.textModel) return rawPrompt;

  const systemMsg = mode === 'crest' ? CREST_ENHANCE_SYSTEM : ORNAMENT_ENHANCE_SYSTEM;

  try {
    const res = await fetchFn(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: authHeaders(config.apiKey),
      signal: AbortSignal.timeout(12_000),
      body: JSON.stringify({
        model: config.textModel,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: rawPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!res.ok) return rawPrompt;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (typeof text === 'string' && text.trim()) return text.trim();
  } catch {
    // keep raw prompt
  }

  return rawPrompt;
}

export async function handleGenerate({
  body,
  ip,
  env = process.env,
  fetchFn = fetch,
  rateLimit = DEFAULT_RATE_LIMIT
} = {}) {
  const payload = body && typeof body === 'object' ? body : {};
  const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';
  const mode = typeof payload.mode === 'string' ? payload.mode.trim() : 'crest';

  if (!prompt) return fail(400, 'Нужен prompt.');
  if (prompt.length > MAX_PROMPT_LENGTH) return fail(400, 'Слишком длинный prompt.');
  if (!ALLOWED_MODES.has(mode)) return fail(400, 'Недопустимый mode.');

  if (!checkRateLimit(ip, rateLimit)) {
    return fail(429, 'Слишком много запросов. Подождите несколько минут.');
  }

  const config = getServerConfig(env);
  if (!config.apiKey || config.apiKey === PLACEHOLDER_KEY) {
    return fail(503, 'API ключ не задан на сервере. Укажите OPENROUTER_API_KEY.');
  }

  const finalPrompt = await enhancePrompt(prompt, mode, config, fetchFn);
  const headers = authHeaders(config.apiKey);
  const aspectRatio = mode === 'crest' ? '3:4' : '1:1';
  let allowChatFallback = false;
  let lastError = '';

  try {
    const res = await fetchFn(`${config.endpoint}/images`, {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(270_000),
      body: JSON.stringify({
        model: config.imageModel,
        prompt: finalPrompt,
        n: 1,
        aspect_ratio: aspectRatio,
        output_format: 'jpeg',
        resolution: '1K'
      })
    });

    const { bodyText, data } = await parseJsonResponse(res);

    if (res.ok) {
      const imageUrl = extractImageFromResponse(data);
      if (imageUrl) {
        return okImage({ imageUrl, model: config.imageModel, prompt: finalPrompt });
      }
      lastError = 'Модель ответила без изображения.';
    } else {
      lastError = `Ошибка OpenRouter (${res.status}): ${formatApiError(bodyText, data)}`;
      allowChatFallback = res.status === 400 || res.status === 404 || res.status === 405;
      if (!allowChatFallback) return fail(res.status, lastError);
    }
  } catch (err) {
    lastError = `Ошибка сети: ${err.message}`;
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return fail(504, 'Таймаут OpenRouter: модель не успела вернуть изображение.');
    }
    allowChatFallback = true;
  }

  if (!allowChatFallback) {
    return fail(502, lastError || 'Модель не вернула изображение.');
  }

  try {
    const res = await fetchFn(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(270_000),
      body: JSON.stringify({
        model: config.imageModel,
        messages: [{ role: 'user', content: finalPrompt }],
        modalities: ['image', 'text']
      })
    });

    const { bodyText, data } = await parseJsonResponse(res);

    if (!res.ok) {
      return fail(res.status, `Ошибка OpenRouter (${res.status}): ${formatApiError(bodyText, data)}`);
    }

    const imageUrl = extractImageFromResponse(data);
    if (imageUrl) {
      return okImage({ imageUrl, model: config.imageModel, prompt: finalPrompt });
    }

    return fail(502, lastError || 'Модель не вернула изображение.');
  } catch (err) {
    return fail(502, lastError || `Ошибка сети: ${err.message}`);
  }
}
