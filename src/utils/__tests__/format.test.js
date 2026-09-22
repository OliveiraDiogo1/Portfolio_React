import { describe, it, expect } from 'vitest';
import { relativeTime } from '../format.js';

const NOW = Date.UTC(2026, 8, 22, 12, 0, 0); // 2026-09-22T12:00:00Z

describe('relativeTime', () => {
  it('formats past dates in English', () => {
    expect(relativeTime('2026-09-19T12:00:00Z', 'en', NOW)).toMatch(/3 days ago/);
  });

  it('formats past dates in Portuguese', () => {
    expect(relativeTime('2026-09-19T12:00:00Z', 'pt', NOW)).toMatch(/há 3 dias/);
  });

  it('formats months for older dates', () => {
    expect(relativeTime('2026-02-22T12:00:00Z', 'en', NOW)).toMatch(/7 months ago/);
  });

  it('falls back gracefully for invalid dates', () => {
    expect(relativeTime('not-a-date', 'en', NOW)).toBe('');
  });
});
