---
status: diagnosed
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Preset families and their light/dark variants should carry palette-appropriate base accent behavior rather than feeling visually identical unless the user overrides accent manually."
created: 2026-04-22T19:06:59Z
updated: 2026-04-22T19:08:37Z
---

## Current Focus

hypothesis: confirmed; preset family and mode do not own base accent selection
test: completed by tracing preset data model, state transitions, and document token application
expecting: n/a
next_action: report concrete root cause and affected files

## Symptoms

expected: preset families and their light/dark variants should provide palette-appropriate base accent behavior
actual: themes feel visually identical in accent behavior unless the user overrides accent manually
errors: none reported
reproduction: open Appearance settings, switch across preset families and light/dark variants, observe that base accent behavior does not track palette unless custom accent is chosen
started: reported during Phase 36 UAT on 2026-04-22

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:08:06Z
  checked: src/contexts/settings/theme-presets.ts
  found: every preset defines light/dark `colors` and optional `brand` tokens, but no accent field or palette-default accent token exists in the preset model
  implication: preset families can change surfaces and brand glow, but they have no data path to provide a family-specific base accent

- timestamp: 2026-04-22T19:08:06Z
  checked: src/contexts/SettingsContext.tsx
  found: `applyThemePreset` resets `customTheme`, updates `theme` and `themePresetId`, and deliberately leaves `accentColor` untouched; `setTheme` also only updates `theme`
  implication: switching preset families or light/dark variants preserves the previously stored accent instead of deriving one from the active preset runtime

- timestamp: 2026-04-22T19:08:06Z
  checked: src/contexts/settings/theme.ts and src/contexts/settings/accent.ts
  found: `applyThemeToDocument(theme, accentColor, activeThemeConfig)` computes `--accent-main` and `--accent-hover` exclusively from `accentColor`, while preset runtime config only feeds background/text/border/brand tokens
  implication: visible accent behavior is identical across presets whenever `accentColor` is unchanged, which matches the UAT report

## Resolution

root_cause:
Preset families only define surface and brand tokens, while accent stays in a separate global `accentColor` state that `applyThemePreset` and `setTheme` never update. `applyThemeToDocument` always computes `--accent-main`/`--accent-hover` from that standalone accent value, so all preset families and their light/dark variants inherit the same accent unless the user manually changes it.
fix:
verification:
files_changed: []
