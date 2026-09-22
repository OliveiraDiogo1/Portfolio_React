import { motion as Motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';
import { containerStagger, lineUp } from '../ui/motion.js';

export function Hero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const Wrapper = reduceMotion ? 'div' : Motion.div;
  const Line = reduceMotion ? 'div' : Motion.div;
  const wrapperProps = reduceMotion ? {} : { initial: 'hidden', animate: 'show', variants: containerStagger };
  const lineProps = reduceMotion ? {} : { variants: lineUp };

  return (
    <div className="border-b border-line">
      <Wrapper
        {...wrapperProps}
        className="mx-auto grid w-full max-w-container gap-14 px-6 pb-20 pt-16 md:grid-cols-12 md:gap-10 md:px-10 md:pb-28 md:pt-24"
      >
        <div className="md:col-span-7">
          <Line {...lineProps}>
            <p className="label">{t(ui.about.locationLabel)} · Porto, Portugal</p>
          </Line>
          <Line {...lineProps}>
            <h1 className="display-1 mt-6 text-ink">{profile.name}</h1>
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
              </Link>
              <a href={profile.cvPath} download="cv-diogo-oliveira.pdf" className="btn-outline">
                {t(ui.hero.cvCta)}
              </a>
            </div>
          </Line>
        </div>

        <aside className="md:col-span-5 md:border-l md:border-line md:pl-10">
          <Line {...lineProps}>
            <p className="label">{t(ui.hero.currentlyLabel)}</p>
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
