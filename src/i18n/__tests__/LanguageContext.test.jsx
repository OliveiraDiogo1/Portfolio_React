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
