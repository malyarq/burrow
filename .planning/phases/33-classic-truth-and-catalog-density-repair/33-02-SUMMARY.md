---
phase: 33-classic-truth-and-catalog-density-repair
plan: "02"
subsystem: ui
tags: [react, typescript, vitest, tailwind, modpacks]
requires: []
provides:
  - compact catalog headers inside the shared modpack controls shell
  - removal of installed and remote top-level catalog summary chatter
  - regression seams for compact action clusters in installed and remote catalogs
affects: [modpacks, catalog-density, manual-verification]
tech-stack:
  added: []
  patterns:
    - shared compact catalog headers rendered inside ModpackCatalogControls
    - actionable history chips kept in footer while summary counts stay out of the first viewport
key-files:
  created:
    - .planning/phases/33-classic-truth-and-catalog-density-repair/33-02-SUMMARY.md
  modified:
    - src/components/modpacks/ModpackCatalogControls.tsx
    - src/components/modpacks/ModpackList.tsx
    - src/components/modpacks/ModpackBrowser.tsx
    - src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx
    - src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx
    - src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx
key-decisions:
  - "Moved installed and remote catalog header actions into the shared controls shell instead of keeping separate hero-style wrappers."
  - "Removed result-count and active-pack status copy from the first viewport while keeping active filter chips and actionable recent-history chips."
  - "Did not create task commits because ModpackList.tsx and ModpackList.ergonomics.test.tsx already contained baseline edits before execution, making atomic staging unsafe."
patterns-established:
  - "Catalog shell density: header title, provider state, and top-level actions should live in the same muted controls surface as search and filters."
  - "Catalog proof seams should reject summary counters in the controls shell and assert the compact header/action clusters directly."
requirements-completed: [MODPACK-08]
duration: 10min
completed: 2026-04-22
---

# Phase 33 Plan 02: Catalog Shell Density Summary

**Installed and remote modpack catalogs now open on compact shared control shells with inline header actions and no top-level summary counters competing above the grid**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-22T10:38:00Z
- **Completed:** 2026-04-22T10:48:08Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Removed the installed modpack hero header and moved its title plus `Import from Code`, `Create`, and `Browse modpacks` actions into the shared controls surface.
- Replaced the remote browser's tall top strip with a minimal back bar plus a compact controls header that keeps provider state and import/history actions beside the filters.
- Tightened the ergonomics tests so they fail if summary counters return or if the compact header/action clusters disappear from the shared catalog shell.

## Task Commits

No task commits were created.

- Atomic task commits were unsafe on this dirty baseline because `src/components/modpacks/ModpackList.tsx` and `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` already had local modifications before plan execution.
- Staging either file wholesale would have mixed pre-existing work with this plan's changes.

## Files Created/Modified
- `src/components/modpacks/ModpackCatalogControls.tsx` - added an optional compact header slot for shared catalog shells.
- `src/components/modpacks/ModpackList.tsx` - collapsed the installed catalog hero into the shared controls surface and removed installed summary chatter.
- `src/components/modpacks/ModpackBrowser.tsx` - removed remote result/status chatter from the first viewport and moved remote header actions into the compact controls shell.
- `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx` - added assertions for compact header/action clusters and the absence of summary counters.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - encoded the installed compact shell contract and preserved the content-artwork fallback assertion.
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` - encoded the remote compact shell contract and rejected returning result summaries in the first viewport.
- `.planning/phases/33-classic-truth-and-catalog-density-repair/33-02-SUMMARY.md` - execution summary for this plan.

## Decisions Made

- Put installed and remote catalog action clusters inside `ModpackCatalogControls` instead of keeping separate summary-heavy header shells.
- Kept active filter chips and recent-history chips because they directly influence user choice, but removed passive result-count and active-pack summary text from the controls shell.
- Left shared planning files untouched per wave-execution constraints; only the plan summary was created.

## Deviations from Plan

None - plan executed as specified.

## Issues Encountered

- Commit safety issue: `src/components/modpacks/ModpackList.tsx` and `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` were already dirty at execution start. The code changes were applied safely on top of that baseline, but no atomic commit was created to avoid capturing unrelated or parallel work.
- Manual visual catalog-shell verification was not run in this turn; automated lint, typecheck, and Vitest coverage for the plan passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan `33-03` can now build on a smaller, shared catalog shell without re-litigating top-level summary clutter.
- A manual desktop-width walkthrough is still worth doing before claiming full product signoff on the compactness of the installed and remote catalog headers.

## Self-Check: PASSED

- Summary file created at `.planning/phases/33-classic-truth-and-catalog-density-repair/33-02-SUMMARY.md`
- Plan verification commands passed:
  - `npx vitest run src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
  - `npx eslint src/components/modpacks/ModpackCatalogControls.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx`
  - `npx tsc --noEmit`

