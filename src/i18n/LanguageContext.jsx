import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES } from './ui.js';

const STORAGE_KEY = 'portfolio:lang';

const LanguageContext = createContext(null);

function detectLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch {
    // storage unavailable — fall through to browser detection
  }
  const browser = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return browser && browser.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage unavailable (private mode) — language still applies for this session
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((current) => (current === 'pt' ? 'en' : 'pt'));
  }, []);

  const t = useCallback(
    (value, vars) => {
      const raw = typeof value === 'string' ? value : (value?.[lang] ?? value?.en ?? '');
      if (!vars) {
        return raw;
      }
      return raw.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
