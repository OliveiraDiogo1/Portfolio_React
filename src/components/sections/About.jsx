import { education } from '../../data/education.js';
import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function About() {
  const { t } = useLanguage();

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-10">
      <div className="space-y-5 md:col-span-7">
        {ui.about.paragraphs.map((paragraph, index) => (
          <p key={index} className="measure text-base leading-relaxed text-ink/85">
            {t(paragraph)}
          </p>
        ))}
      </div>

      <div className="md:col-span-5 md:border-l md:border-line md:pl-10">
        <h3 className="label">{t(ui.about.factsTitle)}</h3>
        <dl className="mt-5 space-y-4 text-base">
          <div>
            <dt className="text-sm text-muted">{t(ui.about.locationLabel)}</dt>
            <dd className="text-ink">Porto, Portugal</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t(ui.about.emailLabel)}</dt>
            <dd>
              <a href={`mailto:${profile.email}`} className="link-quiet text-ink">
                {profile.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t(ui.about.linksLabel)}</dt>
            <dd className="flex gap-5 pt-1 text-sm font-semibold">
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-quiet">
                GitHub
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet">
                LinkedIn
              </a>
            </dd>
          </div>
        </dl>

        <h3 className="label mt-10">{t(ui.about.languagesTitle)}</h3>
        <ul className="mt-5 space-y-2 text-base">
          {profile.languages.map((language) => (
            <li key={language.id} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <span className="text-ink">{t(language.name)}</span>
              <span className="label tnum">{t(language.level)}</span>
            </li>
          ))}
        </ul>

        <h3 className="label mt-10">{t(ui.about.educationTitle)}</h3>
        <ul className="mt-5 space-y-5">
          {education.map((entry) => (
            <li key={entry.id}>
              <p className="text-base font-semibold text-ink">{t(entry.degree)}</p>
              <p className="text-sm text-muted">{entry.school}</p>
              <p className="label tnum mt-1">{t(entry.period)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
