import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchPrint, getDispatchConfig, resetDispatchRateLimit } from './dispatch.js';

const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const TG_ENV = {
  TELEGRAM_BOT_TOKEN: '123:token',
  TELEGRAM_CHAT_ID: '-1001234567890'
};

const SMTP_ENV = {
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '465',
  SMTP_SECURE: '1',
  SMTP_USER: 'print@example.com',
  SMTP_PASS: 'secret',
  DISPATCH_EMAIL_FROM: 'Print <print@example.com>',
  DISPATCH_EMAIL_TO: 'shop@example.com'
};

function telegramOk() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function telegramFail(description = 'chat not found') {
  return new Response(JSON.stringify({ ok: false, description }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}

describe('getDispatchConfig', () => {
  it('reports only booleans, no secrets', () => {
    const config = getDispatchConfig({ ...TG_ENV, ...SMTP_ENV });
    expect(config).toEqual({ telegram: true, email: true });
    expect(JSON.stringify(config)).not.toMatch(/token|secret/i);
  });

  it('telegram needs token and chat id', () => {
    expect(getDispatchConfig({ TELEGRAM_BOT_TOKEN: 'x' }).telegram).toBe(false);
    expect(getDispatchConfig(TG_ENV).telegram).toBe(true);
  });

  it('email needs host, to, and from or user+pass', () => {
    expect(getDispatchConfig({ SMTP_HOST: 'smtp.example.com' }).email).toBe(false);
    expect(getDispatchConfig(SMTP_ENV).email).toBe(true);
  });
});

describe('dispatchPrint', () => {
  beforeEach(() => {
    resetDispatchRateLimit();
  });

  it('returns 503 when no channels are configured', async () => {
    const fetchFn = vi.fn();
    const sendMailFn = vi.fn();
    const result = await dispatchPrint({
      body: { imageUrl: TINY_PNG, title: 'Герб' },
      ip: '1.1.1.1',
      env: {},
      fetchFn,
      sendMailFn
    });

    expect(result.status).toBe(503);
    expect(result.body.error).toBe('no_channels');
    expect(fetchFn).not.toHaveBeenCalled();
    expect(sendMailFn).not.toHaveBeenCalled();
  });

  it('returns 400 when imageUrl is missing', async () => {
    const result = await dispatchPrint({
      body: { title: 'Герб' },
      ip: '1.1.1.1',
      env: TG_ENV,
      fetchFn: vi.fn(),
      sendMailFn: vi.fn()
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toMatch(/imageUrl/i);
  });

  it('returns 400 for a bogus imageUrl', async () => {
    const result = await dispatchPrint({
      body: { imageUrl: 'not-an-image', title: 'Герб' },
      ip: '1.1.1.1',
      env: TG_ENV,
      fetchFn: vi.fn(),
      sendMailFn: vi.fn()
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });

  it('sends only to Telegram when SMTP is unset', async () => {
    const fetchFn = vi.fn(async () => telegramOk());
    const sendMailFn = vi.fn();

    const result = await dispatchPrint({
      body: { imageUrl: TINY_PNG, title: 'Герб', metadata: 'Медведь' },
      ip: '1.1.1.1',
      env: TG_ENV,
      fetchFn,
      sendMailFn
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true, telegram: { ok: true } });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(String(fetchFn.mock.calls[0][0])).toContain('api.telegram.org/bot123:token/sendPhoto');
    expect(sendMailFn).not.toHaveBeenCalled();
  });

  it('sends only email when Telegram is unset', async () => {
    const fetchFn = vi.fn();
    const sendMailFn = vi.fn(async () => {});

    const result = await dispatchPrint({
      body: { imageUrl: TINY_PNG, title: 'Орнамент' },
      ip: '1.1.1.1',
      env: SMTP_ENV,
      fetchFn,
      sendMailFn
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true, email: { ok: true } });
    expect(fetchFn).not.toHaveBeenCalled();
    expect(sendMailFn).toHaveBeenCalledTimes(1);
    expect(sendMailFn.mock.calls[0][0].to).toBe('shop@example.com');
  });

  it('fans out to both channels', async () => {
    const fetchFn = vi.fn(async () => telegramOk());
    const sendMailFn = vi.fn(async () => {});

    const result = await dispatchPrint({
      body: { imageUrl: TINY_PNG, title: 'Герб' },
      ip: '1.1.1.1',
      env: { ...TG_ENV, ...SMTP_ENV },
      fetchFn,
      sendMailFn
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      success: true,
      telegram: { ok: true },
      email: { ok: true }
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(sendMailFn).toHaveBeenCalledTimes(1);
  });

  it('returns 200 when Telegram succeeds and SMTP fails', async () => {
    const fetchFn = vi.fn(async () => telegramOk());
    const sendMailFn = vi.fn(async () => {
      throw new Error('SMTP down');
    });

    const result = await dispatchPrint({
      body: { imageUrl: TINY_PNG, title: 'Герб' },
      ip: '1.1.1.1',
      env: { ...TG_ENV, ...SMTP_ENV },
      fetchFn,
      sendMailFn
    });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.telegram).toEqual({ ok: true });
    expect(result.body.email).toEqual({ ok: false, error: 'SMTP down' });
  });

  it('returns 502 when every configured channel fails', async () => {
    const fetchFn = vi.fn(async () => telegramFail());
    const sendMailFn = vi.fn(async () => {
      throw new Error('SMTP down');
    });

    const result = await dispatchPrint({
      body: { imageUrl: TINY_PNG, title: 'Герб' },
      ip: '1.1.1.1',
      env: { ...TG_ENV, ...SMTP_ENV },
      fetchFn,
      sendMailFn
    });

    expect(result.status).toBe(502);
    expect(result.body.success).toBe(false);
    expect(result.body.telegram.ok).toBe(false);
    expect(result.body.email.ok).toBe(false);
  });

  it('loads https imageUrl then posts the bytes to Telegram', async () => {
    const fetchFn = vi.fn(async (url) => {
      if (String(url).startsWith('https://images.example/x.png')) {
        return new Response(Buffer.from('fakejpeg'), {
          status: 200,
          headers: { 'content-type': 'image/jpeg' }
        });
      }
      return telegramOk();
    });

    const result = await dispatchPrint({
      body: { imageUrl: 'https://images.example/x.png', title: 'Герб' },
      ip: '1.1.1.1',
      env: TG_ENV,
      fetchFn,
      sendMailFn: vi.fn()
    });

    expect(result.status).toBe(200);
    expect(result.body.telegram.ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
