import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home.jsx';

describe('Home page', () => {
  it('renders the developer name', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Diogo/i)).toBeInTheDocument();
    expect(screen.getByText(/Oliveira/i)).toBeInTheDocument();
  });
});
