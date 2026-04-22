// @vitest-environment jsdom

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ManualVerificationScenarios } from '../scenarios';

vi.mock('../../../components/TitleBar', () => ({
  default: () => <div>FriendLauncher</div>,
}));

vi.mock('../../../components/Sidebar', () => ({
  default: () => <div>Sidebar</div>,
}));

vi.mock('../../../components/SettingsPage', () => ({
  default: ({ initialTab }: { initialTab?: string }) => (
    <div>
      <div>Launcher Settings</div>
      {initialTab === 'appearance' && (
        <>
          <div>Theme Presets</div>
          <div>Visible Background Scope</div>
        </>
      )}
      {initialTab === 'accounts' && <div>Accounts</div>}
    </div>
  ),
}));

describe('manual appearance proof', () => {
  it('marks the appearance scenario ready from the current preset-truth copy instead of stale milestone wording', async () => {
    const onReady = vi.fn();

    render(<ManualVerificationScenarios view="settings-appearance" onReady={onReady} />);

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledWith(
        'Phase 36 settings proof rendered above the real shell so reviewers can verify duplicate-copy removal, preset predictability, aligned control geometry, and visible-effect scope without falling back to older preset-only wording.',
      );
    });
  });
});
