import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from '../useActiveSection.js';

let observerCallback;

class ControllableObserver {
  constructor(callback) {
    observerCallback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('useActiveSection', () => {
  beforeEach(() => {
    window.IntersectionObserver = ControllableObserver;
    document.body.innerHTML = '<div id="about"></div><div id="projects"></div>';
  });

  it('returns the most visible intersecting section', () => {
    const { result } = renderHook(() => useActiveSection(['about', 'projects']));
    expect(result.current).toBe('about');

    act(() => {
      observerCallback([
        { target: document.getElementById('about'), isIntersecting: true, intersectionRatio: 0.2 },
        { target: document.getElementById('projects'), isIntersecting: true, intersectionRatio: 0.8 },
      ]);
    });

    expect(result.current).toBe('projects');
  });

  it('ignores sections that are not intersecting', () => {
    const { result } = renderHook(() => useActiveSection(['about', 'projects']));

    act(() => {
      observerCallback([
        { target: document.getElementById('about'), isIntersecting: false, intersectionRatio: 1 },
      ]);
    });

    expect(result.current).toBe('about');
  });
});
