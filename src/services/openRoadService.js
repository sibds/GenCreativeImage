const LOCAL_CONFIG_KEY = 'openroad_api_config';

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

async function readSseJson(res) {
  const reader = res.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder();
  let buf = '';
  let lastData = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop() || '';
    for (const block of parts) {
      for (const line of block.split('\n')) {
        if (!line.startsWith('data:')) continue;
        try {
          lastData = JSON.parse(line.slice(5).trim());
        } catch {
          // keep last good event
        }
      }
    }
  }

  return lastData;
}

/**
 * Generate a creative image via the server-side OpenRouter proxy.
 * The API key never leaves the server.
 */
export async function generateCreativeImage({ prompt, mode = 'crest', onStatusUpdate }) {
  scrubLegacyClientSecrets();

  if (onStatusUpdate) onStatusUpdate('Генерация изображения...');

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/event-stream')) {
      const data = await readSseJson(res);
      if (data) return data;
      return gatewayTimeoutError(res.status || 504);
    }

    const data = await res.json().catch(() => null);
    if (!data) return gatewayTimeoutError(res.status);
    return data;
  } catch (err) {
    return { success: false, error: `Ошибка сети: ${err.message}` };
  }
}
