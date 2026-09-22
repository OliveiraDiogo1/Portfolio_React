import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ContactCta } from '../ContactCta.jsx';
import { profile } from '../../../data/profile.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => localStorage.clear());

describe('ContactCta', () => {
  it('renders the invitation and both ways to make contact', () => {
    renderWithProviders(<ContactCta />);
    expect(screen.getByRole('heading', { level: 2, name: /Let us build something that ships/i })).toBeInTheDocument();
    expect(screen.getByText(/open to conversations about full-stack work/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`);
    expect(screen.getByRole('link', { name: /Use the contact form/i })).toHaveAttribute('href', '/contact');
  });

  it('renders in Portuguese when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<ContactCta />);
    expect(screen.getByRole('heading', { level: 2, name: /Vamos construir algo que chega a produção/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Usar o formulário/i })).toHaveAttribute('href', '/contact');
  });
});
