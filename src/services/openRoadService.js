const LOCAL_CONFIG_KEY = 'openroad_api_config';
const DEFAULT_POLL_MS = 2000;
const DEFAULT_POLL_TIMEOUT_MS = 4 * 60 * 1000;

function scrubLegacyClientSecrets() {
  try {
    localStorage.removeItem(LOCAL_CONFIG_KEY);
  } catch {
    // ignore
  }
}

function gatewayTimeoutError(status) {
  return {
    success: false,
    error: status === 504
      ? 'Таймаут Vercel (504): генерация изображения не успела завершиться. Повторите попытку.'
      : `Ошибка сервера (${status})`
  };
}

function sleep(ms) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(res) {
  const data = await res.json().catch(() => null);
  if (!data) return gatewayTimeoutError(res.status);
  return data;
}

async function pollJob(jobId, { pollMs, pollTimeoutMs, onStatusUpdate }) {
  const deadline = Date.now() + pollTimeoutMs;

  while (Date.now() < deadline) {
    const res = await fetch(`/api/generate?job=${encodeURIComponent(jobId)}`);
    const data = await readJson(res);
    if (data.error && !data.status) return data;
    if (data.status === 'pending') {
      if (onStatusUpdate) onStatusUpdate('Генерация изображения...');
      await sleep(pollMs);
      continue;
    }
    return data;
  }

  return { success: false, error: 'Таймаут: генерация не завершилась.' };
}

/**
 * Generate a creative image via the server-side OpenRouter proxy.
 * The API key never leaves the server.
 */
export async function generateCreativeImage({
  prompt,
  mode = 'crest',
  onStatusUpdate,
  pollMs = DEFAULT_POLL_MS,
  pollTimeoutMs = DEFAULT_POLL_TIMEOUT_MS
}) {
  scrubLegacyClientSecrets();

  if (onStatusUpdate) onStatusUpdate('Генерация изображения...');

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode })
    });

    const data = await readJson(res);
    if (data.error && !data.jobId) return data;
    if (!data.jobId) return data;

    return await pollJob(data.jobId, { pollMs, pollTimeoutMs, onStatusUpdate });
  } catch (err) {
    return { success: false, error: `Ошибка сети: ${err.message}` };
  }
}
