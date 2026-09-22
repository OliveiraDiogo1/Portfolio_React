# Redesign do Portfólio e Migração para devdiogo.pt — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar o portfólio (dark sofisticado + amarelo, PT/EN, temas claro/escuro, motion, timeline, feed GitHub) e migrar o domínio para `devdiogo.pt`.

**Architecture:** SPA React 19 + Vite 7 + Tailwind 3. Single page com âncoras (`#about`, `#experience`, `#skills`, `#projects`) e rota `/contact`. Conteúdo em `src/data/*`, copy da interface em `src/i18n/ui.js`, providers de tema e língua no topo, secções em `src/components/sections/*`.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 3 (`darkMode: 'class'` + tokens em CSS vars), motion 13 (`motion/react`), @fontsource-variable/archivo, Vitest 2 + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-22-portfolio-redesign-spec.md`

## Global Constraints

- Manter React 19 / Vite 7 / Tailwind 3. **Não** atualizar Tailwind para v4 nem introduzir TypeScript.
- Novas dependências permitidas: `motion@13` (imports de `motion/react`) e `@fontsource-variable/archivo` (import `standard.css`). Qualquer outra exige ruling registado no ledger.
- Toda a copy visível existe em PT-PT e EN; chaves de dicionário em inglês.
- Dados pessoais, links e paths de assets vivem em `src/data/profile.js` — nunca hardcoded em componentes.
- Design: fundo graphite `#0F1115`, amarelo de marca `#FDE048` (`accent`), cantos `rounded-xs` = 2px, headings em Archivo com `font-stretch` 108–115%, sem gradientes decorativos, sem marquees, sem pills, sem sombras difusas.
- Amarelo só para ação/atenção; nunca texto amarelo sobre fundo claro.
- Nunca usar `dangerouslySetInnerHTML` com dados de API; a CSP em `index.html` é a fonte de verdade das origens externas.
- Cada tarefa termina com testes verdes e um commit convencional (`feat:`, `refactor:`, `chore:`).
- Comando de teste por tarefa: `npx vitest run <path>`. Baseline: `npx vitest run` → 1 ficheiro, 1 teste a passar.

## Review Focus

Falhas que a spec implica mas nenhum teste de tarefa cobre por si; cada linha é fixada na tarefa indicada:

1. **Formulário de contacto com a língua a mudar a meio do preenchimento** — os valores escritos têm de persistir (Task 11).
2. **Reboot da app com `localStorage` indisponível (modo privado)** — defaults aplicam-se sem crash (Tasks 2, 3).
3. **API do GitHub limitada/offline** — a secção renderiza o fallback estático, sem pedidos repetidos em loop (Task 10).
4. **`prefers-reduced-motion`** — nenhum conteúdo fica invisível por depender de animação (Tasks 1, 6).
5. **Deploy novo com service worker antigo** — navegação passa a network-first para não servir bundle stale (Task 12).

---

### Task 1: Fundação visual — tokens, fontes, primitivos

**Files:**
- Modify: `package.json` (via `npm install`)
- Modify: `tailwind.config.js`
- Modify: `src/index.css` (substituição integral)
- Modify: `src/main.jsx`
- Modify: `src/test/setup.js`
- Create: `src/components/ui/motion.js`
- Create: `src/components/ui/Reveal.jsx`
- Create: `src/components/ui/Section.jsx`
- Create: `src/components/ui/Chip.jsx`
- Test: `src/components/ui/__tests__/primitives.test.jsx`

**Interfaces:**
- Consumes: nada.
- Produces: classes `display-1`, `display-2`, `label`, `tnum`, `measure`, `chip`, `btn-primary`, `btn-outline`, `link-quiet`; cores Tailwind `bg`, `surface`, `line`, `ink`, `muted`, `accent`, `accent-ink`; `Reveal({ children, delay, className })`, `Section({ id, title, children, className })`, `Chip({ children })`; `EASE`, `lineUp`, `containerStagger` de `src/components/ui/motion.js`.

- [ ] **Step 1: Instalar dependências**

Run: `npm install motion @fontsource-variable/archivo && npm install --save-dev @testing-library/user-event`
Expected: `motion` e `@fontsource-variable/archivo` em `dependencies`; `@testing-library/user-event` em `devDependencies`.

- [ ] **Step 2: Escrever o teste dos primitivos (primeiro)**

`src/components/ui/__tests__/primitives.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from '../Section.jsx';
import { Chip } from '../Chip.jsx';
import { Reveal } from '../Reveal.jsx';

describe('UI primitives', () => {
  it('Section renders its title as a heading and its children', () => {
    render(
      <Section id="about" title="About me">
        <p>Body copy</p>
      </Section>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'About me' })).toBeInTheDocument();
    expect(screen.getByText('Body copy')).toBeInTheDocument();
    expect(document.querySelector('section#about')).toBeTruthy();
  });

  it('Chip renders its label', () => {
    render(<Chip>React.js</Chip>);
    expect(screen.getByText('React.js')).toBeInTheDocument();
  });

  it('Reveal renders children', () => {
    render(
      <Reveal>
        <span>Revealed</span>
      </Reveal>
    );
    expect(screen.getByText('Revealed')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Correr o teste e ver falhar**

Run: `npx vitest run src/components/ui/__tests__/primitives.test.jsx`
Expected: FAIL — `Failed to resolve import "../Section.jsx"`.

- [ ] **Step 4: `src/test/setup.js` com stubs de `matchMedia` e `IntersectionObserver`**

```js
import '@testing-library/jest-dom';

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (!('IntersectionObserver' in window)) {
  window.IntersectionObserver = MockIntersectionObserver;
  global.IntersectionObserver = MockIntersectionObserver;
}
```

- [ ] **Step 5: `tailwind.config.js` com tokens e tipografia**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--c-accent-ink) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '76rem',
      },
      borderRadius: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Substituir `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --c-bg: 246 246 243;
  --c-surface: 255 255 255;
  --c-line: 226 227 231;
  --c-ink: 21 22 26;
  --c-muted: 91 100 112;
  --c-accent: 253 224 72;
  --c-accent-ink: 21 23 28;
  --c-focus: 176 141 0;
}

.dark {
  --c-bg: 15 17 21;
  --c-surface: 22 25 32;
  --c-line: 38 43 53;
  --c-ink: 241 243 246;
  --c-muted: 152 160 173;
  --c-accent: 253 224 72;
  --c-accent-ink: 21 23 28;
  --c-focus: 253 224 72;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-bg text-ink antialiased;
  }

  ::selection {
    background: rgb(var(--c-accent));
    color: rgb(var(--c-accent-ink));
  }

  :focus-visible {
    outline: 3px solid rgb(var(--c-focus));
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(var(--c-line));
  }

  ::-webkit-scrollbar-track {
    background: rgb(var(--c-bg));
  }

  html {
    scrollbar-color: rgb(var(--c-line)) rgb(var(--c-bg));
    scrollbar-width: thin;
  }
}

