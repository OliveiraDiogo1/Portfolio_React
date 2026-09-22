// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('index.html anti-flash script', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

  it('sets the theme class before the app bundle loads', () => {
    const scriptIndex = html.indexOf('portfolio:theme');
    const bundleIndex = html.indexOf('/src/main.jsx');
    expect(scriptIndex).toBeGreaterThan(-1);
    expect(scriptIndex).toBeLessThan(bundleIndex);
  });
});
