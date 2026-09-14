// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTranslator } from '../../../../contexts/settings/i18n';
import type { WorldInfo } from '@shared/contracts/worlds';
import { WorldsTab } from '../WorldsTab';

const listMock = vi.fn();
const toastErrorMock = vi.fn();
const t = createTranslator('en');

vi.mock('../../../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    t,
    formatDate: (timestamp: number | undefined, unknownText = 'Unknown', options?: Intl.DateTimeFormatOptions) =>
      timestamp ? new Date(timestamp).toLocaleDateString('en-US', options) : unknownText,
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat('en-US', options).format(value),
  }),
}));

vi.mock('../../../../contexts/ConfirmContext', () => ({
  useConfirm: () => ({
    confirm: vi.fn(),
  }),
}));

vi.mock('../../../../contexts/ToastContext', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: (...args: unknown[]) => toastErrorMock(...args),
  }),
}));

vi.mock('../../../../services/ipc/worldsIPC', () => ({
  worldsIPC: {
    listByInstanceId: (...args: unknown[]) => listMock(...args),
    backupByInstanceId: vi.fn(),
    duplicateByInstanceId: vi.fn(),
    deleteByInstanceId: vi.fn(),
    openFolderByInstanceId: vi.fn(),
  },
}));

describe('WorldsTab degraded states', () => {
  beforeEach(() => {
    cleanup();
    listMock.mockReset();
    toastErrorMock.mockReset();
  });

  it('shows an unavailable state when saved worlds cannot be loaded', async () => {
    listMock.mockRejectedValue(new Error('[IPC] worlds failed: Saves path unavailable'));

    render(<WorldsTab instanceId="alpha" mcVersion="1.20.1" />);

    const errorState = await screen.findByRole('status');
    expect(screen.getByRole('heading', { name: t('modpacks.world_load_error') })).toBeTruthy();
    expect(errorState.textContent).toContain(t('degraded.unavailable_label'));
    expect(errorState.textContent).not.toContain(t('modpacks.no_worlds_found'));
    expect(within(errorState).getByRole('button', { name: t('modpacks.update') })).toBeTruthy();
  });

  it('keeps saved worlds visible while a refresh is pending', async () => {
    let completeRefresh: ((value: WorldInfo[]) => void) | undefined;
    listMock
      .mockResolvedValueOnce([{
        folderName: 'alpha-world',
        name: 'Alpha World',
        sizeBytes: 1024,
        lastPlayed: Date.now(),
      }])
      .mockImplementationOnce(() => new Promise((resolve) => {
        completeRefresh = resolve;
      }));

    render(<WorldsTab instanceId="alpha" mcVersion="1.20.1" />);

    expect(await screen.findByText('Alpha World')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: t('modpacks.update') }));

    await waitFor(() => expect(listMock).toHaveBeenCalledTimes(2));

    expect(screen.getByText('Alpha World')).toBeTruthy();
    expect(screen.queryByText(t('modpacks.loading'))).toBeNull();

    completeRefresh!([]);
    await waitFor(() => expect(screen.getByText(t('modpacks.no_worlds_found'))).toBeTruthy());
  });
});
