import { Reveal } from './Reveal.jsx';

export function Section({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-20 border-t border-line ${className}`}>
      <div className="mx-auto w-full max-w-container px-6 py-20 md:px-10 md:py-28">
        {title ? (
          <Reveal>
            <h2 className="display-2 mb-12 text-ink md:mb-16">{title}</h2>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
