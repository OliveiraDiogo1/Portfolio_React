import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={lang === 'pt' ? t(ui.a11y.switchToEnglish) : t(ui.a11y.switchToPortuguese)}
      className="inline-flex h-9 items-center rounded-xs border border-line"
    >
      {['pt', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`h-full px-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
            lang === code ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
