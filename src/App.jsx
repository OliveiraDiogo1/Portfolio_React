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
