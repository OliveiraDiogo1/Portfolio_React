import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../Navbar.jsx';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

describe('Navbar', () => {
  it('renders one link per navigation section', () => {
    renderWithProviders(<Navbar />);
    ['Home', 'About', 'Experience', 'Skills', 'Projects', 'Contact'].forEach((label) => {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    });
  });

  it('exposes the language and theme controls', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('group', { name: /Switch to/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to (light|dark) theme/i })).toBeInTheDocument();
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    const toggle = screen.getByRole('button', { name: /Open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: /Close menu/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
