/**
 * motion caches prefers-reduced-motion at module level on first render, so this
 * file mocks matchMedia before any render and runs in its own module registry.
 */
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Hero } from '../Hero.jsx';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

window.matchMedia = (query) => ({
  matches: query.includes('prefers-reduced-motion'),
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

describe('Hero with reduced motion', () => {
  it('renders content without animation-hidden inline styles', () => {
    const { container } = renderWithProviders(<Hero />);
    expect(screen.getByText('Diogo Oliveira')).toBeInTheDocument();
    expect(container.querySelector('[style*="opacity"]')).toBeNull();
  });
});
