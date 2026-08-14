import { describe, expect, it } from 'vitest';
import {
  KIOSK_DEFAULTS,
  computeKioskZoom,
  formatKioskCountdown,
  getKioskConfig,
  parseBool,
  parseKioskQuery,
  parseMs,
  persistKiosk
} from './config.js';

describe('parseBool / parseMs', () => {
  it('parses common truthy/falsy strings', () => {
    expect(parseBool('1')).toBe(true);
    expect(parseBool('true')).toBe(true);
    expect(parseBool('0')).toBe(false);
    expect(parseBool('off')).toBe(false);
    expect(parseBool('', false)).toBe(false);
    expect(parseBool(undefined, true)).toBe(true);
  });

  it('falls back on empty or NaN ms', () => {
    expect(parseMs('600000', 1)).toBe(600000);
    expect(parseMs('0', 99)).toBe(0);
    expect(parseMs('', 30_000)).toBe(30_000);
    expect(parseMs('nope', 30_000)).toBe(30_000);
    expect(parseMs('-1', 30_000)).toBe(30_000);
  });
});

describe('parseKioskQuery', () => {
  it('returns null when the param is absent', () => {
    expect(parseKioskQuery('')).toBeNull();
    expect(parseKioskQuery('?foo=1')).toBeNull();
  });

  it('treats bare ?kiosk as on; ?kiosk=0 as off', () => {
    expect(parseKioskQuery('?kiosk')).toBe(true);
    expect(parseKioskQuery('?kiosk=1')).toBe(true);
    expect(parseKioskQuery('kiosk=0')).toBe(false);
  });
});

describe('getKioskConfig', () => {
  const emptyEnv = {};

  it('uses defaults when env is empty', () => {
    expect(getKioskConfig({ env: emptyEnv, search: '', storage: null })).toEqual({
      controls: KIOSK_DEFAULTS.controls,
      kiosk: KIOSK_DEFAULTS.kiosk,
      idleMs: KIOSK_DEFAULTS.idleMs,
      countdownMs: KIOSK_DEFAULTS.countdownMs
    });
  });

  it('reads timers and flags from env', () => {
    const cfg = getKioskConfig({
      env: {
        VITE_KIOSK_CONTROLS: '1',
        VITE_KIOSK: '1',
        VITE_KIOSK_IDLE_MS: '120000',
        VITE_KIOSK_COUNTDOWN_MS: '15000'
      },
      search: '',
      storage: null
    });
    expect(cfg).toEqual({
      controls: true,
      kiosk: true,
      idleMs: 120000,
      countdownMs: 15000
    });
  });

  it('lets query override env and sessionStorage', () => {
    const storage = { getItem: () => '1' };
    expect(getKioskConfig({
      env: { VITE_KIOSK: '0' },
      search: '?kiosk=1',
      storage
    }).kiosk).toBe(true);
    expect(getKioskConfig({
      env: { VITE_KIOSK: '1' },
      search: '?kiosk=0',
      storage
    }).kiosk).toBe(false);
  });

  it('uses sessionStorage when query is absent', () => {
    expect(getKioskConfig({
      env: { VITE_KIOSK: '0' },
      search: '',
      storage: { getItem: () => '1' }
    }).kiosk).toBe(true);
  });
});

describe('persistKiosk', () => {
  it('writes sessionStorage and replaceState', () => {
    const stored = {};
    const storage = {
      setItem: (k, v) => { stored[k] = v; }
    };
    const replaceState = (state, title, url) => { stored.url = url; };
    persistKiosk(true, {
      storage,
      history: { replaceState },
      location: { href: 'http://localhost:5173/' }
    });
    expect(stored.kiosk).toBe('1');
    expect(stored.url).toBe('/?kiosk=1');

    persistKiosk(false, {
      storage,
      history: { replaceState },
      location: { href: 'http://localhost:5173/?kiosk=1' }
    });
    expect(stored.kiosk).toBe('0');
    expect(stored.url).toBe('/');
  });
});

describe('formatKioskCountdown / computeKioskZoom', () => {
  it('formats mm:ss', () => {
    expect(formatKioskCountdown(29)).toBe('0:29');
    expect(formatKioskCountdown(90)).toBe('1:30');
    expect(formatKioskCountdown(0)).toBe('0:00');
  });

  it('never zooms above 1 and scales to the tighter axis', () => {
    expect(computeKioskZoom({
      clientWidth: 1920, clientHeight: 1080, scrollWidth: 1920, scrollHeight: 1080
    })).toBe(1);
    expect(computeKioskZoom({
      clientWidth: 960, clientHeight: 1080, scrollWidth: 1920, scrollHeight: 1080
    })).toBe(0.5);
    expect(computeKioskZoom({
      clientWidth: 1920, clientHeight: 540, scrollWidth: 1920, scrollHeight: 1080
    })).toBe(0.5);
  });
});
