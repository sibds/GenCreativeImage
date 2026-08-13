import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleGenerate, resetRateLimit } from './generate.js';

const ENV = {
  OPENROUTER_API_KEY: 'sk-or-v1-server-secret',
  OPENROUTER_IMAGE_MODEL: 'google/gemini-3-pro-image',
  OPENROUTER_TEXT_MODEL: '',
  OPENROUTER_ENDPOINT: 'https://openrouter.ai/api/v1'
};

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

describe('handleGenerate', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns 400 when prompt is missing', async () => {
    const result = await handleGenerate({
      body: { mode: 'crest' },
      ip: '1.1.1.1',
      env: ENV,
      fetchFn: vi.fn()
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.error).toMatch(/prompt/i);
  });

  it('rejects invalid mode', async () => {
    const result = await handleGenerate({
      body: { prompt: 'x', mode: 'admin' },
      ip: '1.1.1.1',
      env: ENV,
      fetchFn: vi.fn()
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });

  it('returns 503 when server key is missing', async () => {
    const fetchFn = vi.fn();
    const result = await handleGenerate({
      body: { prompt: 'crest', mode: 'crest' },
      ip: '1.1.1.1',
      env: { ...ENV, OPENROUTER_API_KEY: '' },
      fetchFn
    });

    expect(result.status).toBe(503);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('does not call OpenRouter with a client-supplied apiKey, endpoint, or model', async () => {
    const fetchFn = vi.fn(async () => jsonResponse(200, {
      data: [{ url: 'https://images.openrouter.ai/x.png' }]
    }));

    await handleGenerate({
      body: {
        prompt: 'a bear crest',
        mode: 'crest',
        apiKey: 'sk-or-v1-stolen-from-client',
        endpoint: 'https://evil.example/api/v1',
        imageModel: 'openai/gpt-image-1'
      },
      ip: '1.1.1.1',
      env: ENV,
      fetchFn
    });

    expect(fetchFn).toHaveBeenCalled();
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('https://openrouter.ai/api/v1/images');
    expect(init.headers.Authorization).toBe('Bearer sk-or-v1-server-secret');
    expect(JSON.parse(init.body).model).toBe('google/gemini-3-pro-image');
  });

  it('does not leak the api key in the response', async () => {
    const fetchFn = vi.fn(async () => jsonResponse(200, {
      data: [{ url: 'https://images.openrouter.ai/x.png' }]
    }));

    const result = await handleGenerate({
      body: { prompt: 'a bear crest', mode: 'crest' },
      ip: '1.1.1.1',
      env: ENV,
      fetchFn
    });

    expect(result.body.success).toBe(true);
    expect(result.body.imageUrl).toBe('https://images.openrouter.ai/x.png');
    expect(JSON.stringify(result)).not.toContain('sk-or-v1-server-secret');
  });

  it('rate-limits repeated requests from the same IP', async () => {
    const fetchFn = vi.fn(async () => jsonResponse(200, {
      data: [{ url: 'https://images.openrouter.ai/x.png' }]
    }));
    const req = {
      body: { prompt: 'a bear crest', mode: 'crest' },
      ip: '9.9.9.9',
      env: ENV,
      fetchFn,
      rateLimit: { windowMs: 60_000, max: 2 }
    };

    expect((await handleGenerate(req)).status).toBe(200);
    expect((await handleGenerate(req)).status).toBe(200);
    expect((await handleGenerate(req)).status).toBe(429);
  });
});
