// OpenRouter API Service
// Primary: POST /api/v1/images
// Fallback: POST /api/v1/chat/completions (404 / network only)
// Config: .env (VITE_OPENROUTER_*) with optional localStorage override

const LOCAL_CONFIG_KEY = 'openroad_api_config';
const PLACEHOLDER_KEY = 'your_openrouter_api_key_here';

function getEnvConfig() {
  return {
    apiKey: (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim(),
    imageModel: (import.meta.env.VITE_OPENROUTER_IMAGE_MODEL || 'google/gemini-3-pro-image').trim(),
    textModel: (import.meta.env.VITE_OPENROUTER_TEXT_MODEL || '').trim(),
    endpoint: (import.meta.env.VITE_OPENROUTER_ENDPOINT || 'https://openrouter.ai/api/v1').trim()
  };
}

function getLocalOverride() {
  try {
    const raw = localStorage.getItem(LOCAL_CONFIG_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getConfig() {
  const env = getEnvConfig();
  const local = getLocalOverride();
  return {
    apiKey: (local.apiKey || env.apiKey || '').trim(),
    imageModel: (local.imageModel || env.imageModel || 'google/gemini-3-pro-image').trim(),
    textModel: (local.textModel || env.textModel || '').trim(),
    endpoint: (local.endpoint || env.endpoint || 'https://openrouter.ai/api/v1').trim()
  };
}

export function getOpenRouterEnvConfig() {
  return getConfig();
}

export function saveOpenRouterLocalConfig(config = {}) {
  const toSave = {
    apiKey: (config.apiKey || '').trim(),
    imageModel: (config.imageModel || '').trim(),
    textModel: (config.textModel || '').trim(),
    endpoint: (config.endpoint || '').trim()
  };
  localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(toSave));
}

function authHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Permia Creative Generator'
  };
}

function snippet(text, max = 280) {
  if (!text) return '';
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function formatApiError(status, bodyText, data) {
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

function okResult(imageUrl, model) {
  return {
    success: true,
    imageUrl,
    source: `OpenRouter — ${model}`,
    message: `Готово! Модель: ${model}`
  };
}

/**
 * Stage 1 (optional): Enhance prompt via text LLM if a text model is configured
 */
async function enhancePrompt(rawPrompt, mode, onStatus) {
  const { apiKey, textModel, endpoint } = getConfig();

  if (!textModel || !apiKey || apiKey === PLACEHOLDER_KEY) {
    return rawPrompt;
  }

  if (onStatus) onStatus('Подготовка описания для модели...');

  const systemMsg = mode === 'crest'
    ? 'You are an expert heraldic artist. Transform the user\'s family crest description into a single, ultra-detailed image generation prompt in English. Include rich heraldic details: shield shape, animal pose, ethnic ornamental patterns, elemental aura effects, gold filigree, banner ribbon with motto. The result should look like a masterwork royal coat of arms. Output ONLY the enhanced prompt, nothing else.'
    : 'You are a Permian ethnic art expert. Transform the user\'s ornament description into a single, ultra-detailed image generation prompt in English. CRITICAL: absolutely NO humans or people. Strict 2D flat vector art, sharp geometric contours, symmetric composition. Color palette ONLY: Ochre (#C88A35), White (#FFFFFF), Dark Green (#1C4524), Burgundy (#7A1C2C). Output ONLY the enhanced prompt, nothing else.';

  try {
    const res = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: authHeaders(apiKey),
      body: JSON.stringify({
        model: textModel,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: rawPrompt }
        ],
        temperature: 0.7
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (typeof text === 'string' && text.trim()) return text.trim();
    }
  } catch (err) {
    console.warn('Text LLM enhancement failed, using raw prompt:', err);
  }

  return rawPrompt;
}

/**
 * Main entry point: generate a creative image via OpenRouter
 */
export async function generateCreativeImage({ prompt, mode = 'crest', onStatusUpdate }) {
  const config = getConfig();

  if (!config.apiKey || config.apiKey === PLACEHOLDER_KEY) {
    return {
      success: false,
      error: 'API ключ не задан. Откройте файл .env в корне проекта и укажите VITE_OPENROUTER_API_KEY=sk-or-v1-...'
    };
  }

  const finalPrompt = await enhancePrompt(prompt, mode, onStatusUpdate);

  if (onStatusUpdate) onStatusUpdate(`Генерация изображения моделью ${config.imageModel}...`);

  const headers = authHeaders(config.apiKey);
  const aspectRatio = mode === 'crest' ? '3:4' : '1:1';
  let allowChatFallback = false;
  let lastError = '';

  try {
    const res = await fetch(`${config.endpoint}/images`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.imageModel,
        prompt: finalPrompt,
        n: 1,
        aspect_ratio: aspectRatio
      })
    });

    const bodyText = await res.text();
    let data = null;
    try {
      data = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      data = null;
    }

    if (res.ok) {
      const imageUrl = extractImageFromResponse(data);
      if (imageUrl) return okResult(imageUrl, config.imageModel);
      lastError = 'Модель ответила без изображения.';
    } else {
      lastError = `Ошибка OpenRouter (${res.status}): ${formatApiError(res.status, bodyText, data)}`;
      allowChatFallback = res.status === 404 || res.status === 405;
      if (!allowChatFallback) {
        return { success: false, error: lastError };
      }
    }
  } catch (err) {
    lastError = `Ошибка сети: ${err.message}`;
    allowChatFallback = true;
    console.warn('/images endpoint failed, trying /chat/completions:', err);
  }

  if (!allowChatFallback) {
    return {
      success: false,
      error: lastError || 'Модель не вернула изображение. Проверьте VITE_OPENROUTER_IMAGE_MODEL в .env.'
    };
  }

  if (onStatusUpdate) onStatusUpdate('Повторный запрос через chat completions...');

  try {
    const res = await fetch(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.imageModel,
        messages: [{ role: 'user', content: finalPrompt }],
        modalities: ['image', 'text']
      })
    });

    const bodyText = await res.text();
    let data = null;
    try {
      data = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      return {
        success: false,
        error: `Ошибка OpenRouter (${res.status}): ${formatApiError(res.status, bodyText, data)}`
      };
    }

    const imageUrl = extractImageFromResponse(data);
    if (imageUrl) return okResult(imageUrl, config.imageModel);

    return {
      success: false,
      error: lastError || 'Модель не вернула изображение. Проверьте VITE_OPENROUTER_IMAGE_MODEL в .env.'
    };
  } catch (err) {
    console.error('OpenRouter API exception:', err);
    return {
      success: false,
      error: lastError || `Ошибка сети: ${err.message}`
    };
  }
}
