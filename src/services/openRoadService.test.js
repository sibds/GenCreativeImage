import { describe, expect, it, vi } from 'vitest';
import { generateCreativeImage } from './openRoadService.js';

describe('generateCreativeImage (client)', () => {
  it('posts prompt and mode to /api/generate without an Authorization header', async () => {
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({
      success: true,
      imageUrl: 'https://images.openrouter.ai/x.png',
      source: 'OpenRouter — google/gemini-3-pro-image',
      message: 'Готово'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    const result = await generateCreativeImage({ prompt: 'bear', mode: 'crest' });

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/generate');
    expect(init.headers.Authorization).toBeUndefined();
    expect(JSON.parse(init.body)).toEqual({ prompt: 'bear', mode: 'crest' });
  });
});
