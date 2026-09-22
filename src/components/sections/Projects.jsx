import { useCallback, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'motion/react';
import { estimateProject } from '../../data/projects.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';
import { EASE } from '../ui/motion.js';

export function Projects() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const total = estimateProject.images.length;
  const current = estimateProject.images[index];

  const goTo = useCallback(
    (next) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  return (
    <article className="grid gap-10 md:grid-cols-12">
      <div className="md:col-span-5">
        <p className="label">{t(estimateProject.status)}</p>
        <h3 className="mt-3 text-2xl font-bold text-ink">{estimateProject.name}</h3>
        <p className="mt-3 text-base font-medium text-ink">{t(estimateProject.summary)}</p>
        <p className="measure mt-4 text-base leading-relaxed text-ink/85">{t(estimateProject.story)}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {estimateProject.stack.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
        <p className="label mt-6">{t(ui.projects.estimate.screensLabel)}</p>
      </div>

      <div className="md:col-span-7">
        <div className="border border-line bg-surface">
          {reduceMotion ? (
            <img
              src={current.src}
              alt={t(current.alt)}
              className="aspect-[16/10] w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <Motion.img
                key={current.src}
                src={current.src}
                alt={t(current.alt)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="aspect-[16/10] w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>
          )}
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={t(ui.projects.estimate.previous)}
              className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p aria-live="polite" className="label tnum">
              {t(ui.projects.estimate.counter, { current: index + 1, total })}
            </p>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={t(ui.projects.estimate.next)}
              className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-3">
          {estimateProject.images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(imageIndex)}
              aria-label={t(ui.projects.estimate.goTo, { index: imageIndex + 1 })}
              aria-current={imageIndex === index}
              className={`border p-1 transition-colors ${
                imageIndex === index ? 'border-accent' : 'border-line hover:border-ink'
              }`}
            >
              <img src={image.src} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
