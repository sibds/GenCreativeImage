import { parseEnv } from 'node:util';

const LITERAL_KEYS = new Set([
  'OPENROUTER_API_KEY',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'DISPATCH_EMAIL_FROM',
  'DISPATCH_EMAIL_TO'
]);

/**
 * Vite loadEnv runs dotenv-expand, which eats `$` inside secrets (SMTP_PASS).
 * Overlay values parsed without expansion.
 */
export function overlayUnexpandedSecrets(env, source) {
  if (!source) return env;
  const parsed = parseEnv(source);
  const out = { ...env };
  for (const key of LITERAL_KEYS) {
    if (parsed[key] != null && parsed[key] !== '') out[key] = parsed[key];
  }
  return out;
}
