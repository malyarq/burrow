// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BurrowEasterEgg } from '../BurrowEasterEgg';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('BurrowEasterEgg', () => {
  it('stays inert until the hidden seven-click gesture is complete', () => {
    render(<BurrowEasterEgg disableAnimations={false} className="h-8 w-8" />);

    expect(screen.getByTestId('burrow-easter-egg').getAttribute('data-active')).toBe('false');
    fireEvent.click(screen.getByTestId('burrow-easter-egg-trigger'));
    expect(screen.getByTestId('burrow-easter-egg').getAttribute('data-active')).toBe('false');
  });

  it('reveals the legacy mark burst briefly after seven quick symbol clicks', () => {
    vi.useFakeTimers();
    render(<BurrowEasterEgg disableAnimations={false} />);
    const trigger = screen.getByTestId('burrow-easter-egg-trigger');

    for (let index = 0; index < 7; index += 1) fireEvent.click(trigger);

    expect(screen.getByTestId('burrow-easter-egg').getAttribute('data-active')).toBe('true');
    expect(screen.getByRole('status', { name: 'Easter egg activated' })).toBeTruthy();
    act(() => vi.advanceTimersByTime(1_200));
    expect(screen.getByTestId('burrow-easter-egg').getAttribute('data-active')).toBe('false');
  });

  it('keeps the discovery static when launcher animations are disabled', () => {
    render(<BurrowEasterEgg disableAnimations />);
    const trigger = screen.getByTestId('burrow-easter-egg-trigger');
    for (let index = 0; index < 7; index += 1) fireEvent.click(trigger);

    const status = screen.getByRole('status', { name: 'Easter egg activated' });
    expect(status.querySelector('svg')?.style.animation).toBe('none');
  });
});
