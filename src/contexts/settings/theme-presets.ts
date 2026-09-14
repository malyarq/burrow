import type { AccentColor, CustomThemeConfig, Theme, ThemePresetId } from './types';

export interface ThemePreset {
    id: ThemePresetId;
    labelKey: string;
    fallbackLabel: string;
    defaultTheme: Theme;
    accentDefaults: Record<Theme, AccentColor>;
    themes: Record<Theme, CustomThemeConfig>;
}

type ThemeTranslator = (key: string, params?: Record<string, string | number>) => string;

function translateWithFallback(
    t: ThemeTranslator,
    key: string,
    fallback: string,
    params?: Record<string, string | number>,
): string {
    const translated = t(key, params);
    if (translated !== key) {
        return translated;
    }

    if (!params) {
        return fallback;
    }

    return Object.entries(params).reduce(
        (text, [paramKey, value]) => text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value)),
        fallback,
    );
}

function createPresetColors(colors: NonNullable<CustomThemeConfig['colors']>): CustomThemeConfig {
    return { colors };
}

function createPresetConfig(config: CustomThemeConfig): CustomThemeConfig {
    return config;
}

function normalizeThemeConfig(config: CustomThemeConfig, options?: { includeBrand?: boolean }): string {
    const colors = config.colors
        ? Object.fromEntries(
            Object.entries(config.colors)
                .filter(([, value]) => Boolean(value))
                .sort(([left], [right]) => left.localeCompare(right))
        )
        : undefined;

    const background = config.background
        ? Object.fromEntries(
            Object.entries(config.background)
                .filter(([, value]) => value !== undefined)
                .sort(([left], [right]) => left.localeCompare(right))
        )
        : undefined;

    const brand = options?.includeBrand === false || !config.brand
        ? undefined
        : config.brand
        ? Object.fromEntries(
            Object.entries(config.brand)
                .filter(([, value]) => Boolean(value))
                .sort(([left], [right]) => left.localeCompare(right))
        )
        : undefined;

    return JSON.stringify({
        ...(colors ? { colors } : {}),
        ...(background ? { background } : {}),
        ...(brand ? { brand } : {}),
    });
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'plum', labelKey: 'settings.theme_preset_plum', fallbackLabel: 'Plum',
        defaultTheme: 'dark', accentDefaults: { light: 'purple', dark: 'purple' },
        themes: {
            light: createPresetColors({ background: '#f5f0f7', card: '#ffffff', textMain: '#302436', textSecondary: '#67536e', border: '#ddcfdf', error: '#b42340' }),
            dark: createPresetColors({ background: '#1b1520', card: '#29212f', textMain: '#f2ebf5', textSecondary: '#c3aecb', border: '#44364d', error: '#ff879e' }),
        },
    },
    {
        id: 'copper', labelKey: 'settings.theme_preset_copper', fallbackLabel: 'Copper',
        defaultTheme: 'dark', accentDefaults: { light: 'orange', dark: 'orange' },
        themes: {
            light: createPresetColors({ background: '#f5eee5', card: '#fffaf4', textMain: '#352820', textSecondary: '#6c5140', border: '#d9c4b1', error: '#ba2635' }),
            dark: createPresetColors({ background: '#191715', card: '#29231f', textMain: '#f5eee7', textSecondary: '#cabbac', border: '#493c32', error: '#ff9296' }),
        },
    },
    {
        id: 'frost', labelKey: 'settings.theme_preset_frost', fallbackLabel: 'Frost',
        defaultTheme: 'dark', accentDefaults: { light: '#287d92', dark: '#64b4c8' },
        themes: {
            light: createPresetColors({ background: '#edf4f5', card: '#faffff', textMain: '#1c343b', textSecondary: '#47656e', border: '#bdd2d7', error: '#b52b40' }),
            dark: createPresetColors({ background: '#121c22', card: '#1d2c34', textMain: '#ebf4f6', textSecondary: '#acc4ce', border: '#344b57', error: '#ff8a9f' }),
        },
    },
    {
        id: 'parchment', labelKey: 'settings.theme_preset_parchment', fallbackLabel: 'Parchment',
        defaultTheme: 'light', accentDefaults: { light: 'orange', dark: 'orange' },
        themes: {
            light: createPresetColors({ background: '#eee3cc', card: '#fff6e4', textMain: '#3e3022', textSecondary: '#715b42', border: '#ccba98', error: '#ad2337' }),
            dark: createPresetColors({ background: '#221e17', card: '#302a20', textMain: '#f6eddc', textSecondary: '#cbbc9f', border: '#504632', error: '#ff9393' }),
        },
    },
    {
        id: 'default',
        labelKey: 'settings.theme_preset_default',
        fallbackLabel: 'Neutral',
        defaultTheme: 'dark',
        accentDefaults: {
            light: 'blue',
            dark: 'blue',
        },
        themes: {
            light: createPresetColors({
                background: '#f4f4f5',
                card: '#ffffff',
                textMain: '#18181b',
                textSecondary: '#52525b',
                border: '#e4e4e7',
                error: '#dc2626',
            }),
            dark: createPresetColors({
                background: '#18181b',
                card: '#27272a',
                textMain: '#ffffff',
                textSecondary: '#d4d4d8',
                border: '#3f3f46',
                error: '#dc2626',
            }),
        }
    },
    {
        id: 'midnight',
        labelKey: 'settings.theme_preset_midnight',
        fallbackLabel: 'Midnight',
        defaultTheme: 'dark',
        accentDefaults: {
            light: 'blue',
            dark: 'purple',
        },
        themes: {
            light: createPresetConfig({
                colors: {
                    background: '#eef2ff',
                    card: '#e0e7ff',
                    textMain: '#111827',
                    textSecondary: '#4b5563',
                    border: '#c7d2fe',
                    error: '#dc2626',
                },
                brand: {
                    shellGlow: '#6366f1',
                    markFrame: '#eef2ff',
                    markBorder: '#c7d2fe',
                    mediaFrame: '#e0e7ff',
                    mediaBorder: '#c7d2fe',
                },
            }),
            dark: createPresetConfig({
                colors: {
                    background: '#09090b', // zinc-950
                    card: '#18181b', // zinc-900
                    textMain: '#fafafa', // zinc-50
                    textSecondary: '#a1a1aa', // zinc-400
                    border: '#27272a', // zinc-800
                    error: '#ef4444', // red-500
                },
                brand: {
                    shellGlow: '#6366f1',
                    markFrame: '#101325',
                    markBorder: '#312e81',
                    mediaFrame: '#14182d',
                    mediaBorder: '#4338ca',
                },
            }),
        }
    },
    {
        id: 'forest',
        labelKey: 'settings.theme_preset_forest',
        fallbackLabel: 'Warm Stone',
        defaultTheme: 'dark',
        accentDefaults: {
            light: 'orange',
            dark: 'orange',
        },
        themes: {
            light: createPresetConfig({
                colors: {
                    background: '#faf7f2',
                    card: '#f4eee5',
                    textMain: '#292524',
                    textSecondary: '#57534e',
                    border: '#e7e0d7',
                    error: '#dc2626', // red-600
                },
                brand: {
                    shellGlow: '#059669',
                    markFrame: '#ecfdf5',
                    markBorder: '#6ee7b7',
                    mediaFrame: '#d1fae5',
                    mediaBorder: '#6ee7b7',
                },
            }),
            dark: createPresetConfig({
                colors: {
                    background: '#1c1917',
                    card: '#292524',
                    textMain: '#fafaf9',
                    textSecondary: '#d6d3d1',
                    border: '#44403c',
                    error: '#f87171', // red-400
                },
                brand: {
                    shellGlow: '#34d399',
                    markFrame: '#062a17',
                    markBorder: '#047857',
                    mediaFrame: '#07351d',
                    mediaBorder: '#059669',
                },
            }),
        }
    },
    {
        id: 'light-plus',
        labelKey: 'settings.theme_preset_light_plus',
        fallbackLabel: 'Paper',
        defaultTheme: 'light',
        accentDefaults: {
            light: 'orange',
            dark: 'blue',
        },
        themes: {
            light: createPresetConfig({
                colors: {
                    background: '#ffffff',
                    card: '#f4f4f5', // zinc-100
                    textMain: '#18181b', // zinc-900
                    textSecondary: '#52525b', // zinc-600
                    border: '#e4e4e7', // zinc-200
                    error: '#dc2626', // red-600
                },
                brand: {
                    shellGlow: '#94a3b8',
                    markFrame: '#ffffff',
                    markBorder: '#d4d4d8',
                    mediaFrame: '#f4f4f5',
                    mediaBorder: '#d4d4d8',
                },
            }),
            dark: createPresetConfig({
                colors: {
                    background: '#18181b',
                    card: '#27272a',
                    textMain: '#fafafa',
                    textSecondary: '#d4d4d8',
                    border: '#52525b',
                    error: '#f87171',
                },
                brand: {
                    shellGlow: '#a1a1aa',
                    markFrame: '#202024',
                    markBorder: '#52525b',
                    mediaFrame: '#1d1d20',
                    mediaBorder: '#52525b',
                },
            }),
        }
    },
    {
        id: 'navy',
        labelKey: 'settings.theme_preset_navy',
        fallbackLabel: 'Ocean',
        defaultTheme: 'dark',
        accentDefaults: {
            light: 'blue',
            dark: 'purple',
        },
        themes: {
            light: createPresetConfig({
                colors: {
                    background: '#eff6ff', // blue-50
                    card: '#dbeafe', // blue-100
                    textMain: '#1e3a8a', // blue-900
                    textSecondary: '#1d4ed8', // blue-700
                    border: '#93c5fd', // blue-300
                    error: '#dc2626', // red-600
                },
                brand: {
                    shellGlow: '#3b82f6',
                    markFrame: '#eff6ff',
                    markBorder: '#93c5fd',
                    mediaFrame: '#dbeafe',
                    mediaBorder: '#93c5fd',
                },
            }),
            dark: createPresetConfig({
                colors: {
                    background: '#0f172a', // slate-900
                    card: '#1e293b', // slate-800
                    textMain: '#f8fafc', // slate-50
                    textSecondary: '#94a3b8', // slate-400
                    border: '#334155', // slate-700
                    error: '#ef4444', // red-500
                },
                brand: {
                    shellGlow: '#3b82f6',
                    markFrame: '#121c2f',
                    markBorder: '#334155',
                    mediaFrame: '#162033',
                    mediaBorder: '#3b82f6',
                },
            }),
        }
    }
];

