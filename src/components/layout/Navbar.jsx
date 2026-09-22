import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { navSections, ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { LanguageToggle } from '../ui/LanguageToggle.jsx';
import { useActiveSection } from './useActiveSection.js';

const ANCHOR_IDS = navSections.filter((section) => section.type === 'anchor').map((section) => section.id);

export function Navbar() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(ANCHOR_IDS);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  const items = useMemo(
    () =>
      navSections.map((section) => {
        const label = t(ui.nav[section.labelKey]);
        const isActive = section.type === 'route' ? pathname === '/contact' : pathname === '/' && active === section.id;
        const className = `text-sm font-semibold transition-colors ${
          isActive ? 'text-ink underline decoration-accent decoration-2 underline-offset-8' : 'text-muted hover:text-ink'
        }`;
        return section.type === 'route' ? (
          <Link key={section.id} to="/contact" className={className} onClick={closeMenu}>
            {label}
          </Link>
        ) : (
          <HashLink key={section.id} smooth to={`/#${section.id}`} className={className} onClick={closeMenu}>
            {label}
          </HashLink>
        );
      }),
    [active, closeMenu, pathname, t]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-container items-center justify-between gap-6 px-6 md:px-10">
        <HashLink smooth to="/#home" className="text-base font-bold tracking-tight text-ink" onClick={closeMenu}>
          Diogo Oliveira
        </HashLink>

        <div className="hidden items-center gap-7 md:flex">{items}</div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t(ui.a11y.closeMenu) : t(ui.a11y.openMenu)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xs border border-line text-ink md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto flex max-w-container flex-col gap-4 px-6 py-6">{items}</div>
        </div>
      ) : null}
    </header>
  );
}
