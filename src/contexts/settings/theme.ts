import { DEFAULT_ACCENT_COLOR } from './accent';
import { getThemePreset, getThemePresetAccent, getThemePresetConfig } from './theme-presets';
import type { AccentColor, CustomThemeConfig, Theme, ThemePresetId } from './types';

export { applyThemeToDocument } from './theme-document';

export type ThemeCustomizationScope = 'accent' | 'colors' | 'background' | 'brand';

export interface ThemeRuntimeState {
  activePresetId: ThemePresetId | null;
  customizationScopes: ThemeCustomizationScope[];
  hasCustomizations: boolean;
  matchesPresetDefaultMode: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pruneThemeValue(value: unknown): unknown {
  if (!isRecord(value)) {
    return value === undefined || value === null || value === '' ? undefined : value;
  }

  const nextEntries = Object.entries(value).reduce<Record<string, unknown>>((acc, [key, entry]) => {
    const pruned = pruneThemeValue(entry);
    if (pruned !== undefined) acc[key] = pruned;
    return acc;
  }, {});
  return Object.keys(nextEntries).length > 0 ? nextEntries : undefined;
}

function diffThemeValue(base: unknown, next: unknown): unknown {
  if (!isRecord(next)) {
    if (next === undefined || next === null || next === '') return undefined;
    return base === next ? undefined : next;
  }

  const baseRecord = isRecord(base) ? base : undefined;
  const diffEntries = Object.entries(next).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const diff = diffThemeValue(baseRecord?.[key], value);
    if (diff !== undefined) acc[key] = diff;
    return acc;
  }, {});
  return Object.keys(diffEntries).length > 0 ? diffEntries : undefined;
}

function mergeThemeConfig(base?: CustomThemeConfig, override?: CustomThemeConfig): CustomThemeConfig {
  const colors = { ...base?.colors, ...override?.colors };
  const brand = { ...base?.brand, ...override?.brand };
  const backgroundVideo = { ...base?.background?.video, ...override?.background?.video };
  const backgroundParticles = { ...base?.background?.particles, ...override?.background?.particles };
  const background = {
    ...base?.background,
    ...override?.background,
    ...(Object.keys(backgroundVideo).length > 0 ? { video: backgroundVideo } : {}),
    ...(Object.keys(backgroundParticles).length > 0 ? { particles: backgroundParticles } : {}),
  };

  return {
    ...(Object.keys(colors).length > 0 ? { colors } : {}),
    ...(Object.keys(background).length > 0 ? { background } : {}),
    ...(Object.keys(brand).length > 0 ? { brand } : {}),
  };
}

export function pruneThemeConfig(config: unknown): CustomThemeConfig {
  if (!isRecord(config)) return {};
  const strings = (value: unknown, keys: readonly string[]) => {
    if (!isRecord(value)) return {};
    return Object.fromEntries(keys.flatMap((key) => (
      typeof value[key] === 'string' && value[key].trim() ? [[key, value[key]]] : []
    )));
  };
  const bounded = (value: unknown, min: number, max: number) => (
    typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : undefined
  );
  const option = <T extends string>(value: unknown, options: readonly T[]): T | undefined => (
    typeof value === 'string' && options.includes(value as T) ? value as T : undefined
  );
  const background = isRecord(config.background) ? config.background : {};
  const video = isRecord(background.video) ? background.video : {};
  const particles = isRecord(background.particles) ? background.particles : {};
  const normalized: CustomThemeConfig = {
    colors: strings(config.colors, ['background', 'card', 'textMain', 'textSecondary', 'border', 'error']),
    brand: strings(config.brand, ['mediaBorder', 'mediaFrame', 'markBorder', 'markFrame', 'markGlow', 'shellGlow', 'surfaceCardShadow', 'surfacePanelShadow', 'surfaceSoftShadow', 'wordmarkSpacing', 'wordmarkWeight']),
    background: {
      ...strings(background, ['image']),
      blur: bounded(background.blur, 0, 20),
      opacity: bounded(background.opacity, 0, 1),
      type: option(background.type, ['image', 'video', 'particles']),
      position: option(background.position, ['center', 'cover', 'contain', 'repeat']),
      video: {
        ...strings(video, ['url']),
        volume: bounded(video.volume, 0, 1),
        loop: typeof video.loop === 'boolean' ? video.loop : undefined,
        autoPause: typeof video.autoPause === 'boolean' ? video.autoPause : undefined,
      },
      particles: {
        type: option(particles.type, ['snow', 'rain', 'stars']),
        intensity: bounded(particles.intensity, 10, 100),
        speed: bounded(particles.speed, 1, 20),
      },
    },
  };
  const pruned = pruneThemeValue(normalized) as CustomThemeConfig | undefined;
  return pruned ?? {};
}

export function resolveThemeConfig(
  theme: Theme,
  themePresetId?: ThemePresetId | null,
  customTheme?: CustomThemeConfig,
) {
  return pruneThemeConfig(mergeThemeConfig(getThemePresetConfig(themePresetId, theme), customTheme));
}

export function extractThemeOverrides(
  theme: Theme,
  themePresetId: ThemePresetId | null | undefined,
  config: CustomThemeConfig | null | undefined,
) {
  const prunedConfig = pruneThemeConfig(config);
  const presetConfig = getThemePresetConfig(themePresetId, theme);
  if (!presetConfig) return prunedConfig;
  const diff = diffThemeValue(pruneThemeConfig(presetConfig), prunedConfig) as CustomThemeConfig | undefined;
  return diff ?? {};
}

export function getThemeCustomizationScopes(
  config: CustomThemeConfig | null | undefined,
): ThemeCustomizationScope[] {
  const prunedConfig = pruneThemeConfig(config);
  return (['colors', 'background', 'brand'] as const).filter((scope) => {
    const entry = prunedConfig[scope];
    return isRecord(entry) && Object.keys(entry).length > 0;
  });
}

export function resolveAccentColor(
  theme: Theme,
  themePresetId: ThemePresetId | null | undefined,
  accentColor: AccentColor,
  accentColorSource: 'preset' | 'user' = 'preset',
) {
  if (accentColorSource === 'user') return accentColor || DEFAULT_ACCENT_COLOR;
  return getThemePresetAccent(themePresetId, theme) ?? DEFAULT_ACCENT_COLOR;
}

export function resolveThemeRuntimeState(
  theme: Theme,
  themePresetId: ThemePresetId | null | undefined,
  customTheme: CustomThemeConfig | null | undefined,
  accentColor: AccentColor,
  accentColorSource: 'preset' | 'user' = 'preset',
): ThemeRuntimeState {
  const preset = getThemePreset(themePresetId);
  const customizationScopes = getThemeCustomizationScopes(customTheme);
  const accentDefault = preset ? getThemePresetAccent(preset.id, theme) : DEFAULT_ACCENT_COLOR;
  const hasAccentCustomization = accentColorSource === 'user' && accentColor !== accentDefault;
  const scopes: ThemeCustomizationScope[] = hasAccentCustomization
    ? ['accent', ...customizationScopes]
    : customizationScopes;

  return {
    activePresetId: preset?.id ?? null,
    customizationScopes: scopes,
    hasCustomizations: scopes.length > 0,
    matchesPresetDefaultMode: preset ? preset.defaultTheme === theme : false,
  };
}
