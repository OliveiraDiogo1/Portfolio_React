import { useEffect, useState } from 'react';

const CACHE_KEY = 'github:repos:v1';
const MAX_AGE_MS = 60 * 60 * 1000;

function readCache(username, now) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed?.username !== username || typeof parsed?.fetchedAt !== 'number' || !Array.isArray(parsed?.repos)) {
      return null;
    }
    if (now - parsed.fetchedAt > MAX_AGE_MS) {
      return null;
    }
    return parsed.repos;
  } catch {
    return null;
  }
}

function writeCache(username, repos, now) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ username, fetchedAt: now, repos }));
  } catch {
    // storage unavailable — the section still renders from live data
  }
}

export function mapRepo(repo) {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
  };
}

export function mergeSelected(selected, liveRepos) {
  return selected.map((entry) => {
    const live = liveRepos.find((repo) => repo.name.toLowerCase() === entry.name.toLowerCase());
    return {
      name: entry.name,
      description: entry.description,
      url: live?.url ?? entry.url,
      language: live?.language ?? null,
      stars: live?.stars ?? null,
      pushedAt: live?.pushedAt ?? null,
    };
  });
}

export function useGithubRepos({ username }) {
  const [state, setState] = useState(() => {
    const cached = readCache(username, Date.now());
    return cached ? { status: 'ready', repos: cached } : { status: 'loading', repos: [] };
  });

  useEffect(() => {
    const cached = readCache(username, Date.now());
    if (cached) {
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub API responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }
        const mapped = data.filter((repo) => !repo.fork && !repo.archived).map(mapRepo);
        writeCache(username, mapped, Date.now());
        setState({ status: 'ready', repos: mapped });
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', repos: [] });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [username]);

  return state;
}