@layer components {
  .display-1 {
    font-size: clamp(3rem, 8vw, 6.25rem);
    line-height: 0.94;
    letter-spacing: -0.03em;
    font-weight: 800;
    font-stretch: 115%;
  }

  .display-2 {
    font-size: clamp(1.75rem, 3.4vw, 2.75rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-weight: 700;
    font-stretch: 108%;
  }

  .label {
    font-size: 0.8125rem;
    line-height: 1.3;
    letter-spacing: 0.06em;
    font-weight: 500;
    color: rgb(var(--c-muted));
  }

  .tnum {
    font-variant-numeric: tabular-nums;
  }

  .measure {
    max-width: 66ch;
  }

  .chip {
    @apply inline-flex items-center rounded-xs border border-line px-2.5 py-1 text-sm text-muted;
  }

  .btn-primary {
    @apply inline-flex h-11 items-center justify-center rounded-xs bg-accent px-5 text-[0.9375rem] font-semibold text-accent-ink transition-colors hover:bg-accent/90;
  }

  .btn-outline {
    @apply inline-flex h-11 items-center justify-center rounded-xs border border-line px-5 text-[0.9375rem] font-semibold text-ink transition-colors hover:border-ink;
  }

  .link-quiet {
    @apply underline decoration-line underline-offset-4 transition-colors hover:decoration-accent;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 7: Importar a fonte em `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/standard.css'
import './index.css'
import App from './App.jsx'
```

(mantém-se o resto do ficheiro: render + registo do service worker)

- [ ] **Step 8: Criar `src/components/ui/motion.js`**

```js
export const EASE = [0.22, 1, 0.36, 1];

export const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const lineUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
```

- [ ] **Step 9: Criar `Reveal.jsx`, `Section.jsx`, `Chip.jsx`**

`src/components/ui/Reveal.jsx`:

```jsx
import { motion, useReducedMotion } from 'motion/react';
import { EASE } from './motion.js';

export function Reveal({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
```

`src/components/ui/Section.jsx`:

```jsx
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
```

`src/components/ui/Chip.jsx`:

```jsx
export function Chip({ children }) {
  return <span className="chip">{children}</span>;
}
```

- [ ] **Step 10: Correr o teste e ver passar**

Run: `npx vitest run src/components/ui/__tests__/primitives.test.jsx`
Expected: PASS — 3 testes.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tailwind.config.js src/index.css src/main.jsx src/test/setup.js src/components/ui
git commit -m "feat(design): add design tokens, Archivo font and UI primitives"
```

---

### Task 2: Tema claro/escuro sem flash

**Files:**
- Create: `src/theme/ThemeContext.jsx`
- Create: `src/components/ui/ThemeToggle.jsx`
- Modify: `index.html` (script inline anti-flash no `<head>`)
- Test: `src/theme/__tests__/ThemeContext.test.jsx`
- Test: `src/theme/__tests__/no-flash.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `ThemeProvider({ children })`, `useTheme() → { theme, setTheme, toggleTheme }`, chave `localStorage:portfolio:theme`, `ThemeToggle()`. Tarefas seguintes usam `useTheme()` e `<ThemeToggle />`.

- [ ] **Step 1: Escrever o teste do provider (primeiro)**

`src/theme/__tests__/ThemeContext.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext.jsx';

function Probe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to dark and applies the class to <html>', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('honours a stored preference', () => {
    localStorage.setItem('portfolio:theme', 'light');
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles, updates <html> and persists the new value', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(localStorage.getItem('portfolio:theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('does not crash when localStorage throws', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
    expect(() =>
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>
      )
    ).not.toThrow();
    Storage.prototype.getItem = original;
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/theme/__tests__/ThemeContext.test.jsx`
Expected: FAIL — `Failed to resolve import "../ThemeContext.jsx"`.

- [ ] **Step 3: Criar `src/theme/ThemeContext.jsx`**

```jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'portfolio:theme';
const THEMES = ['dark', 'light'];

const ThemeContext = createContext(null);

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStoredTheme() ?? 'dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable (private mode) — theme still applies for this session
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

- [ ] **Step 4: Correr e ver passar**

Run: `npx vitest run src/theme/__tests__/ThemeContext.test.jsx`
Expected: PASS — 4 testes.

- [ ] **Step 5: Escrever o teste anti-flash (primeiro) e ver falhar**

`src/theme/__tests__/no-flash.test.js`:

```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('index.html anti-flash script', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

  it('sets the theme class before the app bundle loads', () => {
    const scriptIndex = html.indexOf('portfolio:theme');
    const bundleIndex = html.indexOf('/src/main.jsx');
    expect(scriptIndex).toBeGreaterThan(-1);
    expect(scriptIndex).toBeLessThan(bundleIndex);
  });
});
```

Run: `npx vitest run src/theme/__tests__/no-flash.test.js`
Expected: FAIL — `expected -1 to be greater than -1`.

- [ ] **Step 6: Adicionar o script em `index.html` (primeiro elemento do `<head>`, após o charset)**

```html
    <script>
      (function () {
        try {
          var stored = localStorage.getItem('portfolio:theme');
          var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
          document.documentElement.classList.toggle('dark', theme === 'dark');
          document.documentElement.style.colorScheme = theme;
        } catch (error) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
```

- [ ] **Step 7: Criar `src/components/ui/ThemeToggle.jsx`**

```jsx
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useTheme } from '../../theme/ThemeContext.jsx';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const label = theme === 'dark' ? t(ui.a11y.toggleThemeToLight) : t(ui.a11y.toggleThemeToDark);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xs border border-line text-ink transition-colors hover:border-ink"
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
```

Nota: `ThemeToggle` importa `useLanguage`, pelo que só funciona dentro do `LanguageProvider` — a Task 3 cria esse provider; até lá o componente não é renderizado (a Home só o usa na Task 5).

- [ ] **Step 8: Correr os testes do tema e ver passar**

Run: `npx vitest run src/theme`
Expected: PASS — 5 testes.

- [ ] **Step 9: Commit**

```bash
git add index.html src/theme src/components/ui/ThemeToggle.jsx
git commit -m "feat(theme): add persisted dark/light theme with no-flash boot script"
```

---

### Task 3: Idioma PT/EN

**Files:**
- Create: `src/i18n/ui.js`
- Create: `src/i18n/LanguageContext.jsx`
- Create: `src/components/ui/LanguageToggle.jsx`
- Create: `src/test/renderWithProviders.jsx`
- Test: `src/i18n/__tests__/LanguageContext.test.jsx`

**Interfaces:**
- Consumes: `ThemeProvider` de `../theme/ThemeContext.jsx`.
- Produces: `ui` (dicionário), `navSections` (com `{ id, labelKey, type: 'anchor' | 'route' }`), `LanguageProvider({ children })`, `useLanguage() → { lang, setLang, toggleLang, t }` onde `t(valor, vars?)` aceita `string | { en, pt }` e interpola `{chave}`; chave `localStorage:portfolio:lang`; `LanguageToggle()`; `renderWithProviders(children, { route })` para testes.

- [ ] **Step 1: Escrever o teste do provider (primeiro)**

`src/i18n/__tests__/LanguageContext.test.jsx`:

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../LanguageContext.jsx';

function Probe() {
  const { lang, toggleLang, t } = useLanguage();
  return (
    <div>
      <button type="button" onClick={toggleLang}>
        toggle
      </button>
      <span data-testid="lang">{lang}</span>
      <span data-testid="copy">{t({ en: 'Hello', pt: 'Olá' })}</span>
      <span data-testid="vars">{t({ en: 'Hi {name}', pt: 'Olá {name}' }, { name: 'Diogo' })}</span>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
  });

  it('defaults to English for non-Portuguese browsers', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('copy')).toHaveTextContent('Hello');
  });

  it('toggles to Portuguese, updates <html lang> and persists', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');
    expect(screen.getByTestId('copy')).toHaveTextContent('Olá');
    expect(localStorage.getItem('portfolio:lang')).toBe('pt');
    expect(document.documentElement.lang).toBe('pt');
  });

  it('interpolates variables', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId('vars')).toHaveTextContent('Hi Diogo');
  });

  it('does not crash when localStorage throws', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
    expect(() =>
      render(
        <LanguageProvider>
          <Probe />
        </LanguageProvider>
      )
    ).not.toThrow();
    Storage.prototype.getItem = original;
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/i18n/__tests__/LanguageContext.test.jsx`
Expected: FAIL — `Failed to resolve import "../LanguageContext.jsx"`.

- [ ] **Step 3: Criar `src/i18n/ui.js`**

```js
export const LANGUAGES = ['pt', 'en'];

export const navSections = [
  { id: 'home', labelKey: 'home', type: 'anchor' },
  { id: 'about', labelKey: 'about', type: 'anchor' },
  { id: 'experience', labelKey: 'experience', type: 'anchor' },
  { id: 'skills', labelKey: 'skills', type: 'anchor' },
  { id: 'projects', labelKey: 'projects', type: 'anchor' },
  { id: 'contact', labelKey: 'contact', type: 'route' },
];

export const ui = {
  skipToContent: { en: 'Skip to content', pt: 'Saltar para o conteúdo' },
  nav: {
    home: { en: 'Home', pt: 'Início' },
    about: { en: 'About', pt: 'Sobre' },
    experience: { en: 'Experience', pt: 'Experiência' },
    skills: { en: 'Skills', pt: 'Competências' },
    projects: { en: 'Projects', pt: 'Projetos' },
    contact: { en: 'Contact', pt: 'Contacto' },
  },
  hero: {
    role: {
      en: 'Full-stack developer. From requirements to production.',
      pt: 'Desenvolvedor full-stack. Do requisito à produção.',
    },
    intro: {
      en: 'I build and ship software end to end: React and Vue interfaces, .NET and Python services, SQL that holds up, and the pipelines that put it all in production on AWS and Google Cloud.',
      pt: 'Construo e coloco software em produção de ponta a ponta: interfaces React e Vue, serviços .NET e Python, SQL que aguenta, e os pipelines que levam tudo isto à AWS e ao Google Cloud.',
    },
    contactCta: { en: 'Start a conversation', pt: 'Falar comigo' },
    cvCta: { en: 'Download CV', pt: 'Descarregar CV' },
    currentlyLabel: { en: 'Currently', pt: 'Atualmente' },
    currentRole: { en: 'Full-Stack Developer at F.Rego', pt: 'Full-Stack Developer na F.Rego' },
    currentStudy: {
      en: 'MSc in Software Engineering at ISEP, part-time',
      pt: 'Mestrado em Engenharia de Software no ISEP, pós-laboral',
    },
    stackLabel: { en: 'Core stack', pt: 'Stack principal' },
  },
  about: {
    title: { en: 'About', pt: 'Sobre' },
    paragraphs: [
      {
        en: 'I am a full-stack developer based in Porto, Portugal. For the past few years I have been building software for manufacturing ERP, insurance and defence-cloud projects — systems where the data has to be right and the interface has to survive a factory floor.',
        pt: 'Sou desenvolvedor full-stack no Porto. Nos últimos anos tenho construído software para ERP industrial, seguros e projetos de cloud europeus — sistemas em que os dados têm de estar certos e a interface tem de sobreviver a um chão de fábrica.',
      },
      {
        en: 'My work tends to span the whole stack: gathering requirements, designing the data model, building the API and shipping the release through a CI/CD pipeline. I care about clean interfaces, fast queries and code the next person can read.',
        pt: 'O meu trabalho ocupa normalmente a stack inteira: levantar requisitos, desenhar o modelo de dados, construir a API e colocar a release em produção por um pipeline de CI/CD. Interessam-me interfaces limpas, queries rápidas e código que a próxima pessoa consegue ler.',
      },
    ],
    factsTitle: { en: 'Details', pt: 'Detalhes' },
    languagesTitle: { en: 'Languages', pt: 'Línguas' },
    educationTitle: { en: 'Education', pt: 'Educação' },
    locationLabel: { en: 'Location', pt: 'Localização' },
    emailLabel: { en: 'Email', pt: 'Email' },
    linksLabel: { en: 'Elsewhere', pt: 'Noutros sítios' },
  },
  experience: {
    title: { en: 'Experience', pt: 'Experiência' },
    stackLabel: { en: 'Stack', pt: 'Stack' },
  },
  skills: {
    title: { en: 'Skills', pt: 'Competências' },
    note: {
      en: 'The stack I use to take a project from an empty repository to production, and to keep it running once it is there.',
      pt: 'A stack que uso para levar um projeto de um repositório vazio até à produção, e para o manter a funcionar depois disso.',
    },
  },
  projects: {
    title: { en: 'Projects', pt: 'Projetos' },
    estimate: {
      status: { en: 'Private client application', pt: 'Aplicação privada de cliente' },
      summary: {
        en: 'Turns manual project estimates into a fast, repeatable workflow.',
        pt: 'Transforma orçamentos manuais num processo rápido e repetível.',
      },
      story: {
        en: 'A prospect was building every project estimate by hand. I identified the need, built the application with Vue.js and Supabase, and they became a paying client. Estimates are now generated from structured data instead of copy-paste.',
        pt: 'Um potencial cliente fazia todos os orçamentos à mão. Identifiquei a necessidade, construí a aplicação com Vue.js e Supabase, e tornou-se cliente. Os orçamentos passaram a ser gerados a partir de dados estruturados, sem copy-paste.',
      },
      screensLabel: { en: 'Screens', pt: 'Ecrãs' },
      previous: { en: 'Previous screen', pt: 'Ecrã anterior' },
      next: { en: 'Next screen', pt: 'Ecrã seguinte' },
      goTo: { en: 'Go to screen {index}', pt: 'Ir para o ecrã {index}' },
      counter: { en: 'Screen {current} of {total}', pt: 'Ecrã {current} de {total}' },
    },
    github: {
      title: { en: 'On GitHub', pt: 'No GitHub' },
      subtitle: {
        en: 'Public code, live stats from the GitHub API.',
        pt: 'Código público, estatísticas em direto da API do GitHub.',
      },
      viewAll: { en: 'View all repositories', pt: 'Ver todos os repositórios' },
      liveUnavailable: {
        en: 'Live stats unavailable right now — repository links still work.',
        pt: 'Estatísticas indisponíveis neste momento — os links dos repositórios continuam a funcionar.',
      },
      stars: { en: '{count} stars', pt: '{count} estrelas' },
      updated: { en: 'Updated {when}', pt: 'Atualizado {when}' },
    },
  },
  contactCta: {
    title: { en: 'Let us build something that ships', pt: 'Vamos construir algo que chega a produção' },
    body: {
      en: 'I am open to conversations about full-stack work, cloud and DevOps, or hard problems in existing systems.',
      pt: 'Estou disponível para conversas sobre trabalho full-stack, cloud e DevOps, ou problemas difíceis em sistemas existentes.',
    },
    emailCta: { en: 'Send an email', pt: 'Enviar email' },
    formCta: { en: 'Use the contact form', pt: 'Usar o formulário' },
  },
  contact: {
    title: { en: 'Tell me what you are working on', pt: 'Conta-me o que andas a construir' },
    subtitle: {
      en: 'I usually reply within a couple of days.',
      pt: 'Respondo normalmente em dois ou três dias.',
    },
    name: { en: 'Name', pt: 'Nome' },
    email: { en: 'Email', pt: 'Email' },
    message: { en: 'Message', pt: 'Mensagem' },
    namePlaceholder: { en: 'Your name', pt: 'O teu nome' },
    emailPlaceholder: { en: 'you@company.com', pt: 'tu@empresa.pt' },
    messagePlaceholder: {
      en: 'What are you building, and where can I help?',
      pt: 'O que estás a construir e onde posso ajudar?',
    },
    send: { en: 'Send message', pt: 'Enviar mensagem' },
    sending: { en: 'Sending…', pt: 'A enviar…' },
    success: {
      en: 'Message sent. Thanks for reaching out — I will get back to you soon.',
      pt: 'Mensagem enviada. Obrigado pelo contacto — respondo assim que puder.',
    },
    fallbackNote: { en: 'If the form fails, email me at', pt: 'Se o formulário falhar, escreve para' },
  },
  validation: {
    nameRequired: { en: 'Enter your name.', pt: 'Indica o teu nome.' },
    nameLength: {
      en: 'Name must be between 2 and 50 characters.',
      pt: 'O nome deve ter entre 2 e 50 caracteres.',
    },
    nameChars: { en: 'Name contains invalid characters.', pt: 'O nome contém caracteres inválidos.' },
    emailRequired: { en: 'Enter your email address.', pt: 'Indica o teu email.' },
    emailInvalid: { en: 'Enter a valid email address.', pt: 'Introduz um email válido.' },
    emailLength: { en: 'Email address is too long.', pt: 'O email é demasiado longo.' },
    messageRequired: { en: 'Write a message.', pt: 'Escreve uma mensagem.' },
    messageLength: {
      en: 'Message must be at least 10 characters.',
      pt: 'A mensagem deve ter pelo menos 10 caracteres.',
    },
    messageMax: {
      en: 'Message is too long (2000 characters maximum).',
      pt: 'A mensagem é demasiado longa (máximo 2000 caracteres).',
    },
    rateLimited: {
      en: 'Too many requests. Try again in a few minutes.',
      pt: 'Demasiados pedidos. Tenta novamente dentro de alguns minutos.',
    },
    captcha: { en: 'Confirm you are not a robot.', pt: 'Confirma que não és um robô.' },
    origin: {
      en: 'This form only works from the portfolio site itself.',
      pt: 'Este formulário só funciona a partir do próprio site.',
    },
    notConfigured: {
      en: 'Email sending is not configured. Write to {email} instead.',
      pt: 'O envio de email não está configurado. Escreve para {email}.',
    },
    sendFailed: {
      en: 'Could not send the message. Try again, or email {email} directly.',
      pt: 'Não foi possível enviar a mensagem. Tenta novamente ou escreve para {email}.',
    },
  },
  footer: {
    builtWith: {
      en: 'Built with React, Vite and Tailwind CSS. Deployed on Vercel.',
      pt: 'Feito com React, Vite e Tailwind CSS. Alojado na Vercel.',
    },
    rights: { en: 'All rights reserved.', pt: 'Todos os direitos reservados.' },
    backToTop: { en: 'Back to top', pt: 'Voltar ao topo' },
  },
  a11y: {
    openMenu: { en: 'Open menu', pt: 'Abrir menu' },
    closeMenu: { en: 'Close menu', pt: 'Fechar menu' },
    toggleThemeToLight: { en: 'Switch to light theme', pt: 'Mudar para tema claro' },
    toggleThemeToDark: { en: 'Switch to dark theme', pt: 'Mudar para tema escuro' },
    switchToEnglish: { en: 'Switch to English', pt: 'Mudar para inglês' },
    switchToPortuguese: { en: 'Switch to Portuguese', pt: 'Mudar para português' },
  },
};
```

- [ ] **Step 4: Criar `src/i18n/LanguageContext.jsx`**

```jsx
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
```

- [ ] **Step 5: Correr e ver passar**

Run: `npx vitest run src/i18n/__tests__/LanguageContext.test.jsx`
Expected: PASS — 4 testes.

- [ ] **Step 6: Criar `src/components/ui/LanguageToggle.jsx`**

```jsx
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
```

- [ ] **Step 7: Criar `src/test/renderWithProviders.jsx`**

```jsx
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../theme/ThemeContext.jsx';
import { LanguageProvider } from '../i18n/LanguageContext.jsx';

export function renderWithProviders(element, { route = '/' } = {}) {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 8: Correr toda a suite**

Run: `npx vitest run`
Expected: PASS — 3 ficheiros de teste (primitives, theme, i18n) + `Home.test.jsx` atual (Home ainda não usa providers; continua verde).

- [ ] **Step 9: Commit**

```bash
git add src/i18n src/components/ui/LanguageToggle.jsx src/test/renderWithProviders.jsx
git commit -m "feat(i18n): add PT/EN language system and language toggle"
```

---

### Task 4: Dados de conteúdo (CV 2026)

**Files:**
- Create: `src/data/profile.js`
- Create: `src/data/education.js`
- Create: `src/data/experience.js`
- Create: `src/data/skills.js`
- Create: `src/data/projects.js`
- Test: `src/data/__tests__/content.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `profile`, `education`, `experience`, `skillGroups`, `estimateProject`, `githubFeed`. Forma dos registos bilingues: `{ en, pt }`; listas de bullets são arrays dessa forma; `t()` da Task 3 resolve-os.

- [ ] **Step 1: Escrever o teste de integridade (primeiro)**

`src/data/__tests__/content.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { profile } from '../profile.js';
import { education } from '../education.js';
import { experience } from '../experience.js';
import { skillGroups } from '../skills.js';
import { estimateProject, githubFeed } from '../projects.js';

function expectBilingual(value, label) {
  expect(value, `${label} is missing`).toBeTruthy();
  expect(typeof value.en, `${label}.en`).toBe('string');
  expect(typeof value.pt, `${label}.pt`).toBe('string');
  expect(value.en.length, `${label}.en is empty`).toBeGreaterThan(0);
  expect(value.pt.length, `${label}.pt is empty`).toBeGreaterThan(0);
}

describe('content data', () => {
  it('profile has contact data and bilingual fields', () => {
    expect(profile.name).toBe('Diogo Oliveira');
    expect(profile.email).toMatch(/@/);
    expect(profile.cvPath.startsWith('/')).toBe(true);
    expect(profile.links.github).toMatch(/^https:\/\/github\.com\//);
    expect(profile.links.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
    expect(profile.languages).toHaveLength(5);
    profile.languages.forEach((language) => {
      expectBilingual(language.name, `language ${language.id} name`);
      expectBilingual(language.level, `language ${language.id} level`);
    });
  });

  it('education entries are bilingual', () => {
    expect(education).toHaveLength(2);
    education.forEach((entry) => {
      expectBilingual(entry.degree, `education ${entry.id} degree`);
      expectBilingual(entry.period, `education ${entry.id} period`);
      expect(entry.school.length).toBeGreaterThan(0);
    });
  });

  it('experience covers F.Rego and Sistrade with equal PT/EN bullets', () => {
    expect(experience.map((entry) => entry.id)).toEqual(['frego', 'sistrade']);
    experience.forEach((entry) => {
      expectBilingual(entry.role, `${entry.id} role`);
      expectBilingual(entry.period, `${entry.id} period`);
      expectBilingual(entry.location, `${entry.id} location`);
      expect(entry.logo.startsWith('/')).toBe(true);
      expect(Array.isArray(entry.tech)).toBe(true);
      expect(entry.tech.length).toBeGreaterThan(0);
      expect(entry.bullets.length).toBeGreaterThanOrEqual(3);
      entry.bullets.forEach((bullet, index) => {
        expectBilingual(bullet, `${entry.id} bullet ${index}`);
      });
    });
  });

  it('skill groups are bilingual and non-empty', () => {
    expect(skillGroups).toHaveLength(6);
    skillGroups.forEach((group) => {
      expectBilingual(group.label, `skill group ${group.id}`);
      expect(group.items.length).toBeGreaterThan(0);
    });
  });

  it('projects data includes screenshots and GitHub selection', () => {
    expect(estimateProject.images).toHaveLength(5);
    expectBilingual(estimateProject.summary, 'estimate summary');
    expectBilingual(estimateProject.story, 'estimate story');
    expect(githubFeed.username).toBe('OliveiraDiogo1');
    expect(githubFeed.selected.length).toBeGreaterThanOrEqual(2);
    githubFeed.selected.forEach((repo) => {
      expectBilingual(repo.description, `repo ${repo.name} description`);
    });
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/data/__tests__/content.test.js`
Expected: FAIL — `Failed to resolve import "../profile.js"`.

- [ ] **Step 3: Criar `src/data/profile.js`**

```js
export const profile = {
  name: 'Diogo Oliveira',
  email: 'diogo.mto123@gmail.com',
  cvPath: '/assets/cv-diogo-oliveira.pdf',
  links: {
    github: 'https://github.com/OliveiraDiogo1',
    linkedin: 'https://www.linkedin.com/in/oliveiradiogo1/',
  },
  coreStack: ['React.js', 'C# (.NET)', 'Python', 'SQL', 'AWS'],
  languages: [
    { id: 'pt', name: { en: 'Portuguese', pt: 'Português' }, level: { en: 'Native', pt: 'Nativo' } },
    { id: 'en', name: { en: 'English', pt: 'Inglês' }, level: { en: 'C2', pt: 'C2' } },
    { id: 'es', name: { en: 'Spanish', pt: 'Espanhol' }, level: { en: 'C2', pt: 'C2' } },
    { id: 'eu', name: { en: 'Basque (Euskara)', pt: 'Basco (Euskara)' }, level: { en: 'C2', pt: 'C2' } },
    { id: 'fr', name: { en: 'French', pt: 'Francês' }, level: { en: 'B1', pt: 'B1' } },
  ],
};
```

- [ ] **Step 4: Criar `src/data/education.js`**

```js
export const education = [
  {
    id: 'msc-isep',
    school: 'Instituto Superior de Engenharia do Porto (ISEP)',
    degree: { en: 'MSc in Software Engineering', pt: 'Mestrado em Engenharia de Software' },
    period: { en: 'Oct 2024 — Present · Part-time', pt: 'Out 2024 — Presente · Pós-laboral' },
  },
  {
    id: 'bsc-portucalense',
    school: 'Universidade Portucalense Infante D. Henrique',
    degree: { en: 'BSc in Computer Science', pt: 'Licenciatura em Ciência de Computadores' },
    period: { en: 'Concluded 2024', pt: 'Concluída em 2024' },
  },
];
```

- [ ] **Step 5: Criar `src/data/experience.js`**

```js
export const experience = [
  {
    id: 'frego',
    company: 'F.Rego — Corretores de Seguros',
    logo: '/assets/icons/frego.jpg',
    role: { en: 'Full-Stack Developer', pt: 'Full-Stack Developer' },
    period: { en: 'Mar 2026 — Present', pt: 'Mar 2026 — Presente' },
    location: { en: 'Vila Nova de Gaia, Portugal · Hybrid', pt: 'Vila Nova de Gaia, Portugal · Híbrido' },
    bullets: [
      {
        en: 'Own internal and client-facing projects end to end, from requirements gathering and solution design to production deployment.',
        pt: 'Responsável de ponta a ponta por projetos internos e para clientes, do levantamento de requisitos ao deploy em produção.',
      },
      {
        en: 'Develop full-stack features with React.js, Python, C# (.NET) and SQL, delivering web applications tailored to business needs.',
        pt: 'Desenvolvo funcionalidades full-stack com React.js, Python, C# (.NET) e SQL, entregando aplicações ajustadas às necessidades do negócio.',
      },
      {
        en: 'Design and implement DevOps pipelines and cloud deployments on AWS and Google Cloud Run, provisioning infrastructure as code with Pulumi.',
        pt: 'Desenho e implemento pipelines de DevOps e deploys em AWS e Google Cloud Run, provisionando infraestrutura como código com Pulumi.',
      },
      {
        en: 'Enforce code quality and security standards by integrating static analysis tools such as Qodana and Semgrep into the development workflow.',
        pt: 'Garanto padrões de qualidade e segurança integrando ferramentas de análise estática como Qodana e Semgrep no fluxo de desenvolvimento.',
      },
      {
        en: 'Provide ongoing maintenance and support across the company application portfolio, keeping production reliable.',
        pt: 'Asseguro manutenção e suporte contínuos no portfólio de aplicações da empresa, mantendo a produção fiável.',
      },
    ],
    tech: ['React.js', 'Python', 'C# (.NET)', 'SQL', 'AWS', 'Cloud Run', 'Pulumi', 'Qodana', 'Semgrep'],
  },
  {
    id: 'sistrade',
    company: 'SISTRADE — Software Consulting S.A.',
    logo: '/assets/icons/sistrade.png',
    role: { en: 'Junior Full-Stack Developer', pt: 'Junior Full-Stack Developer' },
    period: { en: 'Jul 2024 — Mar 2026', pt: 'Jul 2024 — Mar 2026' },
    location: { en: 'Porto, Portugal · Hybrid', pt: 'Porto, Portugal · Híbrido' },
    bullets: [
      {
        en: 'Designed, developed and maintained core features of the ERP platform with Vue.js, ASP.NET and .NET Core, modernizing legacy screens into responsive interfaces.',
        pt: 'Desenhei, desenvolvi e mantive funcionalidades centrais do ERP em Vue.js, ASP.NET e .NET Core, modernizando ecrãs legados em interfaces responsivas.',
      },
      {
        en: 'Optimized database performance with stored procedures, complex queries, triggers and scheduled jobs in Microsoft SQL Server.',
        pt: 'Otimizei a performance da base de dados com stored procedures, queries complexas, triggers e jobs agendados em Microsoft SQL Server.',
      },
      {
        en: 'Built a REST API that collects and manages real-time data from factory machinery and IoT sensors, enabling production monitoring and analytics for an industrial client.',
        pt: 'Construí uma API REST que recolhe e gere dados em tempo real de máquinas de fábrica e sensores IoT, permitindo monitorização e análise de produção para um cliente industrial.',
      },
      {
        en: 'Contributed to the European Defence Operational Collaborative Cloud (EDOCC) project with an event-logging API validating data from partner systems.',
        pt: 'Contribuí para o projeto European Defence Operational Collaborative Cloud (EDOCC) com uma API de event logging que valida dados de sistemas parceiros.',
      },
      {
        en: 'Designed and implemented a Vue.js form and its SQL Server schema to manage employee position data in an internal HR tool.',
        pt: 'Desenhei e implementei um formulário em Vue.js e o respetivo schema em SQL Server para gerir dados de funções de colaboradores numa ferramenta interna de RH.',
      },
    ],
    tech: ['Vue.js', '.NET', 'ASP.NET', 'SQL Server', 'REST API', 'IoT'],
  },
];
```

- [ ] **Step 6: Criar `src/data/skills.js`**

```js
export const skillGroups = [
  {
    id: 'languages',
    label: { en: 'Languages', pt: 'Linguagens' },
    items: ['JavaScript', 'C#', 'Python', 'SQL'],
  },
  {
    id: 'frontend',
    label: { en: 'Frontend', pt: 'Frontend' },
    items: ['React.js', 'Vue.js'],
  },
  {
    id: 'backend',
    label: { en: 'Backend', pt: 'Backend' },
    items: ['.NET (C#)', 'ASP.NET', 'Python', 'Java'],
  },
  {
    id: 'data',
    label: { en: 'Data', pt: 'Dados' },
    items: ['Microsoft SQL Server', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'devops',
    label: { en: 'DevOps & Cloud', pt: 'DevOps e Cloud' },
    items: ['AWS', 'Google Cloud Run', 'Pulumi (IaC)', 'Docker', 'Kubernetes', 'Git', 'Bitbucket', 'Jira', 'Confluence'],
  },
  {
    id: 'quality',
    label: { en: 'Code quality & security', pt: 'Qualidade e segurança' },
    items: ['Qodana', 'Semgrep', 'SonarQube'],
  },
];
```

- [ ] **Step 7: Criar `src/data/projects.js`**

```js
export const estimateProject = {
  id: 'estimate',
  name: 'EstiMate',
  status: { en: 'Private client application', pt: 'Aplicação privada de cliente' },
  summary: {
    en: 'Turns manual project estimates into a fast, repeatable workflow.',
    pt: 'Transforma orçamentos manuais num processo rápido e repetível.',
  },
  story: {
    en: 'A prospect was building every project estimate by hand. I identified the need, built the application with Vue.js and Supabase, and they became a paying client. Estimates are now generated from structured data instead of copy-paste.',
    pt: 'Um potencial cliente fazia todos os orçamentos à mão. Identifiquei a necessidade, construí a aplicação com Vue.js e Supabase, e tornou-se cliente. Os orçamentos passaram a ser gerados a partir de dados estruturados, sem copy-paste.',
  },
  stack: ['Vue.js', 'Supabase', 'PostgreSQL'],
  images: [
    { src: '/assets/projects/Estimates/Estimate1.png', alt: { en: 'EstiMate — estimate list', pt: 'EstiMate — lista de orçamentos' } },
    { src: '/assets/projects/Estimates/Estimate2.png', alt: { en: 'EstiMate — estimate builder', pt: 'EstiMate — criação de orçamento' } },
    { src: '/assets/projects/Estimates/Estimate3.png', alt: { en: 'EstiMate — item details', pt: 'EstiMate — detalhe de itens' } },
    { src: '/assets/projects/Estimates/Estimate4.png', alt: { en: 'EstiMate — pricing summary', pt: 'EstiMate — resumo de preços' } },
    { src: '/assets/projects/Estimates/Estimate5.png', alt: { en: 'EstiMate — exported document', pt: 'EstiMate — documento exportado' } },
  ],
};

export const githubFeed = {
  username: 'OliveiraDiogo1',
  selected: [
    {
      name: 'Portfolio_React',
      description: {
        en: 'This portfolio — React, Vite, Tailwind, i18n and a design system of its own.',
        pt: 'Este portfólio — React, Vite, Tailwind, i18n e um design system próprio.',
      },
    },
    {
      name: 'GOFTS',
      description: {
        en: 'Game built for a university project, focused on gameplay logic and state.',
        pt: 'Jogo construído para um projeto universitário, focado em lógica de jogo e estado.',
      },
    },
    {
      name: 'git_test',
      description: {
        en: 'The Odin Project exercises — the start of the road into web development.',
        pt: 'Exercícios do The Odin Project — o início do caminho no desenvolvimento web.',
      },
    },
  ],
};
```

- [ ] **Step 8: Correr e ver passar**

Run: `npx vitest run src/data/__tests__/content.test.js`
Expected: PASS — 5 testes.

- [ ] **Step 9: Commit**

```bash
git add src/data
git commit -m "feat(content): add bilingual CV data for 2026 profile, experience, skills and projects"
```

---

### Task 5: Shell da aplicação — App, Navbar, Footer, Home

**Files:**
- Modify: `src/App.jsx` (substituição integral)
- Modify: `src/pages/Home.jsx` (substituição integral — passa a compor secções; as secções individuais chegam nas Tasks 6–10, criando-se aqui placeholders mínimos)
- Create: `src/components/layout/Navbar.jsx`
- Create: `src/components/layout/Footer.jsx`
- Create: `src/components/layout/useActiveSection.js`
- Create: `src/components/sections/Placeholder.jsx` (temporário, removido na Task 10)
- Delete: `src/pages/Skills.jsx`, `src/components/SecurityMonitor.jsx` se não for importado por ninguém
- Modify: `src/pages/__tests__/Home.test.jsx` (reescrito)
- Test: `src/components/layout/__tests__/Navbar.test.jsx`
- Test: `src/components/layout/__tests__/useActiveSection.test.js`
- Test: `src/pages/__tests__/Home.test.jsx` (reescrito)

**Interfaces:**
- Consumes: `navSections`, `ui`, `useLanguage`, `useTheme`, `renderWithProviders`.
- Produces: `Navbar()`, `Footer()`, `useActiveSection(ids: string[]) → string`. IDs de secção na Home: `home`, `about`, `experience`, `skills`, `projects`.

- [ ] **Step 1: Escrever o teste do hook de secção ativa (primeiro)**

`src/components/layout/__tests__/useActiveSection.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from '../useActiveSection.js';

let observerCallback;

class ControllableObserver {
  constructor(callback) {
    observerCallback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('useActiveSection', () => {
  beforeEach(() => {
    global.IntersectionObserver = ControllableObserver;
    document.body.innerHTML = '<div id="about"></div><div id="projects"></div>';
  });

  it('returns the most visible intersecting section', () => {
    const { result } = renderHook(() => useActiveSection(['about', 'projects']));
    expect(result.current).toBe('about');

    act(() => {
      observerCallback([
        { target: document.getElementById('about'), isIntersecting: true, intersectionRatio: 0.2 },
        { target: document.getElementById('projects'), isIntersecting: true, intersectionRatio: 0.8 },
      ]);
    });

    expect(result.current).toBe('projects');
  });

  it('ignores sections that are not intersecting', () => {
    const { result } = renderHook(() => useActiveSection(['about', 'projects']));

    act(() => {
      observerCallback([
        { target: document.getElementById('about'), isIntersecting: false, intersectionRatio: 1 },
      ]);
    });

    expect(result.current).toBe('about');
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/components/layout/__tests__/useActiveSection.test.js`
Expected: FAIL — `Failed to resolve import "../useActiveSection.js"`.

- [ ] **Step 3: Criar `src/components/layout/useActiveSection.js`**

```js
import { useEffect, useState } from 'react';

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
```

- [ ] **Step 4: Correr e ver passar**

Run: `npx vitest run src/components/layout/__tests__/useActiveSection.test.js`
Expected: PASS — 2 testes.

- [ ] **Step 5: Escrever os testes da Navbar (primeiro)**

`src/components/layout/__tests__/Navbar.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../Navbar.jsx';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

describe('Navbar', () => {
  it('renders one link per navigation section', () => {
    renderWithProviders(<Navbar />);
    ['Home', 'About', 'Experience', 'Skills', 'Projects', 'Contact'].forEach((label) => {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    });
  });

  it('exposes the language and theme controls', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('group', { name: /Switch to/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to (light|dark) theme/i })).toBeInTheDocument();
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    const toggle = screen.getByRole('button', { name: /Open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: /Close menu/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
```

- [ ] **Step 6: Correr e ver falhar**

Run: `npx vitest run src/components/layout/__tests__/Navbar.test.jsx`
Expected: FAIL — `Failed to resolve import "../Navbar.jsx"`.

- [ ] **Step 7: Criar `src/components/layout/Navbar.jsx`**

```jsx
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
          {t({ en: 'Diogo Oliveira', pt: 'Diogo Oliveira' })}
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
```

- [ ] **Step 8: Criar `src/components/layout/Footer.jsx`**

```jsx
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
```

- [ ] **Step 9: Criar o placeholder temporário e reescrever `Home.jsx`**

`src/components/sections/Placeholder.jsx` (temporário — removido na Task 10 quando todas as secções reais existirem):

```jsx
export function Placeholder({ label }) {
  return <p className="text-muted">{label}</p>;
}
```

`src/pages/Home.jsx`:

```jsx
import { ui } from '../i18n/ui.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Placeholder } from '../components/sections/Placeholder.jsx';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div id="home">
        <Placeholder label="Hero" />
      </div>
      <Section id="about" title={t(ui.about.title)}>
        <Placeholder label="About" />
      </Section>
      <Section id="experience" title={t(ui.experience.title)}>
        <Placeholder label="Experience" />
      </Section>
      <Section id="skills" title={t(ui.skills.title)}>
        <Placeholder label="Skills" />
      </Section>
      <Section id="projects" title={t(ui.projects.title)}>
        <Placeholder label="Contact" />
      </Section>
    </>
  );
}
```

- [ ] **Step 10: Reescrever `src/App.jsx`**

```jsx
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';

const Contact = lazy(() => import('./pages/Contact.jsx'));

function ThirdPartyEffects() {
  useEffect(() => {
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (!domain) return undefined;
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', domain);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const moduleName = '@sentry/react';
        const Sentry = await import(/* @vite-ignore */ moduleName);
        if (!cancelled) {
          Sentry.init({ dsn, integrations: [], tracesSampleRate: 0.1 });
        }
      } catch {
        // Sentry not installed — ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ThirdPartyEffects />
          <div className="flex min-h-screen flex-col bg-bg">
            <Navbar />
            <main id="main-content" className="flex-1">
              <Suspense
                fallback={
                  <div className="mx-auto w-full max-w-container px-6 py-32 text-muted md:px-10">Loading…</div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 11: Reescrever o teste da Home e correr os testes do layout**

`src/pages/__tests__/Home.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Home from '../Home.jsx';
import { navSections } from '../../i18n/ui.js';
import { renderWithProviders } from '../../test/renderWithProviders.jsx';

describe('Home page', () => {
  it('renders one anchor per navigation section', () => {
    renderWithProviders(<Home />);
    navSections
      .filter((section) => section.type === 'anchor')
      .forEach((section) => {
        expect(document.getElementById(section.id), `missing #${section.id}`).toBeTruthy();
      });
  });

  it('renders the section headings', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/layout src/pages src/theme src/i18n src/data src/components/ui`
Expected: PASS — todos.

- [ ] **Step 12: Remover código morto**

- Apagar `src/pages/Skills.jsx` e a rota `/skills` (já não referida em `App.jsx`).
- Verificar `SecurityMonitor.jsx`: `grep -n "SecurityMonitor" -r src`; se não houver imports, apagar o ficheiro.
- Apagar o formulário de contacto falso da Home (já substituído — confirmar que não existe nenhum `handleSubmit` em `src/pages/Home.jsx`).

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "refactor(app): rebuild shell with providers, navbar, footer and section anchors"
```

---

### Task 6: Hero

**Files:**
- Create: `src/components/sections/Hero.jsx`
- Modify: `src/pages/Home.jsx` (usa `Hero` em `#home`)
- Test: `src/components/sections/__tests__/Hero.test.jsx`

**Interfaces:**
- Consumes: `profile`, `ui.hero`, `useLanguage`, `containerStagger`, `lineUp`, `renderWithProviders`.
- Produces: `Hero()`.

- [ ] **Step 1: Escrever o teste (primeiro)**

`src/components/sections/__tests__/Hero.test.jsx`:

```jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Hero } from '../Hero.jsx';
import { profile } from '../../../data/profile.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('Hero', () => {
  it('shows the name, role, intro and both calls to action', () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText('Diogo Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Full-stack developer. From requirements to production.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start a conversation/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /Download CV/i })).toHaveAttribute('href', profile.cvPath);
  });

  it('downloads the CV with the download attribute', () => {
    renderWithProviders(<Hero />);
    expect(screen.getByRole('link', { name: /Download CV/i })).toHaveAttribute('download');
  });

  it('lists the current role, the degree and the core stack', () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText('Full-Stack Developer at F.Rego')).toBeInTheDocument();
    expect(screen.getByText(/MSc in Software Engineering at ISEP/)).toBeInTheDocument();
    profile.coreStack.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders in Portuguese and keeps content visible with reduced motion', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
    renderWithProviders(<Hero />);
    expect(screen.getByText('Desenvolvedor full-stack. Do requisito à produção.')).toBeInTheDocument();
    expect(screen.getByText('Diogo Oliveira')).toBeVisible();
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/components/sections/__tests__/Hero.test.jsx`
Expected: FAIL — `Failed to resolve import "../Hero.jsx"`.

- [ ] **Step 3: Criar `src/components/sections/Hero.jsx`**

```jsx
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';
import { containerStagger, lineUp } from '../ui/motion.js';

export function Hero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const Wrapper = reduceMotion ? 'div' : motion.div;
  const Line = reduceMotion ? 'div' : motion.div;
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
```

- [ ] **Step 4: Usar o Hero em `src/pages/Home.jsx`**

Substituir o bloco `<div id="home"><Placeholder label="Hero" /></div>` por:

```jsx
      <div id="home">
        <Hero />
      </div>
```

e adicionar `import { Hero } from '../components/sections/Hero.jsx';` no topo.

- [ ] **Step 5: Correr e ver passar**

Run: `npx vitest run src/components/sections/__tests__/Hero.test.jsx`
Expected: PASS — 4 testes.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.jsx src/components/sections/__tests__/Hero.test.jsx src/pages/Home.jsx
git commit -m "feat(hero): rebuild hero with specimen type, current focus and CTAs"
```

---

### Task 7: About — bio, detalhes, línguas e educação

**Files:**
- Create: `src/components/sections/About.jsx`
- Modify: `src/pages/Home.jsx` (usa `About` em `#about`)
- Test: `src/components/sections/__tests__/About.test.jsx`

**Interfaces:**
- Consumes: `profile`, `education`, `ui.about`, `useLanguage`.
- Produces: `About()`.

- [ ] **Step 1: Escrever o teste (primeiro)**

`src/components/sections/__tests__/About.test.jsx`:

```jsx
import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { About } from '../About.jsx';
import { profile } from '../../../data/profile.js';
import { education } from '../../../data/education.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => localStorage.clear());

describe('About', () => {
  it('renders the bio paragraphs', () => {
    renderWithProviders(<About />);
    expect(screen.getByText(/full-stack developer based in Porto/i)).toBeInTheDocument();
    expect(screen.getByText(/gathering requirements, designing the data model/i)).toBeInTheDocument();
  });

  it('lists all languages with their levels', () => {
    renderWithProviders(<About />);
    ['Portuguese', 'English', 'Spanish', 'Basque (Euskara)', 'French'].forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    expect(screen.getByText('Native')).toBeInTheDocument();
  });

  it('lists education entries', () => {
    renderWithProviders(<About />);
    education.forEach((entry) => {
      expect(screen.getByText(entry.school)).toBeInTheDocument();
      expect(screen.getByText(entry.degree.en)).toBeInTheDocument();
    });
  });

  it('links email, GitHub and LinkedIn', () => {
    renderWithProviders(<About />);
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', profile.links.github);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', profile.links.linkedin);
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/components/sections/__tests__/About.test.jsx`
Expected: FAIL — `Failed to resolve import "../About.jsx"`.

- [ ] **Step 3: Criar `src/components/sections/About.jsx`**

```jsx
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
```

- [ ] **Step 4: Usar em `Home.jsx`**

Substituir `<Placeholder label="About" />` por `<About />` (Secção `#about` mantém o título) e importar `About`.

- [ ] **Step 5: Correr e ver passar**

Run: `npx vitest run src/components/sections/__tests__/About.test.jsx`
Expected: PASS — 4 testes.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/About.jsx src/components/sections/__tests__/About.test.jsx src/pages/Home.jsx
git commit -m "feat(about): add bio, details, languages and education"
```

---

### Task 8: Experiência em timeline

**Files:**
- Create: `src/components/sections/Experience.jsx`
- Modify: `src/pages/Home.jsx` (usa `Experience` em `#experience`)
- Test: `src/components/sections/__tests__/Experience.test.jsx`

**Interfaces:**
- Consumes: `experience`, `ui.experience`, `useLanguage`, `useReducedMotion`.
- Produces: `Experience()`.

- [ ] **Step 1: Escrever o teste (primeiro)**

`src/components/sections/__tests__/Experience.test.jsx`:

```jsx
import { describe, it, expect, afterEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { Experience } from '../Experience.jsx';
import { experience } from '../../../data/experience.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => localStorage.clear());

describe('Experience', () => {
  it('renders one list item per job, in order', () => {
    renderWithProviders(<Experience />);
    const items = screen.getAllByRole('listitem');
    const jobs = items.filter((item) => /Developer/.test(item.textContent));
    expect(jobs).toHaveLength(2);
    expect(jobs[0]).toHaveTextContent('F.Rego');
    expect(jobs[1]).toHaveTextContent('SISTRADE');
  });

  it('shows the period, location and numbered markers', () => {
    renderWithProviders(<Experience />);
    expect(screen.getByText('Mar 2026 — Present')).toBeInTheDocument();
    expect(screen.getByText('Jul 2024 — Mar 2026')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
  });

  it('renders every bullet and technology', () => {
    const { container } = renderWithProviders(<Experience />);
    experience.forEach((entry) => {
      entry.bullets.forEach((bullet) => {
        expect(within(container).getByText(bullet.en)).toBeInTheDocument();
      });
      entry.tech.forEach((tech) => {
        expect(within(container).getAllByText(tech).length).toBeGreaterThan(0);
      });
    });
  });

  it('switches to Portuguese copy', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Experience />);
    expect(screen.getByText('Mar 2026 — Presente')).toBeInTheDocument();
    expect(screen.getByText(/Responsável de ponta a ponta/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/components/sections/__tests__/Experience.test.jsx`
Expected: FAIL — `Failed to resolve import "../Experience.jsx"`.

- [ ] **Step 3: Criar `src/components/sections/Experience.jsx`**

```jsx
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
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
        <motion.span
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
```

- [ ] **Step 4: Usar em `Home.jsx`**

Substituir `<Placeholder label="Experience" />` por `<Experience />` e importar.

- [ ] **Step 5: Correr e ver passar**

Run: `npx vitest run src/components/sections/__tests__/Experience.test.jsx`
Expected: PASS — 4 testes.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Experience.jsx src/components/sections/__tests__/Experience.test.jsx src/pages/Home.jsx
git commit -m "feat(experience): add scroll-linked timeline with numbered entries"
```

---

### Task 9: Skills

**Files:**
- Create: `src/components/sections/Skills.jsx`
- Modify: `src/pages/Home.jsx` (usa `Skills` em `#skills`)
- Test: `src/components/sections/__tests__/Skills.test.jsx`

**Interfaces:**
- Consumes: `skillGroups`, `ui.skills`, `useLanguage`.
- Produces: `Skills()`.

- [ ] **Step 1: Escrever o teste (primeiro)**

`src/components/sections/__tests__/Skills.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Skills } from '../Skills.jsx';
import { skillGroups } from '../../../data/skills.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

describe('Skills', () => {
  it('renders every group and every item', () => {
    const { container } = renderWithProviders(<Skills />);
    skillGroups.forEach((group) => {
      expect(screen.getByText(group.label.en)).toBeInTheDocument();
      group.items.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      });
    });
    expect(container.querySelector('.marquee-content')).toBeNull();
  });

  it('renders the note in Portuguese when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Skills />);
    expect(screen.getByText(/A stack que uso para levar um projeto/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/components/sections/__tests__/Skills.test.jsx`
Expected: FAIL — `Failed to resolve import "../Skills.jsx"`.

- [ ] **Step 3: Criar `src/components/sections/Skills.jsx`**

```jsx
import { skillGroups } from '../../data/skills.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';

export function Skills() {
  const { t } = useLanguage();

  return (
    <>
      <p className="measure mb-10 text-base text-muted">{t(ui.skills.note)}</p>
      <dl className="border-t border-line">
        {skillGroups.map((group) => (
          <div key={group.id} className="grid gap-4 border-b border-line py-6 md:grid-cols-12 md:gap-8">
            <dt className="label md:col-span-3">{t(group.label)}</dt>
            <dd className="flex flex-wrap gap-2 md:col-span-9">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
```

- [ ] **Step 4: Usar em `Home.jsx`**

Substituir `<Placeholder label="Skills" />` por `<Skills />` e importar.

- [ ] **Step 5: Correr e ver passar**

Run: `npx vitest run src/components/sections/__tests__/Skills.test.jsx`
Expected: PASS — 2 testes.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Skills.jsx src/components/sections/__tests__/Skills.test.jsx src/pages/Home.jsx
git commit -m "feat(skills): replace marquee with grouped, bilingual skill matrix"
```

---

### Task 10: Projetos — EstiMate e feed GitHub

**Files:**
- Create: `src/utils/format.js`
- Create: `src/hooks/useGithubRepos.js`
- Create: `src/components/sections/Projects.jsx`
- Create: `src/components/sections/GithubProjects.jsx`
- Modify: `src/data/projects.js` (adicionar `url` a cada repo selecionado)
- Modify: `src/pages/Home.jsx` (usa `Projects` e `GithubProjects`; remove `Placeholder`)
- Modify: `index.html` (CSP: `connect-src` com `https://api.github.com`)
- Delete: `src/components/sections/Placeholder.jsx`
- Test: `src/utils/__tests__/format.test.js`
- Test: `src/hooks/__tests__/useGithubRepos.test.jsx`
- Test: `src/components/sections/__tests__/Projects.test.jsx`
- Test: `src/components/sections/__tests__/GithubProjects.test.jsx`

**Interfaces:**
- Consumes: `estimateProject`, `githubFeed`, `useLanguage`, `renderWithProviders`.
- Produces: `relativeTime(date, lang, now?) → string`; `useGithubRepos({ username }) → { status: 'loading' | 'ready' | 'error', repos: Array<{ name, description, url, language, stars, pushedAt }> }`; `mergeSelected(selected, repos) → Array<{ name, description, url, language, stars, pushedAt }>`; `Projects()`, `GithubProjects()`.

- [ ] **Step 1: Escrever os testes de `relativeTime` (primeiro)**

`src/utils/__tests__/format.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { relativeTime } from '../format.js';

const NOW = Date.UTC(2026, 8, 22, 12, 0, 0); // 2026-09-22T12:00:00Z

describe('relativeTime', () => {
  it('formats past dates in English', () => {
    expect(relativeTime('2026-09-19T12:00:00Z', 'en', NOW)).toMatch(/3 days ago/);
  });

  it('formats past dates in Portuguese', () => {
    expect(relativeTime('2026-09-19T12:00:00Z', 'pt', NOW)).toMatch(/há 3 dias/);
  });

  it('formats months for older dates', () => {
    expect(relativeTime('2026-02-22T12:00:00Z', 'en', NOW)).toMatch(/7 months ago/);
  });

  it('falls back gracefully for invalid dates', () => {
    expect(relativeTime('not-a-date', 'en', NOW)).toBe('');
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/utils/__tests__/format.test.js`
Expected: FAIL — `Failed to resolve import "../format.js"`.

- [ ] **Step 3: Criar `src/utils/format.js`**

```js
const UNITS = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
];

export function relativeTime(date, lang, now = Date.now()) {
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) {
    return '';
  }

  const diff = timestamp - now;
  const formatter = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

  for (let index = 0; index < UNITS.length; index += 1) {
    const [unit, size] = UNITS[index];
    const isLast = index === UNITS.length - 1;
    if (Math.abs(diff) >= size || isLast) {
      return formatter.format(Math.round(diff / size), unit);
    }
  }

  return '';
}
```

- [ ] **Step 4: Correr e ver passar**

Run: `npx vitest run src/utils/__tests__/format.test.js`
Expected: PASS — 4 testes.

- [ ] **Step 5: Escrever os testes do hook (primeiro)**

`src/hooks/__tests__/useGithubRepos.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGithubRepos } from '../useGithubRepos.js';

const USERNAME = 'OliveiraDiogo1';
const CACHE_KEY = 'github:repos:v1';

const apiRepo = (overrides) => ({
  name: 'Portfolio_React',
  description: 'Portfolio source',
  html_url: 'https://github.com/OliveiraDiogo1/Portfolio_React',
  language: 'JavaScript',
  stargazers_count: 3,
  pushed_at: '2026-09-01T10:00:00Z',
  fork: false,
  archived: false,
  ...overrides,
});

describe('useGithubRepos', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads and maps repositories from the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [apiRepo(), apiRepo({ name: 'forked', fork: true })],
      })
    );

    const { result } = renderHook(() => useGithubRepos({ username: USERNAME }));

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.repos).toHaveLength(1);
    expect(result.current.repos[0]).toMatchObject({ name: 'Portfolio_React', stars: 3 });
  });

  it('serves fresh cache without calling the API', async () => {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ username: USERNAME, fetchedAt: Date.now(), repos: [{ name: 'cached', url: 'u' }] })
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useGithubRepos({ username: USERNAME }));

    expect(result.current.status).toBe('ready');
    expect(result.current.repos[0].name).toBe('cached');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refetches when the cache is stale', async () => {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        username: USERNAME,
        fetchedAt: Date.now() - 90 * 60 * 1000,
        repos: [{ name: 'stale', url: 'u' }],
      })
    );
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);

    renderHook(() => useGithubRepos({ username: USERNAME }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });

  it('reports an error state when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) }));

    const { result } = renderHook(() => useGithubRepos({ username: USERNAME }));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.repos).toEqual([]);
  });
});
```

- [ ] **Step 6: Correr e ver falhar**

Run: `npx vitest run src/hooks/__tests__/useGithubRepos.test.jsx`
Expected: FAIL — `Failed to resolve import "../useGithubRepos.js"`.

- [ ] **Step 7: Criar `src/hooks/useGithubRepos.js`**

```js
import { useEffect, useState } from 'react';

const CACHE_KEY = 'github:repos:v1';
const MAX_AGE_MS = 60 * 60 * 1000;

function readCache(username, now) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed?.username !== username || typeof parsed?.fetchedAt !== 'number' || !Array.isArray(parsed?.repos)) {
      return null;
    }
    if (now - parsed.fetchedAt > MAX_AGE_MS) {
      return null;
    }
    return parsed.repos;
  } catch {
    return null;
  }
}

function writeCache(username, repos, now) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ username, fetchedAt: now, repos }));
  } catch {
    // storage unavailable — the section still renders from live data
  }
}

export function mapRepo(repo) {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
  };
}

export function mergeSelected(selected, liveRepos) {
  return selected.map((entry) => {
    const live = liveRepos.find((repo) => repo.name.toLowerCase() === entry.name.toLowerCase());
    return {
      name: entry.name,
      description: entry.description,
      url: live?.url ?? entry.url,
      language: live?.language ?? null,
      stars: live?.stars ?? null,
      pushedAt: live?.pushedAt ?? null,
    };
  });
}

export function useGithubRepos({ username }) {
  const [state, setState] = useState(() => {
    const cached = readCache(username, Date.now());
    return cached ? { status: 'ready', repos: cached } : { status: 'loading', repos: [] };
  });

  useEffect(() => {
    const cached = readCache(username, Date.now());
    if (cached) {
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub API responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }
        const mapped = data.filter((repo) => !repo.fork && !repo.archived).map(mapRepo);
        writeCache(username, mapped, Date.now());
        setState({ status: 'ready', repos: mapped });
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', repos: [] });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [username]);

  return state;
}
```

- [ ] **Step 8: Adicionar `url` aos repositórios selecionados em `src/data/projects.js`**

Cada entrada de `githubFeed.selected` passa a ter `url`:

```js
      name: 'Portfolio_React',
      url: 'https://github.com/OliveiraDiogo1/Portfolio_React',
```
```js
      name: 'GOFTS',
      url: 'https://github.com/OliveiraDiogo1/GOFTS',
```
```js
      name: 'git_test',
      url: 'https://github.com/OliveiraDiogo1/git_test',
```

- [ ] **Step 9: Escrever o teste de `Projects` (primeiro)**

`src/components/sections/__tests__/Projects.test.jsx`:

```jsx
import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Projects } from '../Projects.jsx';
import { estimateProject } from '../../../data/projects.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => localStorage.clear());

describe('Projects', () => {
  it('renders the EstiMate case study with its stack', () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText('EstiMate')).toBeInTheDocument();
    expect(screen.getByText(estimateProject.summary.en)).toBeInTheDocument();
    expect(screen.getByText(estimateProject.story.en)).toBeInTheDocument();
    estimateProject.stack.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('navigates the screenshots with the next button and thumbnails', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Projects />);
    expect(screen.getByText('Screen 1 of 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next screen' }));
    expect(screen.getByText('Screen 2 of 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to screen 5' }));
    expect(screen.getByText('Screen 5 of 5')).toBeInTheDocument();
  });

  it('renders Portuguese copy when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Projects />);
    expect(screen.getByText('Ecrã 1 de 5')).toBeInTheDocument();
    expect(screen.getByText(/Um potencial cliente fazia todos os orçamentos à mão/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Correr e ver falhar**

Run: `npx vitest run src/components/sections/__tests__/Projects.test.jsx`
Expected: FAIL — `Failed to resolve import "../Projects.jsx"`.

- [ ] **Step 11: Criar `src/components/sections/Projects.jsx`**

```jsx
import { useCallback, useState } from 'react';
import { estimateProject } from '../../data/projects.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';

export function Projects() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const total = estimateProject.images.length;
  const current = estimateProject.images[index];

  const goTo = useCallback((next) => {
    setIndex(((next % total) + total) % total);
  }, [total]);

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
          <img
            src={current.src}
            alt={t(current.alt)}
            className="aspect-[16/10] w-full object-contain"
            loading="lazy"
            decoding="async"
          />
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
```

- [ ] **Step 12: Escrever o teste de `GithubProjects` (primeiro)**

`src/components/sections/__tests__/GithubProjects.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { GithubProjects } from '../GithubProjects.jsx';
import { githubFeed } from '../../../data/projects.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

const apiRepo = (name, overrides = {}) => ({
  name,
  description: 'API description',
  html_url: `https://github.com/${githubFeed.username}/${name}`,
  language: 'JavaScript',
  stargazers_count: 4,
  pushed_at: '2026-09-01T10:00:00Z',
  fork: false,
  archived: false,
  ...overrides,
});

describe('GithubProjects', () => {
  beforeEach(() => sessionStorage.clear());

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the selected repositories with fallback copy while loading', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    renderWithProviders(<GithubProjects />);
    githubFeed.selected.forEach((repo) => {
      expect(screen.getByRole('link', { name: repo.name })).toHaveAttribute('href', repo.url);
      expect(screen.getByText(repo.description.en)).toBeInTheDocument();
    });
  });

  it('enriches cards with live stars when the API responds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [apiRepo('Portfolio_React', { stargazers_count: 7 })],
      })
    );
    renderWithProviders(<GithubProjects />);
    await waitFor(() => expect(screen.getByText('7 stars')).toBeInTheDocument());
  });

  it('shows the fallback notice when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    renderWithProviders(<GithubProjects />);
    await waitFor(() =>
      expect(screen.getByText(/Live stats unavailable right now/i)).toBeInTheDocument()
    );
    expect(screen.getByRole('link', { name: 'Portfolio_React' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 13: Correr e ver falhar**

Run: `npx vitest run src/components/sections/__tests__/GithubProjects.test.jsx`
Expected: FAIL — `Failed to resolve import "../GithubProjects.jsx"`.

- [ ] **Step 14: Criar `src/components/sections/GithubProjects.jsx`**

```jsx
import { githubFeed } from '../../data/projects.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { mergeSelected, useGithubRepos } from '../../hooks/useGithubRepos.js';
import { relativeTime } from '../../utils/format.js';

export function GithubProjects() {
  const { t, lang } = useLanguage();
  const { status, repos } = useGithubRepos({ username: githubFeed.username });
  const cards = mergeSelected(githubFeed.selected, repos);

  return (
    <div className="mt-24 border-t border-line pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-ink">{t(ui.projects.github.title)}</h3>
          <p className="mt-2 text-base text-muted">{t(ui.projects.github.subtitle)}</p>
        </div>
        <a
          href={`https://github.com/${githubFeed.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet text-sm font-semibold"
        >
          {t(ui.projects.github.viewAll)}
        </a>
      </div>

      {status === 'error' ? (
        <p className="mt-6 text-sm text-muted">{t(ui.projects.github.liveUnavailable)}</p>
      ) : null}

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((repo) => (
          <li key={repo.name} className="flex flex-col border border-line bg-surface p-5">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {repo.name}
            </a>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t(repo.description)}</p>
            <p className="label tnum mt-5">
              {repo.language ? `${repo.language} · ` : ''}
              {typeof repo.stars === 'number' && repo.stars > 0 ? `${t(ui.projects.github.stars, { count: repo.stars })} · ` : ''}
              {repo.pushedAt ? t(ui.projects.github.updated, { when: relativeTime(repo.pushedAt, lang) }) : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 15: CSP do GitHub em `index.html`**

Na meta `Content-Security-Policy`, acrescentar `https://api.github.com` ao `connect-src`:

```html
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://api.emailjs.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com https://api.github.com; frame-src https://www.google.com/recaptcha/;" />
```

- [ ] **Step 16: Usar em `Home.jsx` e remover o placeholder**

Substituir `<Placeholder label="Contact" />` por `<Projects />` seguido de `<GithubProjects />` dentro da secção `#projects`; importar ambos; apagar `src/components/sections/Placeholder.jsx` e o respetivo import.

- [ ] **Step 17: Correr os testes da tarefa e a suite**

Run: `npx vitest run src/utils src/hooks src/components/sections`
Expected: PASS — format (4), hook (4), Projects (3), GithubProjects (3).

Run: `npx vitest run`
Expected: PASS — suite completa.

- [ ] **Step 18: Commit**

```bash
git add -A
git commit -m "feat(projects): add EstiMate case study and live GitHub feed with fallback"
```

---

### Task 11: Contacto — formulário bilingue e códigos de erro

**Files:**
- Modify: `src/utils/security.js` (códigos de erro em vez de strings; regex Unicode para nomes)
- Modify: `src/pages/Contact.jsx` (substituição integral)
- Test: `src/utils/__tests__/security.test.js`
- Test: `src/pages/__tests__/Contact.test.jsx`

**Interfaces:**
- Consumes: `ui.validation`, `useLanguage`, `useTheme`, `profile`.
- Produces: `validateAndSanitizeInput(data) → { errors: Array<{ field, code }>, sanitized }`; `checkRateLimit(id) → { allowed: true } | { allowed: false, code: 'rateLimited' }`. Códigos usados: `nameRequired`, `nameLength`, `nameChars`, `emailRequired`, `emailInvalid`, `emailLength`, `messageRequired`, `messageLength`, `messageMax`, `rateLimited`.

- [ ] **Step 1: Escrever o teste do security (primeiro)**

`src/utils/__tests__/security.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { validateAndSanitizeInput } from '../security.js';

describe('validateAndSanitizeInput', () => {
  it('accepts an accented Portuguese name', () => {
    const { errors, sanitized } = validateAndSanitizeInput({
      name: 'João Conceição',
      email: 'joao@example.com',
      message: 'Uma mensagem suficientemente longa.',
    });
    expect(errors).toEqual([]);
    expect(sanitized.name).toBe('João Conceição');
  });

  it('returns codes instead of English strings', () => {
    const { errors } = validateAndSanitizeInput({ name: 'A', email: 'nope', message: 'curta' });
    expect(errors).toEqual([
      { field: 'name', code: 'nameLength' },
      { field: 'email', code: 'emailInvalid' },
      { field: 'message', code: 'messageLength' },
    ]);
  });

  it('requires every field', () => {
    const { errors } = validateAndSanitizeInput({});
    expect(errors.map((error) => error.code)).toEqual(['nameRequired', 'emailRequired', 'messageRequired']);
  });

  it('escapes HTML in the message', () => {
    const { sanitized } = validateAndSanitizeInput({
      name: 'Diogo',
      email: 'diogo@example.com',
      message: 'Olá <script>alert(1)</script> aqui.',
    });
    expect(sanitized.message).not.toContain('<script>');
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/utils/__tests__/security.test.js`
Expected: FAIL — o segundo teste falha porque as mensagens são strings inglesas.

- [ ] **Step 3: Atualizar `src/utils/security.js`**

Substituir as três secções de validação e o `checkRateLimit` por:

```js
export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  if (requestCounts.has(identifier)) {
    const requests = requestCounts.get(identifier).filter((time) => time > oneMinuteAgo);
    if (requests.length === 0) {
      requestCounts.delete(identifier);
    } else {
      requestCounts.set(identifier, requests);
    }
  }

  if (blockedIPs.has(identifier)) {
    return { allowed: false, code: 'rateLimited' };
  }

  const currentRequests = requestCounts.get(identifier) || [];

  if (currentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    blockedIPs.add(identifier);
    setTimeout(() => blockedIPs.delete(identifier), SECURITY_CONFIG.BLOCK_DURATION_MS);
    return { allowed: false, code: 'rateLimited' };
  }

  currentRequests.push(now);
  requestCounts.set(identifier, currentRequests);

  return { allowed: true };
};

export const validateAndSanitizeInput = (data) => {
  const errors = [];
  const sanitized = {};

  if (data.name) {
    const name = data.name.trim();
    if (name.length < 2 || name.length > 50) {
      errors.push({ field: 'name', code: 'nameLength' });
    } else if (!/^[\p{L}\p{M}\s\-'’]+$/u.test(name)) {
      errors.push({ field: 'name', code: 'nameChars' });
    } else {
      sanitized.name = name;
    }
  } else {
    errors.push({ field: 'name', code: 'nameRequired' });
  }

  if (data.email) {
    const email = data.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', code: 'emailInvalid' });
    } else if (email.length > 254) {
      errors.push({ field: 'email', code: 'emailLength' });
    } else {
      sanitized.email = email;
    }
  } else {
    errors.push({ field: 'email', code: 'emailRequired' });
  }

  if (data.message) {
    const message = data.message.trim();
    if (message.length < 10) {
      errors.push({ field: 'message', code: 'messageLength' });
    } else if (message.length > 2000) {
      errors.push({ field: 'message', code: 'messageMax' });
    } else {
      sanitized.message = message
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }
  } else {
    errors.push({ field: 'message', code: 'messageRequired' });
  }

  return { errors, sanitized };
};
```

Restantes exports (`generateIdentifier`, `validateOrigin`, `logSecurityEvent`, `validateRecaptcha`) ficam como estão.

- [ ] **Step 4: Correr e ver passar**

Run: `npx vitest run src/utils/__tests__/security.test.js`
Expected: PASS — 4 testes.

- [ ] **Step 5: Escrever o teste do formulário (primeiro)**

`src/pages/__tests__/Contact.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact.jsx';
import { LanguageToggle } from '../../components/ui/LanguageToggle.jsx';
import { renderWithProviders } from '../../test/renderWithProviders.jsx';

describe('Contact page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the form fields and the primary action', () => {
    renderWithProviders(<Contact />, { route: '/contact' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tell me what you are working on');
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });

  it('shows localized validation errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />, { route: '/contact' });
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByText('Write a message.')).toBeInTheDocument();
  });

  it('keeps typed values when the language changes mid-form', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LanguageToggle />
        <Contact />
      </>,
      { route: '/contact' }
    );
    await user.type(screen.getByLabelText('Name'), 'João');
    await user.click(screen.getByRole('button', { name: 'pt' }));
    expect(screen.getByLabelText('Nome')).toHaveValue('João');
  });

  it('renders in Portuguese when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Contact />, { route: '/contact' });
    expect(screen.getByLabelText('Mensagem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Correr e ver falhar**

Run: `npx vitest run src/pages/__tests__/Contact.test.jsx`
Expected: FAIL — o texto do heading e as labels ainda são os antigos.

- [ ] **Step 7: Reescrever `src/pages/Contact.jsx`**

```jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';
import { profile } from '../data/profile.js';
import { ui } from '../i18n/ui.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import {
  validateAndSanitizeInput,
  generateIdentifier,
  checkRateLimit,
  validateOrigin,
  logSecurityEvent,
  validateRecaptcha,
} from '../utils/security.js';

function codedError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

export default function Contact() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || profile.email;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__EMAILJS_INIT_DONE) return;
    if (typeof window !== 'undefined') window.__EMAILJS_INIT_DONE = true;

    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey && publicKey !== 'your_emailjs_public_key_here') {
      emailjs.init(publicKey);
    } else {
      logSecurityEvent('EMAILJS_NOT_CONFIGURED', { message: 'EmailJS public key not configured' });
    }
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrorCode(null);
    setValidationErrors([]);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      setErrorCode(null);
      setValidationErrors([]);

      try {
        if (!validateOrigin()) {
          throw codedError('origin');
        }

        const { errors, sanitized } = validateAndSanitizeInput(form);
        if (errors.length > 0) {
          setValidationErrors(errors);
          return;
        }

        const identifier = generateIdentifier(sanitized);
        const rateLimitCheck = checkRateLimit(identifier);
        if (!rateLimitCheck.allowed) {
          throw codedError(rateLimitCheck.code ?? 'rateLimited');
        }

        const recaptchaValid = await validateRecaptcha(recaptchaToken);
        if (!recaptchaValid) {
          throw codedError('captcha');
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const emailServiceConfigured =
          !!serviceId &&
          !!templateId &&
          !!publicKey &&
          serviceId !== 'your_emailjs_service_id_here' &&
          templateId !== 'your_emailjs_template_id_here' &&
          publicKey !== 'your_emailjs_public_key_here';

        if (!emailServiceConfigured) {
          const subject = encodeURIComponent('Portfolio contact');
          const body = encodeURIComponent(
            `Name: ${sanitized.name}\nEmail: ${sanitized.email}\n\n${sanitized.message}`
          );
          window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
          setSubmitted(true);
          setForm({ name: '', email: '', message: '' });
          return;
        }

        const response = await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: sanitized.name,
            from_email: sanitized.email,
            message: sanitized.message,
            to_name: profile.name,
            timestamp: new Date().toISOString(),
            origin: window.location.origin,
          },
          publicKey
        );

        if (response.status !== 200) {
          throw codedError('sendFailed');
        }

        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        logSecurityEvent('EMAIL_SENT_SUCCESSFULLY', { from: sanitized.email });
      } catch (error) {
        const code = error?.code ?? 'sendFailed';
        setErrorCode(code);
        logSecurityEvent('CONTACT_FORM_ERROR', { code, formData: { name: form.name, email: form.email } });
      } finally {
        setIsLoading(false);
      }
    },
    [contactEmail, form, recaptchaToken]
  );

  const isRecaptchaEnabled = useMemo(
    () =>
      Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY) &&
      import.meta.env.VITE_RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here',
    []
  );

  const isFormDisabled = isLoading || (isRecaptchaEnabled && !recaptchaToken);

  const inputClass =
    'w-full rounded-xs border border-line bg-surface px-3 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-ink';

  return (
    <div className="mx-auto w-full max-w-container px-6 py-20 md:px-10 md:py-28">
      <h1 className="display-2 max-w-3xl text-ink">{t(ui.contact.title)}</h1>
      <p className="mt-4 text-base text-muted">{t(ui.contact.subtitle)}</p>

      <div className="mt-12 max-w-3xl border border-line bg-surface p-6 md:p-10">
        {submitted ? (
          <div role="status" className="flex flex-col items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center border border-accent text-ink">✓</span>
            <p className="text-base text-ink">{t(ui.contact.success)}</p>
          </div>
        ) : (
          <form className="grid gap-6" onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="label mb-2 block">
                  {t(ui.contact.name)}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  maxLength={50}
                  placeholder={t(ui.contact.namePlaceholder)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="label mb-2 block">
                  {t(ui.contact.email)}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  maxLength={254}
                  placeholder={t(ui.contact.emailPlaceholder)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="label mb-2 block">
                {t(ui.contact.message)}
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={6}
                maxLength={2000}
                placeholder={t(ui.contact.messagePlaceholder)}
                className={`${inputClass} resize-none`}
              />
            </div>

            {isRecaptchaEnabled ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setRecaptchaToken}
                theme={theme}
              />
            ) : null}

            <button type="submit" disabled={isFormDisabled} className="btn-primary w-full md:w-auto">
              {isLoading ? t(ui.contact.sending) : t(ui.contact.send)}
            </button>

            {errorCode || validationErrors.length > 0 ? (
              <div role="alert" className="border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">
                {errorCode ? (
                  <p>{t(ui.validation[errorCode] ?? ui.validation.sendFailed, { email: contactEmail })}</p>
                ) : (
                  <ul className="list-inside list-disc space-y-1">
                    {validationErrors.map((error) => (
                      <li key={`${error.field}-${error.code}`}>{t(ui.validation[error.code])}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </form>
        )}
      </div>

      <p className="mt-6 text-sm text-muted">
        {t(ui.contact.fallbackNote)}{' '}
        <a href={`mailto:${contactEmail}`} className="link-quiet font-semibold text-ink">
          {contactEmail}
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 8: Correr os testes da tarefa e a suite**

Run: `npx vitest run src/utils src/pages`
Expected: PASS — security (4) + Contact (4) + Home (2).

Run: `npx vitest run`
Expected: PASS — suite completa.

- [ ] **Step 9: Commit**

```bash
git add src/utils/security.js src/utils/__tests__/security.test.js src/pages/Contact.jsx src/pages/__tests__/Contact.test.jsx
git commit -m "feat(contact): bilingual form with error codes and accent-safe name validation"
```

---

### Task 12: SEO, OG image, manifest, robots, sitemap e service worker

**Files:**
- Modify: `index.html`
- Create: `scripts/generate-og.mjs`
- Modify: `public/manifest.json`, `public/robots.txt`, `public/sitemap.xml`, `public/sw.js`
- Modify: `package.json` (script `og` + devDependency de build)
- Test: `src/seo/__tests__/static-files.test.js`

**Interfaces:**
- Consumes: `profile` (valores de contacto).
- Produces: `public/og-cover.png` (1200×630), meta tags absolutas para `https://devdiogo.pt`, `sw.js` versão `portfolio-v3` com network-first em navegação.

- [ ] **Step 1: Escrever o teste dos ficheiros estáticos (primeiro)**

`src/seo/__tests__/static-files.test.js`:

```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');
const DOMAIN = 'https://devdiogo.pt';

describe('static files', () => {
  it('index.html points every absolute URL at devdiogo.pt', () => {
    const html = read('index.html');
    expect(html).toContain(`<link rel="canonical" href="${DOMAIN}/"`);
    expect(html).toContain(`<meta property="og:url" content="${DOMAIN}/"`);
    expect(html).not.toContain('yourdomain.com');
  });

  it('index.html keeps a parseable Person JSON-LD block', () => {
    const html = read('index.html');
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).toBeTruthy();
    const data = JSON.parse(match[1]);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Diogo Oliveira');
    expect(data.sameAs.length).toBeGreaterThanOrEqual(2);
  });

  it('CSP allows the GitHub API and EmailJS', () => {
    const html = read('index.html');
    expect(html).toContain('https://api.github.com');
    expect(html).toContain('https://api.emailjs.com');
  });

  it('robots.txt and sitemap.xml target devdiogo.pt', () => {
    expect(read('public/robots.txt')).toContain(`${DOMAIN}/sitemap.xml`);
    const sitemap = read('public/sitemap.xml');
    expect(sitemap).toContain(`${DOMAIN}/`);
    expect(sitemap).not.toContain('example.com');
  });

  it('manifest.json is valid and themed to the new palette', () => {
    const manifest = JSON.parse(read('public/manifest.json'));
    expect(manifest.name).toContain('Diogo Oliveira');
    expect(manifest.theme_color).toBe('#0F1115');
    expect(manifest.background_color).toBe('#0F1115');
  });

  it('service worker uses network-first navigation and a new cache version', () => {
    const sw = read('public/sw.js');
    expect(sw).toContain('portfolio-v3');
    expect(sw).toContain("request.mode === 'navigate'");
  });

  it('generated OG image exists as a real PNG', () => {
    const path = resolve(process.cwd(), 'public/og-cover.png');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(5000);
    const header = readFileSync(path).subarray(1, 4).toString('ascii');
    expect(header).toBe('PNG');
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/seo/__tests__/static-files.test.js`
Expected: FAIL — faltam canonical, OG image e o service worker ainda usa `portfolio-v1`.

- [ ] **Step 3: Atualizar `index.html`**

Cabeça completa (manter o script anti-flash da Task 2 como primeiro elemento, a CSP atualizada na Task 10 e o skip-link no body):

```html
  <title>Diogo Oliveira — Full-Stack Developer</title>
  <meta
    name="description"
    content="Full-stack developer in Porto, Portugal. React, Vue, .NET and Python shipped to production on AWS and Google Cloud."
  />
  <meta name="author" content="Diogo Oliveira" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0F1115" />

  <link rel="canonical" href="https://devdiogo.pt/" />
  <link rel="icon" type="image/png" href="/assets/dev-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="preload" as="image" href="/assets/dev-icon.png" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Diogo Oliveira — Full-Stack Developer" />
  <meta
    property="og:description"
    content="Full-stack developer in Porto, Portugal. React, Vue, .NET and Python shipped to production on AWS and Google Cloud."
  />
  <meta property="og:url" content="https://devdiogo.pt/" />
  <meta property="og:image" content="https://devdiogo.pt/og-cover.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:locale:alternate" content="pt_PT" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Diogo Oliveira — Full-Stack Developer" />
  <meta
    name="twitter:description"
    content="Full-stack developer in Porto, Portugal. React, Vue, .NET and Python shipped to production."
  />
  <meta name="twitter:image" content="https://devdiogo.pt/og-cover.png" />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Diogo Oliveira",
      "jobTitle": "Full-Stack Developer",
      "url": "https://devdiogo.pt/",
      "email": "mailto:diogo.mto123@gmail.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Porto", "addressCountry": "PT" },
      "sameAs": [
        "https://github.com/OliveiraDiogo1",
        "https://www.linkedin.com/in/oliveiradiogo1/"
      ],
      "knowsLanguage": ["pt", "en", "es", "eu", "fr"],
      "alumniOf": [
        { "@type": "CollegeOrUniversity", "name": "Instituto Superior de Engenharia do Porto" },
        { "@type": "CollegeOrUniversity", "name": "Universidade Portucalense Infante D. Henrique" }
      ]
    }
  </script>
```

- [ ] **Step 4: Criar `scripts/generate-og.mjs` e gerar a imagem**

Ruling de dependência: `@napi-rs/canvas` entra apenas como `devDependency` de build (não vai para o bundle). Instalação:

```bash
npm install --save-dev @napi-rs/canvas
```

`scripts/generate-og.mjs`:

```js
import { createCanvas } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#0F1115';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

ctx.fillStyle = '#FDE048';
ctx.fillRect(0, 0, WIDTH, 10);

ctx.fillStyle = '#F1F3F6';
ctx.font = '700 96px "Segoe UI", Arial, sans-serif';
ctx.fillText('Diogo Oliveira', 80, 300);

ctx.fillStyle = '#98A0AD';
ctx.font = '400 38px "Segoe UI", Arial, sans-serif';
ctx.fillText('Full-stack developer, from requirements to production.', 80, 372);

ctx.strokeStyle = '#262B35';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(80, 430);
ctx.lineTo(WIDTH - 80, 430);
ctx.stroke();

ctx.fillStyle = '#FDE048';
ctx.font = '600 30px "Segoe UI", Arial, sans-serif';
ctx.fillText('devdiogo.pt', 80, 500);

mkdirSync('public', { recursive: true });
writeFileSync('public/og-cover.png', canvas.toBuffer('image/png'));
console.log('public/og-cover.png written');
```

Em `package.json` adicionar o script: `"og": "node scripts/generate-og.mjs"`.

Run: `npm run og`
Expected: imprime `public/og-cover.png written`.

- [ ] **Step 5: Atualizar `public/manifest.json`**

```json
{
  "name": "Diogo Oliveira — Full-Stack Developer",
  "short_name": "Diogo Oliveira",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F1115",
  "theme_color": "#0F1115",
  "description": "Full-stack developer in Porto, Portugal. React, Vue, .NET and Python shipped to production.",
  "icons": [
    { "src": "/assets/dev-icon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/dev-icon.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 6: Atualizar `public/robots.txt` e `public/sitemap.xml`**

`robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://devdiogo.pt/sitemap.xml
```

`sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://devdiogo.pt/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://devdiogo.pt/contact</loc>
    <priority>0.6</priority>
  </url>
</urlset>
```

- [ ] **Step 7: Reescrever `public/sw.js`**

```js
const CACHE = 'portfolio-v3';

function put(request, response) {
  const copy = response.clone();
  caches.open(CACHE).then((cache) => cache.put(request, copy));
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          put(request, response);
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            put(request, response);
            return response;
          })
      )
    );
  }
});
```

- [ ] **Step 8: Correr o teste e ver passar**

Run: `npx vitest run src/seo/__tests__/static-files.test.js`
Expected: PASS — 7 testes.

- [ ] **Step 9: Commit**

```bash
git add index.html scripts/generate-og.mjs public package.json package-lock.json src/seo
git commit -m "feat(seo): point metadata at devdiogo.pt, add OG image and network-first service worker"
```

---

### Task 13: Migração de domínio, CV em PDF e documentação

**Files:**
- Create: `public/assets/cv-diogo-oliveira.pdf` (cópia de `documentation/resume_Diogo.pdf`)
- Delete: `public/assets/resume_Diogo.pdf`
- Create: `docs/domain-migration.md`
- Modify: `README.md`
- Test: `src/seo/__tests__/docs.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: runbook de migração para `devdiogo.pt`; CV servido em `/assets/cv-diogo-oliveira.pdf` (já referido por `profile.cvPath`).

- [ ] **Step 1: Escrever o teste (primeiro)**

`src/seo/__tests__/docs.test.js`:

```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('assets and documentation', () => {
  it('serves the updated CV and drops the old file name', () => {
    const cv = resolve(process.cwd(), 'public/assets/cv-diogo-oliveira.pdf');
    expect(existsSync(cv)).toBe(true);
    expect(statSync(cv).size).toBeGreaterThan(10000);
    expect(existsSync(resolve(process.cwd(), 'public/assets/resume_Diogo.pdf'))).toBe(false);
  });

  it('documents the domain migration with the exact DNS records', () => {
    const doc = read('docs/domain-migration.md');
    expect(doc).toContain('devdiogo.pt');
    expect(doc).toContain('76.76.21.21');
    expect(doc).toContain('cname.vercel-dns.com');
    expect(doc).toContain('VITE_PLAUSIBLE_DOMAIN');
  });

  it('describes the project in the README', () => {
    const readme = read('README.md');
    expect(readme).toContain('devdiogo.pt');
    expect(readme).toContain('npm run dev');
    expect(readme).toContain('npx vitest run');
  });
});
```

- [ ] **Step 2: Correr e ver falhar**

Run: `npx vitest run src/seo/__tests__/docs.test.js`
Expected: FAIL — o CV ainda tem o nome antigo.

- [ ] **Step 3: Copiar o CV e remover o antigo**

```bash
copy "documentation\resume_Diogo.pdf" "public\assets\cv-diogo-oliveira.pdf"
del "public\assets\resume_Diogo.pdf"
```

- [ ] **Step 4: Criar `docs/domain-migration.md`**

```markdown
# Migração de domínio: devdiogo-portfolio.com → devdiogo.pt

Estado: `devdiogo.pt` registado na dominios.pt. Site alojado na Vercel.

## 1. Vercel

1. Projeto → Settings → Domains → adicionar `devdiogo.pt` e `www.devdiogo.pt`.
2. Confirmar no painel os valores de DNS que a Vercel indica (podem mudar; usar sempre o que o painel mostrar).
3. Manter `devdiogo-portfolio.com` associado ao projeto e defini-lo como redirect 301 para `devdiogo.pt` até expirar.

Valores por omissão da Vercel (confirmar antes de gravar):

| Tipo | Nome | Valor | TTL |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | 3600 |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 |

## 2. dominios.pt

1. Área de cliente → Gestão de DNS da zona `devdiogo.pt`.
2. Criar os dois registos da tabela acima.
3. Remover registos de parking/parque da dominios.pt que entrem em conflito com o `@`.

## 3. Variáveis de ambiente (Vercel)

`VITE_PLAUSIBLE_DOMAIN=devdiogo.pt` em Production (e Preview). Redeploy depois de gravar.

## 4. Verificação

```bash
nslookup devdiogo.pt
curl -I https://devdiogo.pt
curl -I https://www.devdiogo.pt
```

- Esperar 200 e certificado válido para ambos.
- Preview de partilha: `https://www.opengraph.xyz/url/https%3A%2F%2Fdevdiogo.pt`.
- Confirmar que `https://devdiogo-portfolio.com` responde 301 para `https://devdiogo.pt`.
- Search Console: adicionar a propriedade `devdiogo.pt` e submeter `https://devdiogo.pt/sitemap.xml`.
```

- [ ] **Step 5: Reescrever `README.md`**

```markdown
# Portfolio — devdiogo.pt

Portfólio pessoal de Diogo Oliveira, full-stack developer. SPA em React 19 + Vite 7 + Tailwind 3, bilingue (PT/EN), com temas claro e escuro, timeline de experiência, case study de projeto e feed de repositórios GitHub.

## Comandos

```bash
npm install        # dependências
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run og         # regenera a imagem Open Graph (public/og-cover.png)
npm run lint       # ESLint
npx vitest run     # testes
npm run coverage   # cobertura
```

## Estrutura

- `src/data/` — conteúdo (perfil, experiência, educação, skills, projetos) em PT e EN.
- `src/i18n/` — provider de idioma e copy da interface.
- `src/theme/` — provider de tema (dark por omissão).
- `src/components/sections/` — secções da página.
- `docs/domain-migration.md` — runbook da migração de domínio.
- `docs/superpowers/` — spec e plano deste redesign.

## Deploy

Vercel. Domínio principal: `devdiogo.pt` (ver `docs/domain-migration.md`).
```

- [ ] **Step 6: Correr o teste e ver passar**

Run: `npx vitest run src/seo/__tests__/docs.test.js`
Expected: PASS — 3 testes.

- [ ] **Step 7: Commit**

```bash
git add public/assets docs/domain-migration.md README.md src/seo/__tests__/docs.test.js
git commit -m "chore(docs): publish updated CV, README and domain migration runbook"
```

---

### Task 14: Verificação final e revisão

**Files:**
- Nenhum ficheiro novo (correções resultantes da revisão são commitadas aqui).

- [ ] **Step 1: Suite completa, lint e build**

```bash
npx vitest run
npm run lint
npm run build
```

Expected: testes todos verdes; lint sem erros; build conclui e imprime os tamanhos dos chunks.

- [ ] **Step 2: Verificação visual no browser (desktop + mobile, dois temas e duas línguas)**

Com `npm run preview` a correr, abrir no browser (ferramentas de browser): `http://localhost:4173/`.

Checklist:
- Hero, About, Experience, Skills, Projects e feed GitHub renderizam sem erros de consola.
- Alternar PT/EN na Navbar atualiza nav, hero, secções e contacto; recarregar mantém a escolha.
- Alternar tema atualiza tokens sem flash; recarregar mantém a escolha (testar hard reload).
- Larguras 1440, 768 e 360 px sem overflow horizontal.
- `prefers-reduced-motion` (devtools) mantém todo o conteúdo visível.
- Navegação por teclado: skip-link, menu mobile (Escape fecha), carrossel e formulário.

- [ ] **Step 3: Revisão de código com contexto fresco**

Criar o pacote de revisão e lançar um subagente revisor (modelo mais capaz disponível) com o seguinte:

```bash
git merge-base main HEAD
```

- `git diff <merge-base>..HEAD > review.diff` (guardar em disco fora do repo, ou usar o output do `git diff --stat` + ficheiros).
- Instruções ao revisor: avaliar contra a spec (`docs/superpowers/specs/2026-09-22-portfolio-redesign-spec.md`) e o plano; verificar especialmente o Review Focus (localStorage indisponível, API GitHub offline, reduced motion, service worker, formulário a meio da troca de língua); classificar findings em Critical/Important/Minor.

- [ ] **Step 4: Corrigir Critical/Important com TDD**

Para cada finding Critical ou Important: escrever o teste que o reproduz (RED), corrigir (GREEN), correr a suite completa, commit. Minors ficam registados como deferidos no ledger.

- [ ] **Step 5: Fechar a branch**

Usar a skill `superpowers:finishing-a-development-branch` para integrar o trabalho (a decisão de merge/rebase é do autor).

---

## Notas de execução

- **Rulings previstos:** `@napi-rs/canvas` como devDependency de build (Task 12); remoção de `ubuntu.ttf` do fluxo (a fonte Archivo substitui, o ficheiro fica em `public/assets` sem uso); telefone fora do site (o CV em PDF mantém-no).
- **Itens fora de âmbito:** blog, i18n de URLs, caso de estudo por projeto em página própria, testes E2E com Playwright.
