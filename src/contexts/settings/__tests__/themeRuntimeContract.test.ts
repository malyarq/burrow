// @vitest-environment jsdom

import React, { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsProvider, useSettings } from '../../SettingsContext';
import { resolveThemeConfig } from '../theme';
import { getSelectableThemePresets } from '../theme-presets';

type SettingsSnapshot = ReturnType<typeof useSettings>;

let latestSettings: SettingsSnapshot | null = null;

function SettingsProbe({ onChange }: { onChange: (settings: SettingsSnapshot) => void }) {
  const settings = useSettings();

  useEffect(() => {
    onChange(settings);
  }, [onChange, settings]);

  return null;
}

describe('theme runtime contract', () => {
  beforeEach(() => {
    latestSettings = null;
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
  });

  it('re-inferrs preset identity when legacy empty preset storage and preset-shaped config are imported', async () => {
    localStorage.setItem('settings_theme', 'dark');
    localStorage.setItem('settings_themePresetId', '');
    localStorage.setItem('settings_customTheme', JSON.stringify(resolveThemeConfig('dark', 'forest')));

    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('forest');
    });

    expect(localStorage.getItem('settings_themePresetId')).toBe('forest');
    expect(localStorage.getItem('settings_customTheme')).toBe('{}');
    expect(latestSettings?.themeRuntimeState.matchesPresetDefaultMode).toBe(true);
    expect(latestSettings?.themeRuntimeState.hasCustomizations).toBe(false);
  });

  it('keeps the active mode when switching between preset families after a preset is already selected', async () => {
    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    act(() => {
      latestSettings?.applyThemePreset('navy');
    });

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('navy');
    });

    act(() => {
      latestSettings?.setTheme('light');
    });

    await waitFor(() => {
      expect(latestSettings?.theme).toBe('light');
    });

    act(() => {
      latestSettings?.applyThemePreset('forest');
    });

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('forest');
    });

    expect(latestSettings?.theme).toBe('light');
    expect(latestSettings?.themeRuntimeState.matchesPresetDefaultMode).toBe(false);
    expect(localStorage.getItem('settings_theme')).toBe('light');
  });

  it('follows preset-owned accent defaults across preset and mode switches until the user overrides them', async () => {
    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    act(() => {
      latestSettings?.applyThemePreset('midnight');
    });

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('midnight');
    });

    expect(latestSettings?.accentColor).toBe('purple');
    expect(localStorage.getItem('settings_accentColor')).toBe('purple');

    act(() => {
      latestSettings?.setTheme('light');
    });

    await waitFor(() => {
      expect(latestSettings?.theme).toBe('light');
    });

    expect(latestSettings?.accentColor).toBe('blue');
    expect(localStorage.getItem('settings_accentColor')).toBe('blue');
    expect(latestSettings?.themeRuntimeState.customizationScopes).not.toContain('accent');
  });

  it('keeps an explicit accent override when preset families or modes change', async () => {
    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    act(() => {
      latestSettings?.applyThemePreset('midnight');
    });

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('midnight');
    });

    act(() => {
      latestSettings?.setAccentColor('rose');
    });

    await waitFor(() => {
      expect(latestSettings?.accentColor).toBe('rose');
    });

    act(() => {
      latestSettings?.setTheme('light');
      latestSettings?.applyThemePreset('navy');
    });

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('navy');
    });

    expect(latestSettings?.accentColor).toBe('rose');
    expect(latestSettings?.themeRuntimeState.customizationScopes).toContain('accent');
  });

  it('offers Midnight only in dark mode and never offers the legacy Paper preset', () => {
    expect(getSelectableThemePresets('light').map((preset) => preset.id)).not.toContain('midnight');
    expect(getSelectableThemePresets('light').map((preset) => preset.id)).not.toContain('light-plus');
    expect(getSelectableThemePresets('dark').map((preset) => preset.id)).toContain('midnight');
    expect(getSelectableThemePresets('dark').map((preset) => preset.id)).not.toContain('light-plus');
  });

  it('returns Midnight to the neutral family in light mode without clearing user choices', async () => {
    render(React.createElement(SettingsProvider, null, React.createElement(SettingsProbe, { onChange: (settings: SettingsSnapshot) => { latestSettings = settings; } })));
    act(() => latestSettings?.applyThemePreset('midnight'));
    await waitFor(() => expect(latestSettings?.themePresetId).toBe('midnight'));
    act(() => latestSettings?.setAccentColor('purple'));
    act(() => latestSettings?.setCustomTheme({ colors: { card: '#123456' } }));
    await waitFor(() => expect(latestSettings?.accentColor).toBe('purple'));
    act(() => latestSettings?.setTheme('light'));
    await waitFor(() => expect(latestSettings?.themePresetId).toBe('default'));
    expect(latestSettings?.theme).toBe('light');
    expect(latestSettings?.accentColor).toBe('purple');
    expect(latestSettings?.customTheme).toEqual({ colors: { card: '#123456' } });
  });

  it('normalizes a stored light Midnight theme to Neutral while retaining user overrides', async () => {
    localStorage.setItem('settings_appearanceState', JSON.stringify({
      accentColor: 'purple',
      accentColorSource: 'user',
      customTheme: { colors: { card: '#123456' } },
      theme: 'light',
      themePresetId: 'midnight',
    }));
    render(React.createElement(SettingsProvider, null, React.createElement(SettingsProbe, { onChange: (settings: SettingsSnapshot) => { latestSettings = settings; } })));

    await waitFor(() => expect(latestSettings?.themePresetId).toBe('default'));
    expect(latestSettings?.theme).toBe('light');
    expect(latestSettings?.accentColor).toBe('purple');
    expect(latestSettings?.customTheme).toEqual({ colors: { card: '#123456' } });
  });

  it('keeps a stored user accent through mode, preset, custom override, and reload changes', async () => {
    localStorage.setItem('settings_appearanceState', JSON.stringify({
      accentColor: 'purple',
      accentColorSource: 'user',
      customTheme: {},
      theme: 'dark',
      themePresetId: 'default',
    }));

    const firstRender = render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    await waitFor(() => {
      expect(latestSettings?.accentColor).toBe('purple');
      expect(latestSettings?.themePresetId).toBe('default');
    });

    act(() => {
      latestSettings?.setTheme('light');
    });

    await waitFor(() => {
      expect(latestSettings?.theme).toBe('light');
    });

    act(() => {
      latestSettings?.applyThemePreset('navy');
    });

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('navy');
      expect(latestSettings?.accentColor).toBe('purple');
    });

    act(() => {
      latestSettings?.setCustomTheme(resolveThemeConfig('light', 'navy', {
        colors: { card: '#ffffff' },
      }));
    });

    await waitFor(() => {
      expect(latestSettings?.customTheme).toEqual({ colors: { card: '#ffffff' } });
    });

    act(() => {
      latestSettings?.setTheme('dark');
    });

    await waitFor(() => {
      expect(latestSettings?.theme).toBe('dark');
    });

    firstRender.unmount();
    latestSettings = null;

    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    await waitFor(() => {
      expect(latestSettings?.theme).toBe('dark');
      expect(latestSettings?.themePresetId).toBe('navy');
      expect(latestSettings?.accentColor).toBe('purple');
      expect(latestSettings?.customTheme).toEqual({ colors: { card: '#ffffff' } });
    });

    const restoredSettings = latestSettings as SettingsSnapshot | null;
    expect(restoredSettings?.themeRuntimeState.customizationScopes).toEqual(['colors']);
  });

  it('re-inferrs legacy stored accent overrides when appearance state predates accent source metadata', async () => {
    localStorage.setItem('settings_appearanceState', JSON.stringify({
      accentColor: 'rose',
      customTheme: {},
      theme: 'dark',
      themePresetId: 'midnight',
    }));

    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    await waitFor(() => {
      expect(latestSettings?.themePresetId).toBe('midnight');
    });

    expect(latestSettings?.accentColor).toBe('rose');
    expect(latestSettings?.themeRuntimeState.customizationScopes).toContain('accent');
  });

  it('persists, applies, renames, and deletes complete saved themes while ignoring malformed storage', async () => {
    localStorage.setItem('settings_savedThemes', '{bad json');
    render(React.createElement(SettingsProvider, null, React.createElement(SettingsProbe, { onChange: (settings: SettingsSnapshot) => { latestSettings = settings; } })));

    await waitFor(() => expect(latestSettings?.savedThemes).toEqual([]));
    act(() => {
      latestSettings?.applyAppearanceState({ accentColor: '#123456', accentColorSource: 'user', customTheme: { background: { type: 'particles', particles: { type: 'stars', intensity: 4 } }, brand: { shellGlow: '#654321' } }, theme: 'light', themePresetId: 'navy' });
    });
    await waitFor(() => expect(latestSettings?.themePresetId).toBe('navy'));
    act(() => latestSettings?.saveTheme('Night notes'));
    await waitFor(() => expect(latestSettings?.savedThemes).toHaveLength(1));
    const savedTheme = latestSettings!.savedThemes[0];
    act(() => latestSettings?.setTheme('dark'));
    act(() => latestSettings?.applySavedTheme(savedTheme.id));
    await waitFor(() => expect(latestSettings?.theme).toBe('light'));
    expect(latestSettings?.accentColor).toBe('#123456');
    expect(latestSettings?.customTheme).toEqual(savedTheme.customTheme);
    act(() => latestSettings?.renameSavedTheme(savedTheme.id, 'Renamed'));
    await waitFor(() => expect(latestSettings?.savedThemes[0].name).toBe('Renamed'));
    act(() => latestSettings?.deleteSavedTheme(savedTheme.id));
    await waitFor(() => expect(latestSettings?.savedThemes).toEqual([]));
  });

  it('binds date and number formatting to the active Burrow language locale', async () => {
    render(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(SettingsProbe, {
          onChange: (settings: SettingsSnapshot) => {
            latestSettings = settings;
          },
        }),
      ),
    );

    act(() => {
      latestSettings?.setLanguage('ru');
    });

    await waitFor(() => {
      expect(latestSettings?.locale).toBe('ru-RU');
      expect(document.documentElement.lang).toBe('ru');
    });

    expect(
      latestSettings?.formatDate(1_744_441_600_000, 'N/A', { month: 'short', day: 'numeric' }),
    ).toBe(new Date(1_744_441_600_000).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }));
    expect(latestSettings?.formatNumber(1234567.89)).toBe(new Intl.NumberFormat('ru-RU').format(1234567.89));

    act(() => {
      latestSettings?.setLanguage('en');
    });

    await waitFor(() => {
      expect(latestSettings?.locale).toBe('en-US');
      expect(document.documentElement.lang).toBe('en');
    });

    expect(latestSettings?.formatNumber(1234567.89)).toBe(new Intl.NumberFormat('en-US').format(1234567.89));
  });
});
