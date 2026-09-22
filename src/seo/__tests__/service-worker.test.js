// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');

function response(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    body,
    clone() {
      return response(body, { ok, status });
    },
  };
}

function createHarness(fetchMock) {
  const listeners = {};
  const store = new Map();
  const putCalls = [];

  const cache = {
    match: async (request) => (store.has(request.url ?? request) ? store.get(request.url ?? request) : undefined),
    put: async (request, res) => {
      putCalls.push(request.url ?? request);
      store.set(request.url ?? request, res);
    },
  };

  const caches = {
    open: async () => cache,
    match: async (request) => (store.has(request.url ?? request) ? store.get(request.url ?? request) : undefined),
    keys: async () => ['portfolio-v1'],
    delete: async () => true,
  };

  const self = {
    addEventListener: (type, handler) => {
      listeners[type] = handler;
    },
    skipWaiting: () => {},
    clients: { claim: async () => {} },
  };

  const location = { origin: 'https://devdiogo.pt' };

  // eslint-disable-next-line no-new-func
  new Function('self', 'caches', 'location', 'fetch', SOURCE)(self, caches, location, fetchMock);

  return { listeners, store, putCalls };
}

async function dispatchFetch(harness, { url, mode = 'cors' }) {
  let result;
  const request = { method: 'GET', mode, url, clone() { return this; } };
  harness.listeners.fetch({
    request,
    respondWith: (promise) => {
      result = promise;
    },
    waitUntil: () => {},
  });
  return result;
}

describe('service worker fetch strategies', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
  });

  it('does not cache non-OK responses', async () => {
    fetchMock.mockResolvedValue(response('missing', { ok: false, status: 404 }));
    const harness = createHarness(fetchMock);

    await dispatchFetch(harness, { url: 'https://devdiogo.pt/assets/index-abc123456.js' });

    expect(harness.putCalls).toEqual([]);
  });

  it('serves hashed build assets cache-first', async () => {
    const cached = response('cached-js');
    const harness = createHarness(fetchMock);
    harness.store.set('https://devdiogo.pt/assets/index-abc123456.js', cached);

    const result = await dispatchFetch(harness, { url: 'https://devdiogo.pt/assets/index-abc123456.js' });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.body).toBe('cached-js');
  });

  it('serves unhashed public assets network-first so updated files are not stale', async () => {
    const harness = createHarness(fetchMock);
    harness.store.set('https://devdiogo.pt/assets/cv-diogo-oliveira.pdf', response('old-cv'));
    fetchMock.mockResolvedValue(response('new-cv'));

    const result = await dispatchFetch(harness, { url: 'https://devdiogo.pt/assets/cv-diogo-oliveira.pdf' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.body).toBe('new-cv');
  });

  it('falls back to the cached copy when the network fails for an unhashed asset', async () => {
    const harness = createHarness(fetchMock);
    harness.store.set('https://devdiogo.pt/assets/cv-diogo-oliveira.pdf', response('old-cv'));
    fetchMock.mockRejectedValue(new Error('offline'));

    const result = await dispatchFetch(harness, { url: 'https://devdiogo.pt/assets/cv-diogo-oliveira.pdf' });

    expect(result.body).toBe('old-cv');
  });

  it('uses network-first for navigations', async () => {
    const harness = createHarness(fetchMock);
    harness.store.set('https://devdiogo.pt/', response('cached-shell'));
    fetchMock.mockResolvedValue(response('fresh-shell'));

    const result = await dispatchFetch(harness, { url: 'https://devdiogo.pt/', mode: 'navigate' });

    expect(result.body).toBe('fresh-shell');
  });

  it('falls back to the cached shell when a navigation is offline', async () => {
    const harness = createHarness(fetchMock);
    harness.store.set('https://devdiogo.pt/', response('cached-shell'));
    fetchMock.mockRejectedValue(new Error('offline'));

    const result = await dispatchFetch(harness, { url: 'https://devdiogo.pt/', mode: 'navigate' });

    expect(result.body).toBe('cached-shell');
  });
});
