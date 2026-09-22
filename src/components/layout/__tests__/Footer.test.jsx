import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Footer } from '../Footer.jsx';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

describe('Footer', () => {
  it('links back to the top of the home page from any route', () => {
    renderWithProviders(<Footer />, { route: '/contact' });
    expect(screen.getByRole('link', { name: /Back to top/i })).toHaveAttribute('href', '/#home');
  });
});
