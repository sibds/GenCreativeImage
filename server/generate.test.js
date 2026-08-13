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

  it('asks OpenRouter for a compact jpeg so the Vercel payload stays under 4.5MB', async () => {
    const fetchFn = vi.fn(async () => jsonResponse(200, {
      data: [{ url: 'https://images.openrouter.ai/x.png' }]
    }));

    await handleGenerate({
      body: { prompt: 'a bear crest', mode: 'crest' },
      ip: '1.1.1.1',
      env: ENV,
      fetchFn
    });

    const body = JSON.parse(fetchFn.mock.calls[0][1].body);
    expect(body.output_format).toBe('jpeg');
    expect(body.resolution).toBe('1K');
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
    expect(result.body.prompt).toBe('a bear crest');
    expect(JSON.stringify(result)).not.toContain('sk-or-v1-server-secret');
  });

  it('returns the enhanced prompt that was sent to the image model', async () => {
    const fetchFn = vi.fn(async (url) => {
      if (String(url).endsWith('/chat/completions')) {
        return jsonResponse(200, {
          choices: [{ message: { content: 'Enhanced heraldic bear crest, gold filigree' } }]
        });
      }
      return jsonResponse(200, {
        data: [{ url: 'https://images.openrouter.ai/x.png' }]
      });
    });

    const result = await handleGenerate({
      body: { prompt: 'a bear crest', mode: 'crest' },
      ip: '1.1.1.1',
      env: { ...ENV, OPENROUTER_TEXT_MODEL: 'openai/gpt-4o-mini' },
      fetchFn
    });

    expect(result.body.success).toBe(true);
    expect(result.body.prompt).toBe('Enhanced heraldic bear crest, gold filigree');
    const imageCall = fetchFn.mock.calls.find(([url]) => String(url).endsWith('/images'));
    expect(JSON.parse(imageCall[1].body).prompt).toBe(result.body.prompt);
  });

  it('asks the text model for flat folk illustration, not photorealistic heraldry', async () => {
    const fetchFn = vi.fn(async (url) => {
      if (String(url).endsWith('/chat/completions')) {
        return jsonResponse(200, {
          choices: [{ message: { content: 'flat 2D folk illustration of a bear crest' } }]
        });
      }
      return jsonResponse(200, {
        data: [{ url: 'https://images.openrouter.ai/x.png' }]
      });
    });

    await handleGenerate({
      body: { prompt: 'a bear crest', mode: 'crest' },
      ip: '1.1.1.1',
      env: { ...ENV, OPENROUTER_TEXT_MODEL: 'openai/gpt-4o-mini' },
      fetchFn
    });

    const chatCall = fetchFn.mock.calls.find(([url]) => String(url).endsWith('/chat/completions'));
    const system = JSON.parse(chatCall[1].body).messages[0].content;
    expect(system).toMatch(/Family emblem, ethnographic folk crest/);
    expect(system).toMatch(/Preserve its structure/i);
    expect(system).toMatch(/Keep the named animal and the named shield geometry/);
    expect(system).toMatch(/Do not substitute a bear or a pointed heater shield/);
    expect(system).toMatch(/Avoid list must remain/);
    expect(system).not.toMatch(/masterwork royal coat of arms/i);
    expect(system).not.toMatch(/elemental aura effects/i);
    expect(system).not.toMatch(/Rewrite the user's family crest/i);
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
