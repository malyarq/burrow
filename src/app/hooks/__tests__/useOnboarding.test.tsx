// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const capture = vi.hoisted(() => vi.fn());

vi.mock('../../../features/analytics/analyticsClient', () => ({ analyticsClient: { capture } }));

import { useOnboarding } from '../useOnboarding';

describe('useOnboarding', () => {
  afterEach(() => {
    localStorage.clear();
    capture.mockReset();
  });

  it('keeps first-run state until onboarding completes', async () => {
    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => expect(result.current.showWelcome).toBe(true));
    expect(localStorage.getItem('first_launch')).toBeNull();

    act(() => result.current.handleWelcomeComplete());
    expect(localStorage.getItem('first_launch')).toBe('false');
    expect(localStorage.getItem('onboarding_completed')).toBe('true');
  });

  it('clears first-run state when onboarding is skipped', async () => {
    const { result } = renderHook(() => useOnboarding());
    await waitFor(() => expect(result.current.showWelcome).toBe(true));

    act(() => result.current.handleSkip());
    expect(localStorage.getItem('first_launch')).toBe('false');
    expect(localStorage.getItem('onboarding_completed')).toBe('true');
  });
});
