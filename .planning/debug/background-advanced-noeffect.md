---
status: investigating
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Background effects and advanced color controls should have visible product impact wherever settings claims they apply. Severity: major. Test: 2. User report: Фоновые эффекты нигде не видны. Настройки цветов в расширенных тоже не дают результата, хотя сохранились."
created: 2026-04-22T19:10:00Z
updated: 2026-04-22T19:18:00Z
---

## Current Focus

hypothesis: The settings do persist, but visible-effect wiring stops at document tokens and one hidden backdrop consumer: background effects only feed BackgroundLayer, and that layer sits behind opaque shell/modal surfaces, while advanced colors mostly update shared CSS vars without a dedicated visible preview seam.
test: Confirm that persistence/runtime config is correct, then trace all consumers of activeThemeConfig.background and document color vars through AppLayout and the settings modal shell.
expecting: If true, the code will show valid saved state and root vars but no foreground surface where background/media changes can actually be seen during the settings workflow.
next_action: document the consumer chain and verify whether any visible shell surface directly exposes background effects or advanced-color deltas

## Symptoms

expected: Background effects and advanced color controls should have visible product impact wherever settings claims they apply.
actual: Background effects are not visible anywhere, and advanced color settings produce no visible result even though the values persist.
errors: none reported
reproduction: Open Settings -> Appearance, change background effects and advanced colors, save/apply automatically, then inspect launcher UI surfaces for visible changes.
started: reported during Phase 36 UAT on 2026-04-22; unclear whether the gap ever worked in the current redesign

## Eliminated

- hypothesis: Settings are not being saved or applied into runtime state.
  evidence: AppearanceTab writes advanced/background values into customTheme, SettingsContext resolves activeThemeConfig from appearanceState, and theme tests assert updated root CSS vars for bounded overrides.
  timestamp: 2026-04-22T19:18:00Z

## Evidence

- timestamp: 2026-04-22T19:14:00Z
  checked: src/components/settings/tabs/AppearanceTab.tsx
  found: Advanced Appearance writes into customTheme.colors, and Background Effects writes into customTheme.background via setCustomTheme/updateBackground.
  implication: The settings UI does produce persisted theme override data; the break is downstream from control entry.

- timestamp: 2026-04-22T19:15:00Z
  checked: src/contexts/SettingsContext.tsx and src/contexts/settings/theme.ts
  found: appearanceState is normalized into activeThemeConfig, then applyThemeToDocument(theme, accentColor, activeThemeConfig) updates document CSS vars from the resolved runtime theme.
  implication: Saved advanced color overrides do reach runtime theme resolution and document-level tokens.

- timestamp: 2026-04-22T19:16:00Z
  checked: src/components/layout/BackgroundLayer.tsx and rg search for activeThemeConfig.background consumers
  found: BackgroundLayer is the only runtime consumer of activeThemeConfig.background.
  implication: If BackgroundLayer is not visibly exposed, background settings have nowhere else to surface in product UI.

- timestamp: 2026-04-22T19:18:00Z
  checked: src/components/layout/BackgroundLayer.tsx, src/components/AppLayout.tsx, src/components/SettingsPage.tsx, src/components/ui/Modal.tsx, src/index.css
  found: BackgroundLayer renders fixed full-screen layers at -z-10, while AppLayout paints the main content area with solid bg-background and Settings opens behind a bg-background/70 modal scrim plus bg-card/88-92 panels.
  implication: The only background-effects consumer is physically buried behind opaque or near-opaque shell surfaces during the workflow where the user evaluates the setting, so background/media changes are effectively invisible.

- timestamp: 2026-04-22T19:18:00Z
  checked: src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx, src/contexts/settings/__tests__/themeDocument.test.ts, src/verification/manual/__tests__/appearanceProof.test.tsx
  found: Phase 36 tests verify control presence, root CSS variable updates, and proof wording, but not that a live renderer surface actually shows background effects or advanced-color impact.
  implication: The implementation could ship with correct state/token plumbing while still failing the real visible-product requirement.
## Resolution

root_cause: Background effects are wired only to BackgroundLayer, and that layer is rendered behind opaque shell and settings-modal surfaces, while advanced appearance changes stop at document color tokens without a guaranteed visible preview seam. The code therefore persists the values but never exposes a clear live surface where the user can actually see those settings take effect.
fix:
verification:
files_changed: []
