import { useId, useRef } from 'react';
import { Paintbrush2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAccentHexForColor } from '../../../contexts/settings/accent';
import { CollapsibleSection } from '../../ui/CollapsibleSection';
import type { AccentColor, CustomThemeConfig, Language } from '../../../contexts/settings/types';

type Translate = (key: string, params?: Record<string, string | number>) => string;
type ThemeColors = NonNullable<CustomThemeConfig['colors']>;

const COLORS = [
  { id: 'emerald', className: 'bg-emerald-500' },
  { id: 'blue', className: 'bg-blue-500' },
  { id: 'purple', className: 'bg-purple-500' },
  { id: 'orange', className: 'bg-orange-500' },
  { id: 'rose', className: 'bg-rose-500' },
] as const;

interface AppearanceBrandingProps {
  accentColor: AccentColor;
  embedded: boolean;
  language: Language;
  onAccentColorChange: (accentColor: AccentColor) => void;
  onLanguageChange: (language: Language) => void;
  t: Translate;
}

export function AppearanceBranding({
  accentColor,
  embedded,
  language,
  onAccentColorChange,
  onLanguageChange,
  t,
}: AppearanceBrandingProps) {
  const customAccentInputRef = useRef<HTMLInputElement>(null);
  const accentLabel = t('settings.accent');
  const customColorLabel = t('settings.custom_color');
  const isCustom = !COLORS.some((color) => color.id === accentColor);

  return (
    <section
      className={embedded ? 'min-w-0' : 'settings-section-shell min-w-0 p-5'}
      data-appearance-owner="branding"
      data-testid="appearance-branding"
    >
      <div className="settings-section-stack">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Paintbrush2 aria-hidden="true" className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">{accentLabel}</span>
          </div>
          {!embedded && (
            <p className="settings-embedded-copy">{t('settings.appearance_branding_desc')}</p>
          )}
          <div className="settings-accent-grid">
            {COLORS.map((color) => (
              <button
                type="button"
                key={color.id}
                onClick={() => onAccentColorChange(color.id)}
                aria-pressed={accentColor === color.id}
                aria-label={`${accentLabel}: ${color.id}`}
                data-state={accentColor === color.id ? 'active' : 'inactive'}
                className={cn(
                  'settings-accent-chip',
                  accentColor === color.id ? 'ring-2 scale-110' : '',
                )}
                title={color.id}
              >
                <span
                  className={cn('settings-accent-swatch', color.className)}
                  style={{ backgroundColor: getAccentHexForColor(color.id) }}
                />
              </button>
            ))}

            <button
              type="button"
              onClick={() => customAccentInputRef.current?.click()}
              aria-pressed={isCustom}
              aria-label={`${accentLabel}: ${customColorLabel}`}
              data-state={isCustom ? 'active' : 'inactive'}
              className={cn('settings-accent-chip', isCustom ? 'ring-2 scale-110' : '')}
              title={customColorLabel}
            >
              {isCustom ? (
                <span className="settings-accent-swatch" style={{ backgroundColor: accentColor }} />
              ) : (
                <span className="settings-accent-chip-symbol">+</span>
              )}
            </button>
            <input
              ref={customAccentInputRef}
              type="color"
              value={getAccentHexForColor(accentColor)}
              onChange={(event) => onAccentColorChange(event.target.value)}
              className="sr-only"
              tabIndex={-1}
              aria-label={customColorLabel}
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-4">
          <span className="text-sm font-medium text-foreground">{t('settings.language')}</span>
          <div className="settings-segmented-row">
            {(['en', 'ru'] as const).map((nextLanguage) => (
              <button
                type="button"
                key={nextLanguage}
                onClick={() => onLanguageChange(nextLanguage)}
                aria-pressed={language === nextLanguage}
                data-state={language === nextLanguage ? 'active' : 'inactive'}
                className="settings-segmented-option"
              >
                {nextLanguage === 'en' ? 'English' : 'Русский'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface AppearanceSurfaceColorsProps {
  baseColors: ThemeColors | undefined;
  colors: ThemeColors | undefined;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  onReset: () => void;
  t: Translate;
}

const COLOR_CONTROLS: ReadonlyArray<{
  fallback: string;
  key: keyof ThemeColors;
  localeKey: string;
  placeholder: string;
}> = [
  { key: 'background', localeKey: 'settings.background_color', fallback: 'Window background', placeholder: '#ffffff' },
  { key: 'card', localeKey: 'settings.card_color', fallback: 'Block background', placeholder: '#ffffff' },
  { key: 'textMain', localeKey: 'settings.text_main', fallback: 'Main text', placeholder: '#000000' },
  { key: 'textSecondary', localeKey: 'settings.text_secondary', fallback: 'Captions', placeholder: '#71717a' },
  { key: 'border', localeKey: 'settings.border_color', fallback: 'Borders', placeholder: '#e4e4e7' },
  { key: 'error', localeKey: 'settings.error_color', fallback: 'Errors', placeholder: '#ef4444' },
];

export function AppearanceSurfaceColors({ baseColors, colors, onColorChange, onReset, t }: AppearanceSurfaceColorsProps) {
  const colorControlId = useId();
  const effectiveColors = {
    background: colors?.background || baseColors?.background || '#ffffff',
    card: colors?.card || baseColors?.card || '#ffffff',
    textMain: colors?.textMain || baseColors?.textMain || '#000000',
    textSecondary: colors?.textSecondary || baseColors?.textSecondary || '#71717a',
    border: colors?.border || baseColors?.border || '#e4e4e7',
    error: colors?.error || baseColors?.error || '#ef4444',
  };
  const hasOverrides = Boolean(colors && Object.values(colors).some(Boolean));

  return (
    <CollapsibleSection title={t('settings.advanced_appearance') || 'Custom colors'} defaultExpanded={false}>
      <div className="space-y-4">
        <p className="settings-embedded-copy">{t('settings.advanced_appearance_scope_desc')}</p>
        <div
          aria-label={t('settings.advanced_appearance') || 'Custom colors'}
          className="overflow-hidden rounded-lg border text-sm"
          data-testid="appearance-surface-preview"
          style={{ backgroundColor: effectiveColors.background, borderColor: effectiveColors.border }}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2"
            style={{ backgroundColor: effectiveColors.card, borderColor: effectiveColors.border }}
          >
            <span className="font-medium" style={{ color: effectiveColors.textMain }}>
              {t('settings.color_preview_title') || 'Sample heading'}
            </span>
            <span className="text-xs" style={{ color: effectiveColors.textSecondary }}>
              {t('settings.color_preview_caption') || 'Caption'}
            </span>
          </div>
          <div className="m-3 rounded-md border p-3" style={{ backgroundColor: effectiveColors.card, borderColor: effectiveColors.border }}>
            <span className="mb-1 block font-medium" style={{ color: effectiveColors.textMain }}>
              {t('settings.color_preview_title') || 'Sample heading'}
            </span>
            <span className="mb-3 block text-xs" style={{ color: effectiveColors.textSecondary }}>
              {t('settings.color_preview_caption') || 'Caption'}
            </span>
            <span className="block text-xs font-medium" style={{ color: effectiveColors.error }}>
              {t('settings.color_preview_error') || 'Example error'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {COLOR_CONTROLS.map((control) => {
            const label = t(control.localeKey) || control.fallback;
            const inputId = `${colorControlId}-${control.key}`;
            return (
              <div key={control.key} className="space-y-2">
                <label htmlFor={inputId} className="text-xs font-medium uppercase text-secondary">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    id={inputId}
                    type="color"
                    aria-label={label}
                    value={effectiveColors[control.key]}
                    onChange={(event) => onColorChange(control.key, event.target.value)}
                    className="h-11 w-11 cursor-pointer rounded-md border border-border/70 bg-transparent p-1"
                  />
                  <span className="text-xs text-secondary">
                    {colors?.[control.key] || t('settings.default_value') || 'Default'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {hasOverrides && (
          <button type="button" className="text-sm font-medium text-secondary underline-offset-4 hover:underline" onClick={onReset}>
            {t('settings.reset_custom_theme') || 'Reset Custom Theme'}
          </button>
        )}
      </div>
    </CollapsibleSection>
  );
}
