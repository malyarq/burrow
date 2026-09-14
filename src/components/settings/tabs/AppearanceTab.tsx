import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import type { CustomThemeConfig } from '../../../contexts/settings/types';
import { buildThemeDocumentColors } from '../../../contexts/settings/theme-document';
import { AppearanceBackgroundControls } from '../appearance/AppearanceBackgroundControls';
import {
  AppearanceBranding,
  AppearanceSurfaceColors,
} from '../appearance/AppearanceBranding';
import { AppearancePresets } from '../appearance/AppearancePresets';

interface AppearanceTabProps {
  embedded?: boolean;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ embedded = false }) => {
  const {
    accentColor,
    activeThemeConfig,
    applyAppearanceState,
    applySavedTheme,
    applyThemePreset,
    customTheme,
    deleteSavedTheme,
    getAccentStyles,
    language,
    setAccentColor,
    setCustomTheme,
    setLanguage,
    saveTheme,
    setTheme,
    t,
    theme,
    themePresetId,
    themeRuntimeState,
    savedThemes,
    renameSavedTheme,
  } = useSettings();

  const updateColor = (
    key: keyof NonNullable<CustomThemeConfig['colors']>,
    value: string,
  ) => {
    setCustomTheme({
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [key]: value,
      },
    });
  };

  const resetSurfaceColors = () => {
    setCustomTheme({ ...customTheme, colors: undefined });
  };

  return (
    <div className="space-y-6">
      <div
        className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)]"
        data-testid="appearance-primary-grid"
      >
        <AppearancePresets
          accentColor={accentColor}
          activeThemeConfig={activeThemeConfig}
          applySavedTheme={applySavedTheme}
          customTheme={customTheme}
          deleteSavedTheme={deleteSavedTheme}
          embedded={embedded}
          onAppearanceStateChange={applyAppearanceState}
          onPresetChange={applyThemePreset}
          onThemeChange={setTheme}
          onRenameSavedTheme={renameSavedTheme}
          onSaveTheme={saveTheme}
          savedThemes={savedThemes}
          t={t}
          theme={theme}
          themePresetId={themePresetId}
          themeRuntimeState={themeRuntimeState}
        />
        <AppearanceBranding
          accentColor={accentColor}
          embedded={embedded}
          language={language}
          onAccentColorChange={setAccentColor}
          onLanguageChange={setLanguage}
          t={t}
        />
      </div>

      <AppearanceSurfaceColors
        baseColors={buildThemeDocumentColors(theme, activeThemeConfig)}
        colors={customTheme.colors}
        onColorChange={updateColor}
        onReset={resetSurfaceColors}
        t={t}
      />
      <AppearanceBackgroundControls
        accentRangeStyles={getAccentStyles('accent')}
        background={customTheme.background}
        onChange={(background) => setCustomTheme({ ...customTheme, background })}
        t={t}
      />

      <span className="hidden" style={getAccentStyles('text').style} />
    </div>
  );
};
