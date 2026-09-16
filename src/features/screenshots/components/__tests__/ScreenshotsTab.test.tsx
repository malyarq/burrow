// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Screenshot } from '@shared/types/screenshots';
import { createTranslator } from '../../../../contexts/settings/i18n';
import { ScreenshotsTab } from '../ScreenshotsTab';

const t = createTranslator('en');
const listMock = vi.fn();
const deleteMock = vi.fn();
const formatDateMock = vi.fn((
  timestamp: number | undefined,
  unknownText = 'Unknown',
  _options?: Intl.DateTimeFormatOptions,
) => (timestamp ? `date:${timestamp}` : unknownText));
const formatNumberMock = vi.fn((value: number, _options?: Intl.NumberFormatOptions) => `count:${value}`);

const screenshots: Screenshot[] = [
  {
    name: 'first.png',
    path: '/instance/screenshots/first.png',
    url: 'file:///instance/screenshots/first.png',
    createdAt: 1_776_000_000_000,
    size: 1024,
  },
  {
    name: 'second.png',
    path: '/instance/screenshots/second.png',
    url: 'file:///instance/screenshots/second.png',
    createdAt: 1_776_000_100_000,
    size: 2048,
  },
];

vi.mock('../../../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    t,
    formatDate: (...args: Parameters<typeof formatDateMock>) => formatDateMock(...args),
    formatNumber: (...args: Parameters<typeof formatNumberMock>) => formatNumberMock(...args),
  }),
}));

vi.mock('../../../../contexts/ToastContext', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

vi.mock('../../../../contexts/ConfirmContext', () => ({
  useConfirm: () => ({
    confirm: vi.fn(async () => true),
    prompt: vi.fn(),
  }),
}));

vi.mock('../../../../services/ipc/screenshotsIPC', () => ({
  screenshotsIPC: {
    list: (...args: unknown[]) => listMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
    rename: vi.fn(),
    openFolder: vi.fn(),
  },
}));

describe('ScreenshotsTab locale formatting', () => {
  beforeEach(() => {
    cleanup();
    listMock.mockReset();
    deleteMock.mockReset().mockResolvedValue(undefined);
    formatDateMock.mockClear();
    formatNumberMock.mockClear();
    listMock.mockResolvedValue(screenshots);
  });

  it('ignores older refresh results and results for a previous instance', async () => {
    let oldResolve!: (value: Screenshot[]) => void;
    listMock.mockImplementationOnce(() => new Promise<Screenshot[]>((resolve) => { oldResolve = resolve; }));
    const view = render(<ScreenshotsTab instanceId="alpha" />);
    fireEvent.click(screen.getByRole('button', { name: t('modpacks.update') }));
    await screen.findByText('first.png');
    await act(async () => oldResolve([]));
    expect(screen.getByText('first.png')).toBeTruthy();
    let staleResolve!: (value: Screenshot[]) => void;
    listMock.mockImplementationOnce(() => new Promise<Screenshot[]>((resolve) => { staleResolve = resolve; }));
    fireEvent.click(screen.getByRole('button', { name: t('modpacks.update') }));
    listMock.mockResolvedValue([]);
    view.rerender(<ScreenshotsTab instanceId="beta" />);
    await screen.findByText(t('screenshots.emptyTitle'));
    await act(async () => staleResolve(screenshots));
    expect(screen.queryByText('first.png')).toBeNull();
  });

  it('does not restore a deleted screenshot from an in-flight refresh', async () => {
    render(<ScreenshotsTab instanceId="alpha" />);
    await screen.findByText('first.png');
    let deleteResolve!: () => void;
    deleteMock.mockImplementationOnce(() => new Promise<void>((resolve) => { deleteResolve = resolve; }));
    fireEvent.click(screen.getByRole('button', { name: t('screenshots.deleteAction', { name: 'first.png' }) }));
    await waitFor(() => expect(deleteMock).toHaveBeenCalled());
    let listResolve!: (value: Screenshot[]) => void;
    listMock.mockImplementationOnce(() => new Promise<Screenshot[]>((resolve) => { listResolve = resolve; }));
    fireEvent.click(screen.getByRole('button', { name: t('modpacks.update') }));
    await act(async () => deleteResolve());
    expect(screen.queryByText('first.png')).toBeNull();
    await act(async () => listResolve(screenshots));
    expect(screen.queryByText('first.png')).toBeNull();
    expect(screen.getByText('second.png')).toBeTruthy();
  });

  it('uses locale-aware helpers for screenshot count and created dates', async () => {
    render(<ScreenshotsTab instanceId="alpha" />);

    const summary = await screen.findByTestId('screenshots-summary');
    expect(summary.textContent).toContain('Saved');
    expect(summary.textContent).toContain('count:2');
    expect(screen.getByText('date:1776000000000')).toBeTruthy();
    expect(screen.getByText('date:1776000100000')).toBeTruthy();
    expect(formatNumberMock).toHaveBeenCalledWith(2);
    expect(formatDateMock).toHaveBeenCalledWith(1_776_000_000_000, '', { dateStyle: 'medium' });
  });
});
