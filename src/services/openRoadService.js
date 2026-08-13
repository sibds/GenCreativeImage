const LOCAL_CONFIG_KEY = 'openroad_api_config';

function scrubLegacyClientSecrets() {
  try {
    localStorage.removeItem(LOCAL_CONFIG_KEY);
  } catch {
    // ignore
  }
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
    if (!data) {
      return { success: false, error: `Ошибка сервера (${res.status})` };
    }
    return data;
  } catch (err) {
    return { success: false, error: `Ошибка сети: ${err.message}` };
  }
}
