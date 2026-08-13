import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryStore, resetMemoryStore } from './jobStore.js';
import { getGenerateJob, runGenerateJob, startGenerateJob } from './jobs.js';
import { resetRateLimit } from './generate.js';

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

describe('generate jobs', () => {
  beforeEach(() => {
    resetMemoryStore();
    resetRateLimit();
  });

  it('starts a pending job with a uuid', async () => {
    const store = createMemoryStore();
    const started = await startGenerateJob({ store });

    expect(started.status).toBe(202);
    expect(started.body.status).toBe('pending');
    expect(started.jobId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(await store.get(started.jobId)).toEqual({ status: 'pending' });
  });

  it('rejects a malformed job id', async () => {
    const result = await getGenerateJob({ jobId: 'nope', store: createMemoryStore() });
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });

  it('returns 404 for an unknown uuid', async () => {
    const result = await getGenerateJob({
      jobId: '11111111-1111-4111-8111-111111111111',
      store: createMemoryStore()
    });
    expect(result.status).toBe(404);
  });

  it('returns pending until the worker writes a result', async () => {
    const store = createMemoryStore();
    const { jobId } = await startGenerateJob({ store });

    expect((await getGenerateJob({ jobId, store })).body).toEqual({ status: 'pending' });

    const fetchFn = vi.fn(async () => jsonResponse(200, {
      data: [{ url: 'https://images.openrouter.ai/x.png' }]
    }));

    await runGenerateJob({
      jobId,
      body: { prompt: 'a bear crest', mode: 'crest' },
      ip: '1.1.1.1',
      env: ENV,
      store,
      fetchFn
    });

    const done = await getGenerateJob({ jobId, store });
    expect(done.status).toBe(200);
    expect(done.body.success).toBe(true);
    expect(done.body.imageUrl).toBe('https://images.openrouter.ai/x.png');
  });
});
