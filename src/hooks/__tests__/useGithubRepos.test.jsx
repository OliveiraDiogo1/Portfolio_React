import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGithubRepos } from '../useGithubRepos.js';

const USERNAME = 'OliveiraDiogo1';
const CACHE_KEY = 'github:repos:v1';

const apiRepo = (overrides) => ({
  name: 'Portfolio_React',
  description: 'Portfolio source',
  html_url: 'https://github.com/OliveiraDiogo1/Portfolio_React',
  language: 'JavaScript',
  stargazers_count: 3,
  pushed_at: '2026-09-01T10:00:00Z',
  fork: false,
  archived: false,
  ...overrides,
});

describe('useGithubRepos', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads and maps repositories from the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [apiRepo(), apiRepo({ name: 'forked', fork: true })],
      })
    );

    const { result } = renderHook(() => useGithubRepos({ username: USERNAME }));

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.repos).toHaveLength(1);
    expect(result.current.repos[0]).toMatchObject({ name: 'Portfolio_React', stars: 3 });
  });

  it('serves fresh cache without calling the API', async () => {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ username: USERNAME, fetchedAt: Date.now(), repos: [{ name: 'cached', url: 'u' }] })
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useGithubRepos({ username: USERNAME }));

    expect(result.current.status).toBe('ready');
    expect(result.current.repos[0].name).toBe('cached');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refetches when the cache is stale', async () => {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        username: USERNAME,
        fetchedAt: Date.now() - 90 * 60 * 1000,
        repos: [{ name: 'stale', url: 'u' }],
      })
    );
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);

    renderHook(() => useGithubRepos({ username: USERNAME }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });

  it('reports an error state when the API fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const { result, rerender } = renderHook(() => useGithubRepos({ username: USERNAME }));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.repos).toEqual([]);

    rerender();
    rerender();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
