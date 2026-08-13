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

    const data = await res.json().catch(() => null);
    if (!data) return gatewayTimeoutError(res.status);
    return data;
  } catch (err) {
    return { success: false, error: `Ошибка сети: ${err.message}` };
  }
}
