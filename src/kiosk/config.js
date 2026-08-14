export const KIOSK_STORAGE_KEY = 'kiosk';

export const KIOSK_DEFAULTS = {
  controls: false,
  kiosk: false,
  idleMs: 600_000,
  countdownMs: 30_000
};

export function parseBool(value, fallback = false) {
  if (value == null) return fallback;
  const v = String(value).trim().toLowerCase();
  if (v === '') return fallback;
  if (['1', 'true', 'yes', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'off'].includes(v)) return false;
  return fallback;
}

export function parseMs(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function parseKioskQuery(search) {
  const raw = search == null ? '' : String(search);
  const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
  if (!params.has('kiosk')) return null;
  const v = params.get('kiosk');
  if (v === '' || v == null) return true;
  return parseBool(v, true);
}

function readStoredKiosk(storage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(KIOSK_STORAGE_KEY);
    if (raw === '1') return true;
    if (raw === '0') return false;
  } catch {
    // sessionStorage can throw in locked-down Chrome kiosk profiles
  }
  return null;
}

export function getKioskConfig({ env, search, storage } = {}) {
  const e = env ?? (typeof import.meta !== 'undefined' ? import.meta.env : {});
  const controls = parseBool(e.VITE_KIOSK_CONTROLS, KIOSK_DEFAULTS.controls);
  const start = parseBool(e.VITE_KIOSK, KIOSK_DEFAULTS.kiosk);
  const idleMs = parseMs(e.VITE_KIOSK_IDLE_MS, KIOSK_DEFAULTS.idleMs);
  const countdownMs = parseMs(e.VITE_KIOSK_COUNTDOWN_MS, KIOSK_DEFAULTS.countdownMs);

  const searchStr = search ?? (typeof location !== 'undefined' ? location.search : '');
  const query = parseKioskQuery(searchStr);
  const store = storage ?? (typeof sessionStorage !== 'undefined' ? sessionStorage : null);
  const stored = readStoredKiosk(store);

  let kiosk = start;
  if (stored != null) kiosk = stored;
  if (query != null) kiosk = query;

  return { controls, kiosk, idleMs, countdownMs };
}

export function persistKiosk(on, { storage, history: hist, location: loc } = {}) {
  const store = storage ?? (typeof sessionStorage !== 'undefined' ? sessionStorage : null);
  try {
    store?.setItem(KIOSK_STORAGE_KEY, on ? '1' : '0');
  } catch {
    // ignore quota / disabled storage
  }

  const locationRef = loc ?? (typeof location !== 'undefined' ? location : null);
  const historyRef = hist ?? (typeof history !== 'undefined' ? history : null);
  if (!locationRef || !historyRef?.replaceState) return;

  const url = new URL(locationRef.href);
  if (on) url.searchParams.set('kiosk', '1');
  else url.searchParams.delete('kiosk');
  historyRef.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export function formatKioskCountdown(seconds) {
  const s = Math.max(0, Math.ceil(Number(seconds) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function computeKioskZoom({ clientWidth, clientHeight, scrollWidth, scrollHeight }) {
  if (!clientWidth || !clientHeight || !scrollWidth || !scrollHeight) return 1;
  return Math.min(1, clientWidth / scrollWidth, clientHeight / scrollHeight);
}
