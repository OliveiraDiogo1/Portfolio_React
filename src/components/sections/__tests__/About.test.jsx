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
