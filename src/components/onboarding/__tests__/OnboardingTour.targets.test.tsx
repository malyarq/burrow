// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { createTourSteps } from '../tourSteps';

describe('OnboardingTour product navigation', () => {
  it('introduces Play, Library, Together, then Settings in top-navigation order', () => {
    const steps = createTourSteps((key) => key);

    expect(steps.map((step) => step.id)).toEqual(['classic', 'modpacks', 'multiplayer', 'settings']);
    expect(steps.map((step) => step.target)).toEqual([
      '[data-tour="classic"]',
      '[data-tour="modpacks"]',
      '[data-tour="multiplayer"]',
      '[data-tour="settings"]',
    ]);
  });
});
