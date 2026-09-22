import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App.jsx';

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('App shell', () => {
  it('renders a skip link to the main content and the home hero', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    render(<App />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('heading', { level: 1, name: 'Diogo Oliveira' })).toBeInTheDocument();
  });

  it('translates the skip link when Portuguese is selected', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    localStorage.setItem('portfolio:lang', 'pt');
    render(<App />);
    expect(screen.getByRole('link', { name: 'Saltar para o conteúdo' })).toBeInTheDocument();
  });
});
