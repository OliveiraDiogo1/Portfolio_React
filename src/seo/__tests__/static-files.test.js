// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');
const DOMAIN = 'https://devdiogo.pt';

describe('static files', () => {
  it('index.html points every absolute URL at devdiogo.pt', () => {
    const html = read('index.html');
    expect(html).toContain(`<link rel="canonical" href="${DOMAIN}/"`);
    expect(html).toContain(`<meta property="og:url" content="${DOMAIN}/"`);
    expect(html).not.toContain('yourdomain.com');
  });

  it('index.html keeps a parseable Person JSON-LD block', () => {
    const html = read('index.html');
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).toBeTruthy();
    const data = JSON.parse(match[1]);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Diogo Oliveira');
    expect(data.sameAs.length).toBeGreaterThanOrEqual(2);
  });

  it('CSP allows EmailJS and Plausible', () => {
    const html = read('index.html');
    expect(html).toContain('https://api.emailjs.com');
    expect(html).toContain('https://plausible.io');
    expect(html).not.toContain('https://api.github.com');
  });

  it('robots.txt and sitemap.xml target devdiogo.pt', () => {
    expect(read('public/robots.txt')).toContain(`${DOMAIN}/sitemap.xml`);
    const sitemap = read('public/sitemap.xml');
    expect(sitemap).toContain(`${DOMAIN}/`);
    expect(sitemap).not.toContain('example.com');
  });

  it('manifest.json is valid and themed to the new palette', () => {
    const manifest = JSON.parse(read('public/manifest.json'));
    expect(manifest.name).toContain('Diogo Oliveira');
    expect(manifest.theme_color).toBe('#0F1115');
    expect(manifest.background_color).toBe('#0F1115');
  });

  it('service worker uses network-first navigation and a new cache version', () => {
    const sw = read('public/sw.js');
    expect(sw).toContain('portfolio-v4');
    expect(sw).toContain("request.mode === 'navigate'");
  });

  it('generated OG image exists as a real PNG', () => {
    const path = resolve(process.cwd(), 'public/og-cover.png');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(5000);
    const header = readFileSync(path).subarray(1, 4).toString('ascii');
    expect(header).toBe('PNG');
  });
});
