import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-container flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="text-sm text-muted">
          © {year} {profile.name}. {t(ui.footer.rights)}
        </p>
        <p className="text-sm text-muted">{t(ui.footer.builtWith)}</p>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-quiet">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet">
            LinkedIn
          </a>
          <a href="#home" className="link-quiet">
            {t(ui.footer.backToTop)}
          </a>
        </div>
      </div>
    </footer>
  );
}
