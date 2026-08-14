const LEGACY_TELEGRAM_KEY = 'telegram_bot_config';

function scrubLegacyClientSecrets() {
  try {
    localStorage.removeItem(LEGACY_TELEGRAM_KEY);
  } catch {
    // ignore
  }
}

export function hasDispatchChannels(config) {
  return Boolean(config?.telegram || config?.email);
}

export async function fetchDispatchConfig() {
  scrubLegacyClientSecrets();
  try {
    const res = await fetch('/api/dispatch');
    const data = await res.json().catch(() => ({}));
    return {
      telegram: Boolean(data.telegram),
      email: Boolean(data.email)
    };
  } catch {
    return { telegram: false, email: false };
  }
}

export function formatDispatchMessage(data) {
  if (!data) return 'Не отправлено';
  const parts = [];
  if (data.telegram) {
    parts.push(data.telegram.ok ? 'Telegram' : `Telegram: ${data.telegram.error}`);
  }
  if (data.email) {
    parts.push(data.email.ok ? 'Email' : `Email: ${data.email.error}`);
  }
  const anyFail = Boolean(
    (data.telegram && !data.telegram.ok) || (data.email && !data.email.ok)
  );
  if (data.success && anyFail) {
    return parts.length ? `Частично: ${parts.join(' · ')}` : 'Частично отправлено';
  }
  if (data.success) {
    return parts.length ? `Отправлено: ${parts.join(' · ')}` : 'Отправлено';
  }
  return data.error === 'no_channels'
    ? 'Каналы печати не настроены на сервере'
    : (data.error || parts.join(' · ') || 'Не отправлено');
}

export async function dispatchPrint({ imageUrl, title, metadata }) {
  try {
    const res = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, title, metadata })
    });
    const data = await res.json().catch(() => ({}));
    if (!data.telegram && !data.email && data.error) {
      return { success: false, message: formatDispatchMessage(data), ...data };
    }
    return {
      success: Boolean(data.success),
      message: formatDispatchMessage(data),
      ...data
    };
  } catch (err) {
    return { success: false, message: `Ошибка сети: ${err.message}` };
  }
}
