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