const LEGACY_PRESET_CONFIGS: Array<{ id: ThemePresetId; theme: Theme; config: CustomThemeConfig }> = [
    { id: 'forest', theme: 'dark', config: createPresetColors({ background: '#052e16', card: '#064e3b', textMain: '#ecfdf5', textSecondary: '#6ee7b7', border: '#065f46', error: '#f87171' }) },
    { id: 'forest', theme: 'light', config: createPresetColors({ background: '#ecfdf5', card: '#d1fae5', textMain: '#064e3b', textSecondary: '#047857', border: '#6ee7b7', error: '#dc2626' }) },
];

export function getThemePreset(presetId: ThemePresetId | string | null | undefined) {
    if (!presetId) {
        return undefined;
    }

    return THEME_PRESETS.find((preset) => preset.id === presetId);
}

export function getThemePresetLabel(
    t: ThemeTranslator,
    presetOrId: ThemePreset | ThemePresetId | string | null | undefined,
) {
    const preset = typeof presetOrId === 'object' && presetOrId !== null && 'labelKey' in presetOrId
        ? presetOrId
        : getThemePreset(presetOrId);

    if (!preset) {
        return undefined;
    }

    return translateWithFallback(t, preset.labelKey, preset.fallbackLabel);
}

export function getThemePresetSummary(
    t: ThemeTranslator,
    presetOrId: ThemePreset | ThemePresetId | string | null | undefined,
    theme: Theme,
) {
    const presetLabel = getThemePresetLabel(t, presetOrId);
    if (!presetLabel) {
        return undefined;
    }

    const modeLabel = getThemeModeLabel(t, theme);

    return `${presetLabel} · ${modeLabel}`;
}

