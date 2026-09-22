import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Projects } from '../Projects.jsx';
import { estimateProject } from '../../../data/projects.js';
import { renderWithProviders } from '../../../test/renderWithProviders.jsx';

afterEach(() => localStorage.clear());

describe('Projects', () => {
  it('renders the EstiMate case study with its stack', () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText('EstiMate')).toBeInTheDocument();
    expect(screen.getByText(estimateProject.summary.en)).toBeInTheDocument();
    expect(screen.getByText(estimateProject.story.en)).toBeInTheDocument();
    estimateProject.stack.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('navigates the screenshots with the next button and thumbnails', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Projects />);
    expect(screen.getByText('Screen 1 of 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next screen' }));
    expect(screen.getByText('Screen 2 of 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to screen 5' }));
    expect(screen.getByText('Screen 5 of 5')).toBeInTheDocument();
  });

  it('renders Portuguese copy when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Projects />);
    expect(screen.getByText('Ecrã 1 de 5')).toBeInTheDocument();
    expect(screen.getByText(/Um potencial cliente fazia todos os orçamentos à mão/i)).toBeInTheDocument();
  });
});
