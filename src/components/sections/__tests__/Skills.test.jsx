import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Skills } from '../Skills.jsx';
import { skillGroups } from '../../../data/skills.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => localStorage.clear());

describe('Skills', () => {
  it('renders every group and every item', () => {
    const { container } = renderWithProviders(<Skills />);
    skillGroups.forEach((group) => {
      expect(screen.getByText(group.label.en)).toBeInTheDocument();
      group.items.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      });
    });
    expect(container.querySelector('.marquee-content')).toBeNull();
  });

  it('renders the note in Portuguese when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Skills />);
    expect(screen.getByText(/A stack que uso para levar um projeto/i)).toBeInTheDocument();
  });
});
