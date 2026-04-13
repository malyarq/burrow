---
phase: 08-core-route-rollout-and-ui-correctness
plan: "03"
subsystem: ui-modpacks
tags: [react, modpacks, localization, vitest, route-truth]
requires:
  - phase: 07-ui-system-foundations
    provides: shared surfaces, shared action language, and theme-correct primitives
  - phase: 08-core-route-rollout-and-ui-correctness
    provides: truthful entry flow plus aligned settings/accounts routes
provides:
  - coherent list, browser, details, install, export, and add-mod modpack routes
  - truthful modpack actions and route labels instead of misleading settings/play affordances
  - EN and RU coverage for touched modpack route copy plus regression tests for route seams
affects: [modpacks-list, modpack-browser, modpack-details, modpack-install, modpack-export, add-mod-modal, localization]
tech-stack:
  added: []
  patterns: [truthful-route-actions, modpack-route-surface-contract, locale-and-test-lockstep]
key-files:
  created: [src/components/modpacks/__tests__/ModpackList.actions.test.tsx, src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx, src/components/modpacks/__tests__/ExportModpackPage.i18n.test.tsx, src/components/modpacks/__tests__/AddModModal.i18n.test.tsx]
  modified: [src/components/modpacks/ModpackList.tsx, src/components/modpacks/ModpackBrowser.tsx, src/components/modpacks/ModpackDetails.tsx, src/components/modpacks/details/ModpackDetailsHeader.tsx, src/components/modpacks/details/ModpackDetailsActions.tsx, src/components/modpacks/InstallModpackPage.tsx, src/components/modpacks/ExportModpackPage.tsx, src/components/modpacks/AddModModal.tsx, src/locales/en.json, src/locales/ru.json, src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx, src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx, src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx]
key-decisions:
  - "Reframed installed-modpack secondary actions around explicit details management instead of keeping a misleading settings/play split between cards and details."
  - "Treated export and add-mod route copy as part of route truth, including fixing the default export filename seam when metadata arrives after the desktop path."
patterns-established:
  - "Refreshed modpack routes should reuse the same back-header, card, footer, and action grammar so list, browser, install, and detail surfaces read as one workflow."
  - "Touched route copy should land together with route-seam tests, so missing locale keys and misleading action names cannot regress silently."
requirements-completed: [DSYS-03, LOCL-01, UX-02]
duration: 27min
completed: 2026-04-13
---

# Phase 8 Plan 03: Core Route Rollout And UI Correctness Summary

**FMCL's core modpack routes now behave and read like one coherent workflow instead of stitched-together legacy modules**

## Performance

- **Duration:** 27 min
- **Started:** 2026-04-13T09:34:00+03:00
- **Completed:** 2026-04-13T10:01:15+03:00
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Aligned the modpack list, browser, details header, install, export, and add-mod seams onto the shared Phase 7 surface and action contract.
- Removed misleading route language such as settings-style labels for details actions and replaced remaining raw or placeholder copy on touched EN and RU modpack screens.
- Added focused regression coverage for contextual modpack actions, details-header translations, export localization, add-mod localization, and updated browser/list accessibility seams.

## Task Commits

1. **Task 1: Roll the core modpack routes onto one shared route language and action contract** - `1d5742d` (`fix(08-03): align modpack route language`)
2. **Task 2: Close core modpack localization gaps and prove the refreshed route seams** - `c0be0c1` (`test(08-03): cover modpack route truth`)

## Files Created/Modified

- `src/components/modpacks/ModpackList.tsx` - truthful details/action labels, shared token styling, and cleaner installed-card action hierarchy
- `src/components/modpacks/ModpackBrowser.tsx` - shared header/filter/result treatments, icon-based affordances, and consistent history or favorite presentation
- `src/components/modpacks/ModpackDetails.tsx`, `details/ModpackDetailsHeader.tsx`, and `details/ModpackDetailsActions.tsx` - details-route title truth plus shared-system header and footer structure
- `src/components/modpacks/InstallModpackPage.tsx`, `ExportModpackPage.tsx`, and `AddModModal.tsx` - shared workflow chrome, localized export/add-mod copy, and a fixed metadata-aware export default filename seam
- `src/locales/en.json` and `src/locales/ru.json` - touched modpack route labels, tab titles, export option copy, add-mod titles, and provider-state text
- `src/components/modpacks/__tests__/*` - route-level truth coverage for browser, list actions, details-header translations, export copy, and add-mod modal copy

## Decisions Made

- Kept Phase 8 scoped to the named core modpack routes and did not reopen secondary content-management polish that belongs in Phase 9.
- Used route-focused tests to lock visible copy and action truth at the seams where users actually switch between list, browser, install, export, and add-mod flows.

## Deviations from Plan

None.

## Issues Encountered

- The refreshed export route exposed a real seam bug: the default output path was computed before modpack metadata finished loading, so the filename could stay stuck on `modpack.zip`; the fix was to track the last auto-generated path and refresh it when metadata-driven defaults become available.
- The details-header tests surfaced that the screenshots tab still lacked a real locale key, so `modpacks.tab_screenshots` was added in both EN and RU instead of relying on inline fallbacks.

## User Setup Required

None.

## Next Phase Readiness

- `08-04` can now run the integrated route suite against a consistent entry, settings/accounts, and core modpack flow set.
- The remaining Phase 8 work is fallout-only gate and live sanity evidence, not more modpack-surface redesign.

---
*Phase: 08-core-route-rollout-and-ui-correctness*
*Completed: 2026-04-13*
