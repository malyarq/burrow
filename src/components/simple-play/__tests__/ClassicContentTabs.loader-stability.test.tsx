// @vitest-environment jsdom

import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ModpackRuntimeSummary } from '../../../features/modpacks/hooks/useModpackRuntimeSummary';
import { ClassicContentTabs } from '../ClassicContentTabs';

const modsLoads = vi.fn();

vi.mock('../../../contexts/SettingsContext', () => ({
  useSettings: () => ({ t: (key: string) => key }),
}));

vi.mock('../../modpacks/details/ModsTab', () => ({
  ModsTab: ({ showAddButton, addDisabled }: { showAddButton?: boolean; addDisabled?: boolean }) => {
    useEffect(() => {
      modsLoads();
    }, []);
    return <div data-testid="classic-mods-tab" data-add-enabled={showAddButton && !addDisabled}>Installed mods</div>;
  },
}));

vi.mock('../../modpacks/details/ResourcePacksTab', () => ({ ResourcePacksTab: () => <div>Resource packs</div> }));
vi.mock('../../modpacks/details/ShadersTab', () => ({ ShadersTab: () => <div>Shaders</div> }));
vi.mock('../../modpacks/details/WorldsTab', () => ({ WorldsTab: () => <div>Worlds</div> }));

const runtimeSummary = {
  minecraftVersion: '1.20.1',
  modLoader: null,
} as unknown as ModpackRuntimeSummary;

describe('ClassicContentTabs loader stability', () => {
  it('keeps the Mods tab and its mounted content through Vanilla to Forge', () => {
    const view = render(
      <ClassicContentTabs
        instanceId="classic"
        showMods={false}
        runtimeSummary={runtimeSummary}
        onOpenGuidedContent={vi.fn()}
        presentation="inline"
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'modpacks.tab_mods' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('classic-mods-loader-hint').textContent).toContain('Vanilla не подключает моды');
    const modsTab = screen.getByTestId('classic-mods-tab');
    expect(modsTab.getAttribute('data-add-enabled')).toBe('false');

    view.rerender(
      <ClassicContentTabs
        instanceId="classic"
        showMods
        runtimeSummary={{ ...runtimeSummary, modLoader: { type: 'forge' } } as unknown as ModpackRuntimeSummary}
        onOpenGuidedContent={vi.fn()}
        presentation="inline"
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.queryByTestId('classic-mods-loader-hint')).toBeNull();
    expect(screen.getByTestId('classic-mods-tab')).toBe(modsTab);
    expect(screen.getByTestId('classic-mods-tab').getAttribute('data-add-enabled')).toBe('true');
    expect(modsLoads).toHaveBeenCalledTimes(1);
  });
});