export function getThemeModeLabel(t: ThemeTranslator, theme: Theme) {
    return translateWithFallback(
        t,
        theme === 'light' ? 'settings.theme_light' : 'settings.theme_dark',
        theme === 'light' ? 'Light' : 'Dark',
    );
}

export function getThemePresetConfig(
    presetId: ThemePresetId | string | null | undefined,
    theme: Theme,
) {
    return getThemePreset(presetId)?.themes[theme];
}

export function getThemePresetAccent(
    presetId: ThemePresetId | string | null | undefined,
    theme: Theme,
) {
    return getThemePreset(presetId)?.accentDefaults[theme];
}

export function inferThemePresetId(
    theme: Theme,
    config: CustomThemeConfig | null | undefined,
): ThemePresetId | null {
    if (!config?.colors || config.background) {
        return null;
    }

    const normalized = normalizeThemeConfig(config, { includeBrand: false });
    const inferredPreset = THEME_PRESETS.find(
        (preset) => preset.id !== 'default' && normalizeThemeConfig(preset.themes[theme], { includeBrand: false }) === normalized,
    );

    return inferredPreset?.id
        ?? LEGACY_PRESET_CONFIGS.find((preset) => preset.theme === theme && normalizeThemeConfig(preset.config, { includeBrand: false }) === normalized)?.id
        ?? null;
}

export function getSelectableThemePresets(theme: Theme) {
    return THEME_PRESETS.filter((preset) => preset.id !== 'light-plus' && (preset.id !== 'midnight' || theme === 'dark'));
}

export function isLegacyPresetConfig(theme: Theme, presetId: ThemePresetId | null, config: CustomThemeConfig) {
    return LEGACY_PRESET_CONFIGS.some((preset) => preset.id === presetId && preset.theme === theme
        && normalizeThemeConfig(preset.config, { includeBrand: false }) === normalizeThemeConfig(config, { includeBrand: false }));
}
