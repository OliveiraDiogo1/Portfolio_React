import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact.jsx';
import { LanguageToggle } from '../../components/ui/LanguageToggle.jsx';
import { renderWithProviders } from '../../test/renderWithProviders.jsx';

describe('Contact page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the form fields and the primary action', () => {
    renderWithProviders(<Contact />, { route: '/contact' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tell me what you are working on');
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });

  it('shows localized validation errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />, { route: '/contact' });
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByText('Write a message.')).toBeInTheDocument();
  });

  it('keeps typed values when the language changes mid-form', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LanguageToggle />
        <Contact />
      </>,
      { route: '/contact' }
    );
    await user.type(screen.getByLabelText('Name'), 'João');
    await user.click(screen.getByRole('button', { name: 'pt' }));
    expect(screen.getByLabelText('Nome')).toHaveValue('João');
  });

  it('renders in Portuguese when selected', () => {
    localStorage.setItem('portfolio:lang', 'pt');
    renderWithProviders(<Contact />, { route: '/contact' });
    expect(screen.getByLabelText('Mensagem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeInTheDocument();
  });
});
