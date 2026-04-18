---
phase: 22-theme-truth-and-interaction-state-fidelity
plan: "01"
subsystem: ui
tags: [react, typescript, theme, locale, vitest, settings]
requires:
  - phase: 12-theme-truth-and-settings-ia-simplification
    provides: preset identity and mode-aware theme application baseline for the launcher shell
  - phase: 20-brand-system-shared-tokens-and-surface-migration
    provides: document-level brand and theme token ownership through the existing theme pipeline
provides:
  - locale-bound formatting helpers on the FMCL settings runtime seam
  - stable preset identity recovery when preset-shaped theme payloads round-trip through storage or import flows
  - distinct accent hover tokens instead of reusing accent-main for every state
affects: [22, settings, theme, locale, verification]
tech-stack:
  added: []
  patterns: [settings runtime owns locale formatting, preset identity is recovered from preset-shaped theme payloads, accent hover token derives from accent identity]
key-files:
  created: [src/contexts/settings/__tests__/themeRuntimeContract.test.ts]
  modified: [src/contexts/SettingsContext.tsx, src/contexts/settings/persistence.ts, src/contexts/settings/i18n.ts, src/contexts/settings/accent.ts, src/contexts/settings/theme.ts, src/utils/format.ts, src/contexts/settings/__tests__/themeDocument.test.ts, src/components/settings/__tests__/AppearanceTab.presets.test.tsx, src/utils/__tests__/format.test.ts]
key-decisions:
  - "Stopped serializing a cleared preset id as an empty string so preset-shaped imports and legacy storage can re-infer a stable `themePresetId` instead of getting stuck in anonymous custom-theme state."
  - "Bound locale-aware date and number formatting to `SettingsContext` so later Phase 22 route work can consume one app-language contract instead of ambient browser locale defaults."
  - "Derived `--accent-hover` from accent identity rather than duplicating `--accent-main`, giving later state-fidelity work one truthful hover token to build on."
patterns-established:
  - "Theme runtime truth should flow through SettingsContext helpers instead of route-local locale and preset inference logic."
  - "Preset round-trip recovery should use missing-key semantics, not persisted empty-string placeholders."
requirements-completed: [THEME-02, THEME-03, THEME-04]
duration: 9 min
completed: 2026-04-18
---

# Phase 22 Plan 01: Theme Runtime Truth Summary

**Theme runtime now owns preset identity recovery, locale-bound formatting helpers, and a distinct accent-hover token instead of leaking those decisions to browser defaults or empty preset storage**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-18T11:47:00+03:00
- **Completed:** 2026-04-18T11:56:18+03:00
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Reworked settings persistence and runtime theme plumbing so cleared preset ids remove their storage key, legacy empty-string preset storage no longer blocks inference, and preset-shaped imports can recover a stable `themePresetId`.
- Added locale-aware formatting helpers to the settings runtime seam and supporting utility functions so Phase 22 route work can format dates and numbers from the active FMCL language contract.
- Added focused regression coverage for the new truth layer, including preset round-trip recovery, locale-bound formatting, and non-duplicated accent hover tokens.

## Task Commits

Each task was committed atomically:

1. **Task 1: Repair the runtime source of truth for tokens, accent derivation, preset identity, and locale formatting** - `ca8d9ed` (fix)
2. **Task 2: Add truth-layer regression coverage for preset round-trip, accent contract, and app-locale formatting** - `238ca60` (test)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `src/contexts/SettingsContext.tsx` - Exposes locale-bound `formatDate` and `formatNumber` helpers, removes empty preset-id persistence, and normalizes legacy empty preset storage before inference.
- `src/contexts/settings/persistence.ts` - Allows storage setters to remove keys instead of serializing placeholder empty strings.
- `src/contexts/settings/i18n.ts` - Defines the stable language-to-locale contract used by the renderer.
- `src/contexts/settings/accent.ts` - Adds a real hover accent token and custom-accent hover derivation.
- `src/contexts/settings/theme.ts` - Applies the distinct hover accent token to document state.
- `src/utils/format.ts` - Adds locale-aware date and number formatting helpers.
- `src/contexts/settings/__tests__/themeDocument.test.ts` - Locks the updated accent hover token contract.
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts` - Verifies preset recovery from legacy empty storage and locale-bound formatting from settings runtime.
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx` - Covers preset restoration when importing an exported preset payload.
- `src/utils/__tests__/format.test.ts` - Covers locale-aware date and number formatting helpers.

## Decisions Made
- Used missing-key semantics for `settings_themePresetId` so preset inference can recover after imports and legacy storage instead of being blocked by an empty string sentinel.
- Exposed locale-aware formatting through `SettingsContext` rather than adding new route-local helpers, keeping the app-language contract centralized for later waves.
- Kept the hover accent derivation in the shared accent/theme seam so later control-state work can reuse one truthful token instead of duplicating color math per surface.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The first version of `themeRuntimeContract.test.ts` used JSX inside a `.ts` file, which broke transform and typecheck. I converted the test to `React.createElement` instead of renaming the file, keeping the write set stable and the planned verification matrix unchanged.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `22-02` can now consume a real hover token plus locale-bound formatters from `SettingsContext` instead of inventing local state logic in settings surfaces.
- `22-03` can move route-level dates, numbers, and selected-state styling onto the truth layer without reopening preset persistence or import semantics.

## Self-Check
PASSED

- Found `.planning/phases/22-theme-truth-and-interaction-state-fidelity/22-01-SUMMARY.md`
- Found task commit `ca8d9ed`
- Found task commit `238ca60`

---
*Phase: 22-theme-truth-and-interaction-state-fidelity*
*Completed: 2026-04-18*
