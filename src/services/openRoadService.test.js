import { describe, expect, it, vi } from 'vitest';
import { generateCreativeImage } from './openRoadService.js';

const JOB_ID = '11111111-1111-4111-8111-111111111111';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

describe('generateCreativeImage (client)', () => {
  it('posts prompt and mode to /api/generate without an Authorization header, then polls', async () => {
    globalThis.fetch = vi.fn(async (url, init) => {
      if (init?.method === 'POST') {
        return jsonResponse({ jobId: JOB_ID, status: 'pending' }, 202);
      }
      return jsonResponse({
        success: true,
        imageUrl: 'https://images.openrouter.ai/x.png',
        source: 'OpenRouter — google/gemini-3-pro-image',
        message: 'Готово'
      });
    });

    const result = await generateCreativeImage({ prompt: 'bear', mode: 'crest', pollMs: 0 });

    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('https://images.openrouter.ai/x.png');
    expect(fetch).toHaveBeenCalledTimes(2);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/generate');
    expect(init.headers.Authorization).toBeUndefined();
    expect(JSON.parse(init.body)).toEqual({ prompt: 'bear', mode: 'crest' });
    expect(fetch.mock.calls[1][0]).toBe(`/api/generate?job=${JOB_ID}`);
  });

  it('polls through pending until the job succeeds', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ jobId: JOB_ID, status: 'pending' }, 202))
      .mockResolvedValueOnce(jsonResponse({ status: 'pending' }))
      .mockResolvedValueOnce(jsonResponse({
        success: true,
        imageUrl: 'https://images.openrouter.ai/x.png'
      }));

    const result = await generateCreativeImage({ prompt: 'bear', mode: 'crest', pollMs: 0 });

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('surfaces a Vercel 504 HTML timeout as a readable error', async () => {
    globalThis.fetch = vi.fn(async () => new Response(
      '<html><body>FUNCTION_INVOCATION_TIMEOUT</body></html>',
      { status: 504, headers: { 'Content-Type': 'text/html' } }
    ));

    const result = await generateCreativeImage({ prompt: 'bear', mode: 'crest' });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/таймаут|timeout/i);
  });
});
