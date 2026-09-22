import { motion as Motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';
import { containerStagger, lineUp } from '../ui/motion.js';

const arrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function Hero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const Wrapper = reduceMotion ? 'div' : Motion.div;
  const Line = reduceMotion ? 'div' : Motion.div;
  const wrapperProps = reduceMotion ? {} : { initial: 'hidden', animate: 'show', variants: containerStagger };
  const lineProps = reduceMotion ? {} : { variants: lineUp };

  return (
    <div className="relative overflow-hidden border-b border-line">
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <Wrapper
        {...wrapperProps}
        className="relative mx-auto grid w-full max-w-container gap-14 px-6 pb-20 pt-16 md:grid-cols-12 md:gap-10 md:px-10 md:pb-28 md:pt-24"
      >
        <div className="md:col-span-8">
          <Line {...lineProps}>
            <p className="label flex items-center gap-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-accent" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t(ui.hero.status)}
            </p>
          </Line>
          <Line {...lineProps}>
            <h1 className="display-1 mt-8 text-ink">{profile.name}</h1>
          </Line>
          <Line {...lineProps}>
            <p className="mt-6 max-w-xl text-xl font-medium text-ink md:text-2xl">{t(ui.hero.role)}</p>
          </Line>
          <Line {...lineProps}>
            <p className="measure mt-6 text-base text-muted">{t(ui.hero.intro)}</p>
          </Line>
          <Line {...lineProps}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                {t(ui.hero.contactCta)}
                {arrowIcon}
              </Link>
              <a href={profile.cvPath} download="cv-diogo-oliveira.pdf" className="btn-outline">
                {t(ui.hero.cvCta)}
                {arrowIcon}
              </a>
            </div>
          </Line>
        </div>

        <aside className="md:col-span-4">
          <Line {...lineProps}>
            <div className="relative border border-line bg-surface p-4">
              <span className="absolute left-4 top-0 h-1 w-16 bg-accent" aria-hidden="true" />
              <img
                src="/assets/dev-icon.png"
                alt="Diogo Oliveira logo"
                className="aspect-square w-full object-cover"
                width="1024"
                height="1024"
                fetchPriority="high"
              />
            </div>
          </Line>
          <Line {...lineProps}>
            <p className="label mt-8">{t(ui.hero.currentlyLabel)}</p>
            <ul className="mt-5 space-y-4 border-l border-line pl-5">
              <li className="text-base text-ink">{t(ui.hero.currentRole)}</li>
              <li className="text-base text-ink">{t(ui.hero.currentStudy)}</li>
            </ul>
          </Line>
          <Line {...lineProps}>
            <p className="label mt-10">{t(ui.hero.stackLabel)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.coreStack.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </Line>
          <Line {...lineProps}>
            <div className="mt-10 flex gap-5 text-sm font-semibold">
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-quiet">
                GitHub
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} className="link-quiet">
                Email
              </a>
            </div>
          </Line>
        </aside>
      </Wrapper>
    </div>
  );
}
