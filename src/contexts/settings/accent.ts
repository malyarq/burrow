import type { AccentStyleResult, AccentStyleType } from './types';

// Preset styles are static to prevent Tailwind purging.
const ACCENT_BACKGROUND_CLASSES = 'bg-[rgb(var(--accent-main))] hover:bg-[rgb(var(--accent-hover))] text-[rgb(var(--accent-content))] hover:text-[rgb(var(--accent-hover-content))]';
export const DEFAULT_ACCENT_COLOR = 'blue';

const PRESET_STYLES: Record<string, Record<string, string>> = {
  emerald: {
    bg: ACCENT_BACKGROUND_CLASSES,
    text: 'text-emerald-500 dark:text-emerald-400',
    border: 'focus:border-emerald-500 dark:focus:border-emerald-400',
    hover: 'hover:text-emerald-600 dark:hover:text-emerald-300',
    ring: 'focus:ring-emerald-500/20',
    accent: 'accent-emerald-500 dark:accent-emerald-400',
    title: 'text-emerald-600 dark:text-emerald-400',
  },
  blue: {
    bg: ACCENT_BACKGROUND_CLASSES,
    text: 'text-blue-500 dark:text-blue-400',
    border: 'focus:border-blue-500 dark:focus:border-blue-400',
    hover: 'hover:text-blue-600 dark:hover:text-blue-300',
    ring: 'focus:ring-blue-500/20',
    accent: 'accent-blue-500 dark:accent-blue-400',
    title: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    bg: ACCENT_BACKGROUND_CLASSES,
    text: 'text-purple-500 dark:text-purple-400',
    border: 'focus:border-purple-500 dark:focus:border-purple-400',
    hover: 'hover:text-purple-600 dark:hover:text-purple-300',
    ring: 'focus:ring-purple-500/20',
    accent: 'accent-purple-500 dark:accent-purple-400',
    title: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: ACCENT_BACKGROUND_CLASSES,
    text: 'text-orange-500 dark:text-orange-400',
    border: 'focus:border-orange-500 dark:focus:border-orange-400',
    hover: 'hover:text-orange-600 dark:hover:text-orange-300',
    ring: 'focus:ring-orange-500/20',
    accent: 'accent-orange-500 dark:accent-orange-400',
    title: 'text-orange-600 dark:text-orange-400',
  },
  rose: {
    bg: ACCENT_BACKGROUND_CLASSES,
    text: 'text-rose-500 dark:text-rose-400',
    border: 'focus:border-rose-500 dark:focus:border-rose-400',
    hover: 'hover:text-rose-600 dark:hover:text-rose-300',
    ring: 'focus:ring-rose-500/20',
    accent: 'accent-rose-500 dark:accent-rose-400',
    title: 'text-rose-600 dark:text-rose-400',
  },
};

const PRESET_KEYS = Object.keys(PRESET_STYLES);

const PRESET_HEX_MAP: Record<string, string> = {
  emerald: '#10b981',
  blue: '#3b82f6',
  purple: '#9333ea',
  orange: '#f97316',
  rose: '#e11d48',
};

const PRESET_HOVER_HEX_MAP: Record<string, string> = {
  emerald: '#059669',
  blue: '#2563eb',
  purple: '#7e22ce',
  orange: '#ea580c',
  rose: '#be123c',
};

function isPreset(color: string) {
  return PRESET_KEYS.includes(color);
}

function mixHex(hex: string, targetHex: string, ratio: number) {
  const source = hex.startsWith('#') ? hex.slice(1) : hex;
  const target = targetHex.startsWith('#') ? targetHex.slice(1) : targetHex;
  const channels = [0, 2, 4].map((offset) => {
    const sourceChannel = parseInt(source.slice(offset, offset + 2), 16);
    const targetChannel = parseInt(target.slice(offset, offset + 2), 16);
    return Math.round(sourceChannel + (targetChannel - sourceChannel) * ratio);
  });

  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getAccentHexForColor(accentColor: string) {
  const color = accentColor || DEFAULT_ACCENT_COLOR;
  return isPreset(color) ? PRESET_HEX_MAP[color] : color;
}

export function getAccentHoverHexForColor(accentColor: string) {
  const color = accentColor || DEFAULT_ACCENT_COLOR;
  if (isPreset(color)) {
    return PRESET_HOVER_HEX_MAP[color];
  }

  return mixHex(getAccentHexForColor(color), '#000000', 0.18);
}

export function getAccentStylesForColor(
  accentColor: string,
  type: AccentStyleType,
  _theme?: 'light' | 'dark'
): AccentStyleResult {
  const color = accentColor || DEFAULT_ACCENT_COLOR;

  if (isPreset(color)) {
    if (type === 'bg') return { className: ACCENT_BACKGROUND_CLASSES };
    if (type === 'soft-bg') return { className: `bg-[rgb(var(--accent-main)/0.1)]` };
    if (type === 'soft-border') return { className: `border-[rgb(var(--accent-main)/0.2)]` };
    return { className: PRESET_STYLES[color][type] || '' };
  }

  if (type === 'bg') {
    return { className: ACCENT_BACKGROUND_CLASSES };
  }
  if (type === 'text') return { style: { color } };
  if (type === 'title') return { style: { color } };
  if (type === 'border') return { style: { borderColor: color } };
  if (type === 'hover') return { style: { color: getAccentHoverHexForColor(color) } };
  if (type === 'accent') return { style: { accentColor: color } };
  if (type === 'soft-bg') return { style: { backgroundColor: hexToRgba(color, 0.1) } };
  if (type === 'soft-border') return { style: { borderColor: hexToRgba(color, 0.2) } };

  return {};
}

// Replace placeholder 'XXX' with preset colors when possible.
export function getAccentClassForColor(accentColor: string, tailwindClasses: string) {
  if (isPreset(accentColor)) {
    return tailwindClasses.replace(/XXX/g, accentColor);
  }
  return tailwindClasses.replace(/XXX/g, DEFAULT_ACCENT_COLOR);
}

/**
 * Hidden div class list to prevent Tailwind from purging preset color classes.
 */
export function getPresetAccentSafelistClassName() {
  return Object.values(PRESET_STYLES).flatMap((s) => Object.values(s)).join(' ');
}
