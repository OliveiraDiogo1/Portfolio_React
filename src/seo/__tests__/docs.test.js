// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('assets and documentation', () => {
  it('serves the updated CV and drops the old file name', () => {
    const cv = resolve(process.cwd(), 'public/assets/cv-diogo-oliveira.pdf');
    expect(existsSync(cv)).toBe(true);
    expect(statSync(cv).size).toBeGreaterThan(10000);
    expect(existsSync(resolve(process.cwd(), 'public/assets/resume_Diogo.pdf'))).toBe(false);
  });

  it('documents the domain migration with the exact DNS records', () => {
    const doc = read('docs/domain-migration.md');
    expect(doc).toContain('devdiogo.pt');
    expect(doc).toContain('76.76.21.21');
    expect(doc).toContain('cname.vercel-dns.com');
    expect(doc).toContain('VITE_PLAUSIBLE_DOMAIN');
  });

  it('describes the project in the README', () => {
    const readme = read('README.md');
    expect(readme).toContain('devdiogo.pt');
    expect(readme).toContain('npm run dev');
    expect(readme).toContain('npx vitest run');
  });
});
