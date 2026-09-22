import { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll } from 'motion/react';
import { experience } from '../../data/experience.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';

function ExperienceEntry({ entry, index, t }) {
  return (
    <li className="relative pl-14">
      <span className="label tnum absolute left-0 top-0 flex h-9 w-9 items-center justify-center border border-line bg-bg text-ink">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="grid gap-x-8 gap-y-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="label tnum">{t(entry.period)}</p>
          <p className="mt-1 text-sm text-muted">{t(entry.location)}</p>
          <div className="mt-4 hidden h-12 w-12 items-center justify-center border border-line bg-surface p-2 md:flex">
            <img src={entry.logo} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="md:col-span-9">
          <h3 className="text-xl font-semibold text-ink">{t(entry.role)}</h3>
          <p className="mt-1 text-base text-muted">{entry.company}</p>
          <ul className="measure mt-4 space-y-2">
            {entry.bullets.map((bullet, bulletIndex) => (
              <li key={bulletIndex} className="text-base leading-relaxed text-ink/85">
                {t(bullet)}
              </li>
            ))}
          </ul>
          <p className="label mt-5">{t(ui.experience.stackLabel)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tech.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.7', 'end 0.5'] });

  return (
    <div ref={listRef} className="relative">
      <span className="absolute bottom-0 left-[1.125rem] top-0 w-px bg-line" aria-hidden="true" />
      {reduceMotion ? null : (
        <Motion.span
          className="absolute bottom-0 left-[1.125rem] top-0 w-px origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
          aria-hidden="true"
        />
      )}
      <ol className="space-y-16">
        {experience.map((entry, index) => (
          <ExperienceEntry key={entry.id} entry={entry} index={index} t={t} />
        ))}
      </ol>
    </div>
  );
}
