---
phase: 12-theme-truth-and-settings-ia-simplification
plan: "01"
subsystem: ui
tags: [react, theming, settings, vitest]
requires:
  - phase: 11-adaptive-layout-and-interaction-foundations
    provides: shared shell and document theme seams that Phase 12 can harden without reopening layout work
provides:
  - persisted preset identities instead of preset colors being stored as ad-hoc custom theme state
  - preset-aware light and dark runtime variants that repaint the launcher token contract immediately
  - regression coverage for preset selection, legacy preset migration, and preset mode switching
affects: [12-02 contrast cleanup, 12-03 settings IA simplification, 12-04 phase verification]
tech-stack:
  added: []
  patterns: [preset identity + resolved runtime theme config, preset migration from legacy localStorage state]
key-files:
  created: [src/components/settings/__tests__/AppearanceTab.presets.test.tsx]
  modified:
    - src/contexts/settings/theme-presets.ts
    - src/contexts/settings/theme.ts
    - src/contexts/SettingsContext.tsx
    - src/contexts/settings/types.ts
    - src/components/settings/tabs/AppearanceTab.tsx
    - src/contexts/settings/__tests__/themeDocument.test.ts
    - src/components/settings/__tests__/AppearanceTab.i18n.test.tsx
key-decisions:
  - "Persist preset identity separately from custom theme overrides and infer it once from legacy preset-shaped storage for brownfield compatibility."
  - "Resolve and apply the full document token contract from the active preset mode instead of partially overriding a few CSS variables."
patterns-established:
  - "Preset truth: renderer theme state flows through themePresetId + theme mode, not through copied preset colors in customTheme."
  - "Theme application: document tokens are fully set from resolved runtime theme config so presets repaint immediately and predictably."
requirements-completed: [THEME-01]
duration: 9min
completed: 2026-04-13
---

# Phase 12 Plan 01: Theme Truth Summary

**Preset themes now resolve through persisted preset identity plus mode-specific runtime variants, so FMCL repaints the live launcher immediately instead of drifting through partial custom-theme writes**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-13T14:18:24Z
- **Completed:** 2026-04-13T14:26:56Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Replaced one-off preset writes with a persisted `themePresetId` and a resolved runtime theme config in `SettingsContext`.
- Expanded theme application to set the full document token contract, including overlay, muted text, and active-border tokens derived from the active preset or theme mode.
- Added regression coverage for preset selection, brownfield migration from legacy preset-shaped storage, and preset-driven light or dark mode repainting.

## Task Commits

Each task was committed atomically:

1. **Task 1: Establish a truthful preset source of truth** - `e04b424` (feat)
2. **Task 2: Rewire the appearance preset controls and lock the contract with tests** - `fa72e87` (test)

## Files Created/Modified
- `src/contexts/settings/theme-presets.ts` - Defines stable preset identities with light and dark runtime variants and legacy preset inference.
- `src/contexts/settings/theme.ts` - Resolves preset-aware theme config and applies the full launcher document token contract.
- `src/contexts/SettingsContext.tsx` - Persists preset identity, migrates legacy preset-shaped storage, and exposes preset application through the settings seam.
- `src/contexts/settings/types.ts` - Adds typed preset identifiers for the new settings contract.
- `src/components/settings/tabs/AppearanceTab.tsx` - Uses the persisted preset contract, exports the active runtime theme, and shows the active preset plus mode honestly.
- `src/contexts/settings/__tests__/themeDocument.test.ts` - Verifies full token application and preset light or dark variant resolution.
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx` - Covers preset selection, mode switching, and legacy preset migration through the real provider seam.
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx` - Keeps the appearance mock aligned with the expanded settings contract.

## Decisions Made
- Persist preset identity as separate settings state so presets survive mode changes without copying their colors into `customTheme`.
- Infer a preset ID once from legacy preset-shaped `settings_customTheme` values and clear the copied color payload afterward so brownfield users land on the new truthful contract automatically.
- Treat the theme document seam as a full token surface and always set the live CSS variables explicitly from the resolved runtime theme config.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `12-02` can now focus on contrast and readability cleanup on top of a stable preset runtime seam.
- `12-03` can simplify settings IA without reopening how theme state is persisted or applied.

## Self-Check: PASSED

- FOUND: `.planning/phases/12-theme-truth-and-settings-ia-simplification/12-01-SUMMARY.md`
- FOUND: `e04b424`
- FOUND: `fa72e87`

---
*Phase: 12-theme-truth-and-settings-ia-simplification*
*Completed: 2026-04-13*
