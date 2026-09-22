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
