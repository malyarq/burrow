// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameTab } from '../tabs/GameTab';

const scanJavaMock = vi.fn();

vi.mock('../../../services/ipc/javaRuntimeIPC', () => ({
  javaRuntimeIPC: {
    scan: (...args: unknown[]) => scanJavaMock(...args),
    select: vi.fn(),
  },
}));

const translations: Record<string, string> = {
  'settings.tab_game': 'Game',
  'settings.extra_jvm_args': 'Extra JVM Args',
  'settings.extra_jvm_args_desc': 'Tune the JVM launch flags.',
  'settings.extra_game_args': 'Extra Game Args',
  'settings.extra_game_args_desc': 'Tune the Minecraft launch flags.',
  'settings.ram': 'Max Memory (Xmx)',
  'settings.memory_input': 'Memory in GB',
  'settings.memory_limit_hint': 'Enter 1–256 GB. Burrow starts with 4 GB; leave enough memory for your system.',
  'settings.min_ram': 'Initial Memory (Xms)',
  'settings.min_ram_explanation': 'Initial memory is reserved when Minecraft starts.',
  'general.show_advanced': 'Show Advanced',
  'general.hide_advanced': 'Hide Advanced',
  'settings.java_path': 'Java Version',
  'general.rescan': 'Rescan',
  'general.scanning': 'Scanning...',
  'settings.java_auto': 'Auto (Recommended)',
  'settings.java_custom': 'Custom Path...',
  'settings.window_width': 'Window Width',
  'settings.window_height': 'Window Height',
  'settings.fullscreen': 'Fullscreen',
  'settings.fullscreen_desc': 'Launch directly into fullscreen mode.',
  'settings.autoconnect': 'Auto Connect',
  'settings.autoconnect_desc': 'Reconnect to the configured server automatically.',
  'settings.server_host': 'Server Host',
  'settings.server_port': 'Server Port',
};

function t(key: string) {
  return translations[key] ?? key;
}

function getAccentStyles() {
  return { className: 'accent-range', style: undefined };
}

function getTextboxByLabel(label: string) {
  const field = screen.getByText(label).closest('div');
  if (!field) {
    throw new Error(`Field group not found for ${label}`);
  }

  return within(field).getByRole('textbox');
}

describe('GameTab theme surface contrast', () => {
  beforeEach(() => {
    scanJavaMock.mockReset();
    scanJavaMock.mockResolvedValue([]);
  });

  it('uses semantic wrappers and shared control classes on the highest-risk settings surfaces', async () => {
    const { container } = render(
      <GameTab
        modpackConfig={null}
        setMemoryGb={vi.fn()}
        setMinMemoryGb={vi.fn()}
        setVmOptions={vi.fn()}
        setGameExtraArgs={vi.fn()}
        setGameResolution={vi.fn()}
        setAutoConnectServer={vi.fn()}
        t={t}
        getAccentStyles={getAccentStyles}
      />,
    );

    await waitFor(() => {
      expect(scanJavaMock).toHaveBeenCalled();
    });

    expect(screen.getByText('Game').closest('.settings-section-shell')).toBeTruthy();
    expect(getTextboxByLabel('Extra JVM Args').className).toContain('control-frame');
    expect(getTextboxByLabel('Extra Game Args').className).toContain('control-frame');
    expect(screen.getByRole('combobox').className).toContain('control-frame');
    expect(screen.getByText('Fullscreen').closest('.border-t')).toBeTruthy();
    expect(screen.getByText('Auto Connect').closest('.border-t')).toBeTruthy();
    expect(container.querySelectorAll('.helper-text').length).toBeGreaterThanOrEqual(4);
  });

  it('accepts a manual memory value above 16 GB and explains initial memory in advanced settings', async () => {
    const setMemoryGb = vi.fn();
    render(
      <GameTab
        modpackConfig={null}
        setMemoryGb={setMemoryGb}
        setMinMemoryGb={vi.fn()}
        setVmOptions={vi.fn()}
        setGameExtraArgs={vi.fn()}
        setGameResolution={vi.fn()}
        setAutoConnectServer={vi.fn()}
        t={t}
        getAccentStyles={getAccentStyles}
      />,
    );

    const memoryInput = await screen.findByRole('spinbutton', { name: 'Memory in GB' });
    const slider = screen.getByRole('slider', { name: 'Max Memory (Xmx)' });
    expect(slider.getAttribute('max')).toBe('32');
    expect(screen.getByTestId('memory-tick-midpoint').textContent).toBe('16 GB');
    fireEvent.change(memoryInput, { target: { value: '128' } });
    fireEvent.blur(memoryInput);
    expect(setMemoryGb).toHaveBeenCalledWith(128);

    fireEvent.click(screen.getByRole('button', { name: 'Show Advanced' }));
    expect(screen.getByText('Initial memory is reserved when Minecraft starts.')).toBeTruthy();
  });
});
