// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsWorkspace } from '../SettingsWorkspace';

vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    t: (key: string) => ({
      'settings.title': 'Settings',
      'settings.workspace_title': 'Settings',
      'settings.workspace_description': 'Personalize the launcher and manage its local data.',
      'settings.tab_appearance': 'Appearance',
      'settings.tab_downloads': 'Downloads',
      'settings.tab_launcher': 'Launcher',
      'settings.tab_storage': 'Storage',
      'settings.tab_accounts': 'Accounts',
      'settings.tab_statistics': 'Statistics',
    }[key] ?? key),
    getAccentStyles: () => ({ className: '', style: undefined }),
  }),
}));

vi.mock('../../features/updater/hooks/useAppUpdater', () => ({
  useAppUpdater: () => ({ status: 'idle', updateInfo: null, progress: 0, checkForUpdates: vi.fn(), downloadUpdate: vi.fn(), installUpdate: vi.fn() }),
}));

vi.mock('../../components/settings/tabs/AppearanceTab', () => ({ AppearanceTab: () => <div>Appearance content</div> }));
vi.mock('../../components/settings/tabs/DownloadsTab', () => ({ DownloadsTab: () => <div>Downloads content</div> }));
vi.mock('../../components/settings/tabs/LauncherTab', () => ({ LauncherTab: () => <div>Launcher content</div> }));
vi.mock('../../components/settings/tabs/StorageTab', () => ({ StorageSettings: () => <div>Storage content</div> }));
vi.mock('../../features/accounts/AccountsPage', () => ({ AccountsPage: () => <div>Accounts content</div> }));
vi.mock('../../features/settings/statistics/StatisticsTab', () => ({ StatisticsTab: () => <div>Statistics content</div> }));
vi.mock('../../features/feedback/PrivacyFeedbackCard', () => ({ PrivacyFeedbackCard: () => <div /> }));
vi.mock('../../components/UpdateModal', () => ({ UpdateModal: () => null }));
vi.mock('../../services/ipc/storageMaintenanceIPC', () => ({ storageMaintenanceIPC: {} }));

describe('SettingsWorkspace', () => {
  it('renders a route-first settings page with section navigation and persistent tab panels', () => {
    render(<SettingsWorkspace />);

    expect(screen.getByTestId('settings-workspace')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(6);
    expect(screen.getByText('Appearance content')).toBeTruthy();
  });

  it('switches all six settings sections synchronously without unmounting their panels', () => {
    render(<SettingsWorkspace />);

    const sections = [
      ['Appearance', 'Appearance content'],
      ['Downloads', 'Downloads content'],
      ['Launcher', 'Launcher content'],
      ['Storage', 'Storage content'],
      ['Accounts', 'Accounts content'],
      ['Statistics', 'Statistics content'],
    ];

    for (const [label, content] of sections) {
      fireEvent.click(screen.getByRole('tab', { name: label }));
      expect(screen.getByRole('tabpanel', { name: label })).toBeTruthy();
      expect(screen.getByText(content)).toBeTruthy();
      expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(6);
    }
  });
});
