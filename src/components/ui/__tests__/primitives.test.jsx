import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from '../Section.jsx';
import { Chip } from '../Chip.jsx';
import { Reveal } from '../Reveal.jsx';

describe('UI primitives', () => {
  it('Section renders its title as a heading and its children', () => {
    render(
      <Section id="about" title="About me">
        <p>Body copy</p>
      </Section>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'About me' })).toBeInTheDocument();
    expect(screen.getByText('Body copy')).toBeInTheDocument();
    expect(document.querySelector('section#about')).toBeTruthy();
  });

  it('Chip renders its label', () => {
    render(<Chip>React.js</Chip>);
    expect(screen.getByText('React.js')).toBeInTheDocument();
  });

  it('Reveal renders children', () => {
    render(
      <Reveal>
        <span>Revealed</span>
      </Reveal>
    );
    expect(screen.getByText('Revealed')).toBeInTheDocument();
  });
});
