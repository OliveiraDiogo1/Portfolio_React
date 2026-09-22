import { describe, it, expect } from 'vitest';
import { profile } from '../profile.js';
import { education } from '../education.js';
import { experience } from '../experience.js';
import { skillGroups } from '../skills.js';
import { estimateProject, githubFeed } from '../projects.js';

function expectBilingual(value, label) {
  expect(value, `${label} is missing`).toBeTruthy();
  expect(typeof value.en, `${label}.en`).toBe('string');
  expect(typeof value.pt, `${label}.pt`).toBe('string');
  expect(value.en.length, `${label}.en is empty`).toBeGreaterThan(0);
  expect(value.pt.length, `${label}.pt is empty`).toBeGreaterThan(0);
}

describe('content data', () => {
  it('profile has contact data and bilingual fields', () => {
    expect(profile.name).toBe('Diogo Oliveira');
    expect(profile.email).toMatch(/@/);
    expect(profile.cvPath.startsWith('/')).toBe(true);
    expect(profile.links.github).toMatch(/^https:\/\/github\.com\//);
    expect(profile.links.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
    expect(profile.languages).toHaveLength(5);
    profile.languages.forEach((language) => {
      expectBilingual(language.name, `language ${language.id} name`);
      expectBilingual(language.level, `language ${language.id} level`);
    });
  });

  it('education entries are bilingual', () => {
    expect(education).toHaveLength(2);
    education.forEach((entry) => {
      expectBilingual(entry.degree, `education ${entry.id} degree`);
      expectBilingual(entry.period, `education ${entry.id} period`);
      expect(entry.school.length).toBeGreaterThan(0);
    });
  });

  it('experience covers F.Rego and Sistrade with equal PT/EN bullets', () => {
    expect(experience.map((entry) => entry.id)).toEqual(['frego', 'sistrade']);
    experience.forEach((entry) => {
      expectBilingual(entry.role, `${entry.id} role`);
      expectBilingual(entry.period, `${entry.id} period`);
      expectBilingual(entry.location, `${entry.id} location`);
      expect(entry.logo.startsWith('/')).toBe(true);
      expect(Array.isArray(entry.tech)).toBe(true);
      expect(entry.tech.length).toBeGreaterThan(0);
      expect(entry.bullets.length).toBeGreaterThanOrEqual(3);
      entry.bullets.forEach((bullet, index) => {
        expectBilingual(bullet, `${entry.id} bullet ${index}`);
      });
    });
  });

  it('skill groups are bilingual and non-empty', () => {
    expect(skillGroups).toHaveLength(6);
    skillGroups.forEach((group) => {
      expectBilingual(group.label, `skill group ${group.id}`);
      expect(group.items.length).toBeGreaterThan(0);
    });
  });

  it('projects data includes screenshots and GitHub selection', () => {
    expect(estimateProject.images).toHaveLength(5);
    expectBilingual(estimateProject.summary, 'estimate summary');
    expectBilingual(estimateProject.story, 'estimate story');
    expect(githubFeed.username).toBe('OliveiraDiogo1');
    expect(githubFeed.selected.length).toBeGreaterThanOrEqual(2);
    githubFeed.selected.forEach((repo) => {
      expectBilingual(repo.description, `repo ${repo.name} description`);
    });
  });
});
