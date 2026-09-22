import { describe, it, expect } from 'vitest';
import { validateAndSanitizeInput } from '../security.js';

describe('validateAndSanitizeInput', () => {
  it('accepts an accented Portuguese name', () => {
    const { errors, sanitized } = validateAndSanitizeInput({
      name: 'João Conceição',
      email: 'joao@example.com',
      message: 'Uma mensagem suficientemente longa.',
    });
    expect(errors).toEqual([]);
    expect(sanitized.name).toBe('João Conceição');
  });

  it('returns codes instead of English strings', () => {
    const { errors } = validateAndSanitizeInput({ name: 'A', email: 'nope', message: 'curta' });
    expect(errors).toEqual([
      { field: 'name', code: 'nameLength' },
      { field: 'email', code: 'emailInvalid' },
      { field: 'message', code: 'messageLength' },
    ]);
  });

  it('requires every field', () => {
    const { errors } = validateAndSanitizeInput({});
    expect(errors.map((error) => error.code)).toEqual(['nameRequired', 'emailRequired', 'messageRequired']);
  });

  it('escapes HTML in the message', () => {
    const { sanitized } = validateAndSanitizeInput({
      name: 'Diogo',
      email: 'diogo@example.com',
      message: 'Olá <script>alert(1)</script> aqui.',
    });
    expect(sanitized.message).not.toContain('<script>');
  });
});
