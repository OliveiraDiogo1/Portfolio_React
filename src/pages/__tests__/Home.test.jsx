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
