import { githubFeed } from '../../data/projects.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { mergeSelected, useGithubRepos } from '../../hooks/useGithubRepos.js';
import { relativeTime } from '../../utils/format.js';

export function GithubProjects() {
  const { t, lang } = useLanguage();
  const { status, repos } = useGithubRepos({ username: githubFeed.username });
  const cards = mergeSelected(githubFeed.selected, repos);

  return (
    <div className="mt-24 border-t border-line pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-ink">{t(ui.projects.github.title)}</h3>
          <p className="mt-2 text-base text-muted">{t(ui.projects.github.subtitle)}</p>
        </div>
        <a
          href={`https://github.com/${githubFeed.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet text-sm font-semibold"
        >
          {t(ui.projects.github.viewAll)}
        </a>
      </div>

      {status === 'error' ? <p className="mt-6 text-sm text-muted">{t(ui.projects.github.liveUnavailable)}</p> : null}

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((repo) => (
          <li key={repo.name} className="flex flex-col border border-line bg-surface p-5">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {repo.name}
            </a>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t(repo.description)}</p>
            <p className="label tnum mt-5">
              {repo.language ? `${repo.language} · ` : ''}
              {typeof repo.stars === 'number' && repo.stars > 0 ? `${t(ui.projects.github.stars, { count: repo.stars })} · ` : ''}
              {repo.pushedAt ? t(ui.projects.github.updated, { when: relativeTime(repo.pushedAt, lang) }) : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
