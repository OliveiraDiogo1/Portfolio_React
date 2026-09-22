import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Hero } from '../Hero.jsx';
import { profile } from '../../../data/profile.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => {
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

  it('renders in Portuguese', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Hero />);
    expect(screen.getByText('Desenvolvedor full-stack. Do requisito à produção.')).toBeInTheDocument();
  });
});
