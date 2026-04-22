---
phase: 36-settings-predictability-and-shared-control-contract
plan: "02"
subsystem: ui
tags:
  - react
  - settings
  - theming
  - vitest
  - i18n
requires:
  - phase: 36-01
    provides:
      - compact settings shell chrome and summary-copy ownership
provides:
  - visible preset runtime contract for family, mode, and customized state
  - predictable preset-family switching that preserves an already chosen mode
  - product-facing preset reset and ancestry seams in appearance tests
affects:
  - 36-03
  - 36-04
  - settings-appearance closeout
tech-stack:
  added: []
  patterns:
    - derive presentation-state from normalized appearance state in SettingsContext
    - name reset targets with the exact preset-plus-mode summary shown in the UI
key-files:
  created: []
  modified:
    - src/contexts/SettingsContext.tsx
    - src/contexts/settings/theme.ts
    - src/contexts/settings/theme-presets.ts
    - src/components/settings/tabs/AppearanceTab.tsx
    - src/components/settings/__tests__/AppearanceTab.presets.test.tsx
    - src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx
    - src/contexts/settings/__tests__/themeRuntimeContract.test.ts
    - src/contexts/settings/__tests__/themeDocument.test.ts
    - src/locales/en.json
    - src/locales/ru.json
key-decisions:
  - "Switching between preset families now preserves the currently chosen light or dark mode once a preset is already active."
  - "Appearance exposes one preset runtime summary card instead of splitting preset ancestry and reset semantics across separate hints."
patterns-established:
  - "Theme runtime contract: preset family, current mode, and runtime state are derived once in SettingsContext and rendered as product copy."
  - "Preset reset wording should name the exact target runtime rather than describing internal override clearing."
requirements-completed:
  - SETTINGS-06
  - SETTINGS-08
duration: 13min
completed: 2026-04-22
---

# Phase 36 Plan 02: Preset Predictability Summary

**Appearance now exposes a visible preset runtime contract with stable family switching, explicit mode ancestry, and reset copy that names the exact preset target**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-22T17:39:00Z
- **Completed:** 2026-04-22T17:52:20Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Added a derived theme runtime state in `SettingsContext` so the appearance surface can show preset family, current mode, and customized state from one normalized source of truth.
- Reworked `AppearanceTab` to explain preset behavior directly: mode switches are scoped to the selected preset, the runtime summary card stays visible, and reset copy now names the exact preset-plus-mode target.
- Extended preset tests to lock the user-facing seams around family switching, reset semantics, customized ancestry, and adjacent mocked appearance surfaces.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define one visible preset-plus-mode contract on the appearance surface** - `fcca711` (feat)
2. **Task 2: Extend preset tests so reset, ancestry, and predictable mode behavior are locked before closeout** - `010bc0d` (test)

## Files Created/Modified

- `src/contexts/SettingsContext.tsx` - derives and exposes the runtime preset state and preserves the chosen mode when switching preset families.
- `src/contexts/settings/theme.ts` - adds reusable runtime-state helpers for customization scope and preset-default mode detection.
- `src/contexts/settings/theme-presets.ts` - centralizes translated mode labels for preset summaries.
- `src/components/settings/tabs/AppearanceTab.tsx` - renders the visible preset runtime contract and dynamic reset target copy.
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx` - covers preset family switching, runtime-state labels, and bounded override ancestry.
- `src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx` - asserts reset copy and runtime-state transitions stay product-readable.
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts` - locks the context-level mode-preservation contract for preset-family changes.
- `src/contexts/settings/__tests__/themeDocument.test.ts` - verifies bounded overrides retain preset-derived document tokens.
- `src/locales/en.json`, `src/locales/ru.json` - add runtime-contract and reset-target copy for the appearance surface.

## Decisions Made

- Preset-family changes keep the active mode once the user is already inside a preset family, which removes hidden light/dark jumps while keeping the same normalized storage model.
- The appearance panel now treats preset readability as a first-class surface contract, so reset and ancestry copy lives next to the runtime summary instead of in scattered badge-only hints.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated adjacent mocked appearance tests for the new runtime-state dependency**
- **Found during:** Task 2 (Extend preset tests so reset, ancestry, and predictable mode behavior are locked before closeout)
- **Issue:** `AppearanceTab` now reads `themeRuntimeState`, so nearby mock-based tests would crash unless their fake settings payloads were updated.
- **Fix:** Added `themeRuntimeState` to the mocked `useSettings` fixtures in `AppearanceTab.i18n.test.tsx` and `AppearanceTab.background-controls.test.tsx`.
- **Files modified:** `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`, `src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx`
- **Verification:** Expanded `vitest` run covering both adjacent tests plus the plan-owned preset/runtime suite passed.
- **Committed in:** `010bc0d` (part of task commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The deviation was required to keep the local appearance test seam coherent after the new runtime-state contract landed. No scope creep.

## Issues Encountered

- The plan’s exact ESLint command reports two warnings because `src/locales/en.json` and `src/locales/ru.json` are ignored by the current ESLint config. Source-file linting completed without errors or warnings when rerun with `--no-warn-ignored`.
- A live browser-based manual appearance pass was not rerun in this turn. `workflow.auto_advance` is enabled, so the closeout relies on the product-facing preset tests added here rather than a fresh interactive walkthrough.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase `36-03` can now build shared control geometry on top of a stable, visible preset contract instead of inferring runtime ancestry from internal state.
- Phase `36-04` can update proof wording against the new runtime summary and reset semantics without needing further theme-state changes.

## Self-Check: PASSED

- Found `.planning/phases/36-settings-predictability-and-shared-control-contract/36-02-SUMMARY.md`
- Found task commits `fcca711` and `010bc0d` in git history

---
*Phase: 36-settings-predictability-and-shared-control-contract*
*Completed: 2026-04-22*
