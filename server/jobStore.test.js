import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBlobStore,
  createJobStore,
  createMemoryStore,
  hasBlobConfig,
  resetMemoryStore
} from './jobStore.js';

describe('jobStore', () => {
  beforeEach(() => {
    resetMemoryStore();
    delete process.env.VERCEL;
  });

  it('round-trips pending then done in memory', async () => {
    const store = createMemoryStore();
    await store.set('job-1', { status: 'pending' });
    expect(await store.get('job-1')).toEqual({ status: 'pending' });

    await store.set('job-1', { success: true, imageUrl: 'https://images.openrouter.ai/x.png' });
    expect(await store.get('job-1')).toEqual({
      success: true,
      imageUrl: 'https://images.openrouter.ai/x.png'
    });
  });

  it('returns null for an unknown job', async () => {
    const store = createMemoryStore();
    expect(await store.get('missing')).toBeNull();
  });

  it('uses memory when VERCEL is unset', async () => {
    const store = createJobStore({});
    await store.set('shared', { status: 'pending' });
    expect(await createMemoryStore().get('shared')).toEqual({ status: 'pending' });
  });

  it('uses memory on Vercel when blob credentials are missing', async () => {
    expect(hasBlobConfig({ VERCEL: '1' })).toBe(false);
    const store = createJobStore({ VERCEL: '1' });
    await store.set('vercel-fallback', { status: 'pending' });
    expect(await store.get('vercel-fallback')).toEqual({ status: 'pending' });
  });

  it('uses blob on Vercel when BLOB_READ_WRITE_TOKEN is set', () => {
    expect(hasBlobConfig({ VERCEL: '1', BLOB_READ_WRITE_TOKEN: 'blob_rw_test' })).toBe(true);
  });

  it('writes and reads JSON through the blob adapter with BLOB_STORE_ID', async () => {
    let stored = '';
    const putFn = vi.fn(async (_path, body) => {
      stored = body;
    });
    const getFn = vi.fn(async () => ({
      statusCode: 200,
      stream: new Blob([stored]).stream()
    }));

    const store = createBlobStore({
      putFn,
      getFn,
      env: { BLOB_STORE_ID: 'store_hobby_test' }
    });
    await store.set('11111111-1111-4111-8111-111111111111', { status: 'pending' });
    expect(putFn).toHaveBeenCalledWith(
      'jobs/11111111-1111-4111-8111-111111111111.json',
      JSON.stringify({ status: 'pending' }),
      expect.objectContaining({
        access: 'private',
        allowOverwrite: true,
        storeId: 'store_hobby_test',
        cacheControlMaxAge: 60
      })
    );
    expect(await store.get('11111111-1111-4111-8111-111111111111')).toEqual({ status: 'pending' });
    expect(getFn).toHaveBeenCalledWith(
      'jobs/11111111-1111-4111-8111-111111111111.json',
      expect.objectContaining({ access: 'private', storeId: 'store_hobby_test', useCache: false })
    );
  });
});
