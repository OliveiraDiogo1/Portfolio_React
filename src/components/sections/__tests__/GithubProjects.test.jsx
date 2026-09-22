import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { GithubProjects } from '../GithubProjects.jsx';
import { githubFeed } from '../../../data/projects.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

const apiRepo = (name, overrides = {}) => ({
  name,
  description: 'API description',
  html_url: `https://github.com/${githubFeed.username}/${name}`,
  language: 'JavaScript',
  stargazers_count: 4,
  pushed_at: '2026-09-01T10:00:00Z',
  fork: false,
  archived: false,
  ...overrides,
});

describe('GithubProjects', () => {
  beforeEach(() => sessionStorage.clear());

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the selected repositories with fallback copy while loading', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    renderWithProviders(<GithubProjects />);
    githubFeed.selected.forEach((repo) => {
      expect(screen.getByRole('link', { name: repo.name })).toHaveAttribute('href', repo.url);
      expect(screen.getByText(repo.description.en)).toBeInTheDocument();
    });
  });

  it('enriches cards with live stars when the API responds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [apiRepo('Portfolio_React', { stargazers_count: 7 })],
      })
    );
    renderWithProviders(<GithubProjects />);
    await waitFor(() => expect(screen.getByText(/7 stars/)).toBeInTheDocument());
  });

  it('shows the fallback notice when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    renderWithProviders(<GithubProjects />);
    await waitFor(() => expect(screen.getByText(/Live stats unavailable right now/i)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Portfolio_React' })).toBeInTheDocument();
  });
});
