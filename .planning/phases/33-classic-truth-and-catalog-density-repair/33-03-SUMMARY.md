---
phase: 33-classic-truth-and-catalog-density-repair
plan: "03"
subsystem: ui
tags: [react, typescript, vitest, tailwind, modpacks]
requires:
  - phase: 33-classic-truth-and-catalog-density-repair
    provides: compact installed and remote catalog shells from plan 33-02
provides:
  - calmer installed and remote modpack cards with only inline high-value summary facts
  - explicit catalog-primary button geometry shared by catalog headers and card actions
  - dedicated regression coverage for action geometry and reduced card metadata
affects: [modpacks, catalog-density, card-actions, MODPACK-09, MODPACK-10]
tech-stack:
  added: []
  patterns:
    - catalog cards should show only title plus minimal inline facts before details
    - catalog action clusters should opt into an explicit Button geometry seam instead of per-surface class drift
key-files:
  created:
    - .planning/phases/33-classic-truth-and-catalog-density-repair/33-03-SUMMARY.md
    - src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx
  modified:
    - src/components/ui/Button.tsx
    - src/components/modpacks/ModpackList.tsx
    - src/components/modpacks/ModpackBrowser.tsx
    - src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx
    - src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx
    - src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx
key-decisions:
  - "Removed card-level source badges and boxed metadata tiles so installed and remote cards read as one calmer summary family."
  - "Added an explicit `geometry=\"catalog-primary\"` seam to `Button` so catalog CTA height, padding, wrapping, and icon scale are testable instead of implicit."
  - "Skipped per-task git commits because the plan-owned modpack files were already dirty in the shared wave baseline, making atomic staging unsafe without risking unrelated changes."
patterns-established:
  - "Catalog card density: show runtime version and update timing as inline facts, move lower-value state out of the badge stack."
  - "Catalog action contract: header CTAs and card actions should all carry the `catalog-primary` geometry marker."
requirements-completed: [MODPACK-09, MODPACK-10]
duration: 5min
completed: 2026-04-22
---

# Phase 33 Plan 03: Catalog Card Density And Action Contract Summary

**Installed and remote modpack cards now collapse to minimal inline facts while catalog CTAs share one explicit geometry contract across headers and cards**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-22T10:51:20Z
- **Completed:** 2026-04-22T10:56:24Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Removed card-level source chips, boxed metadata tiles, and the loud installed update badge treatment so cards stay scan-friendly with only runtime version and update context visible.
- Introduced `geometry="catalog-primary"` on the shared `Button` component and applied it to installed header CTAs, installed-card actions, browser header CTAs, and browser primary card actions.
- Added a dedicated `CatalogHeaderActions` regression seam and refreshed the density/ergonomics tests to reject returning provider/source clutter or drifting CTA geometry.

## Task Commits

No task commits were created.

- Atomic task commits were unsafe on this dirty baseline because `src/components/modpacks/ModpackList.tsx`, `src/components/modpacks/ModpackBrowser.tsx`, and the existing modpack ergonomics/density tests already contained wave-baseline edits before this plan executed.
- Staging those files wholesale would have mixed pre-existing work with the 33-03 changes, and this repo state was not safe for non-interactive hunk staging.

## Files Created/Modified
- `src/components/ui/Button.tsx` - adds the explicit `catalog-primary` geometry seam and data attribute used by the new regression test.
- `src/components/modpacks/ModpackList.tsx` - trims installed cards to inline facts, calms update state, and applies the shared CTA geometry to header/card actions.
- `src/components/modpacks/ModpackBrowser.tsx` - removes remote provider chips from cards, flattens metadata, adds the shared CTA geometry, and gives browser primary actions the same icon-bearing contract.
- `src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx` - locks catalog CTA geometry across installed and remote header/card action clusters.
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx` - proves dense catalog cards no longer regain provider/source clutter or removed summary text.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - asserts the installed catalog keeps the calmer card contract and subdued update indicator.
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` - asserts remote cards stay minimal while the browser controls/header shell remains compact.
- `.planning/phases/33-classic-truth-and-catalog-density-repair/33-03-SUMMARY.md` - execution summary for this plan.

## Decisions Made

- Used inline metadata rows instead of smaller boxed tiles because the complaint was about overall card heaviness, not just label count.
- Kept the installed update signal on-card, but downgraded it to plain secondary text so it remains useful without recreating a busy badge strip.
- Left `.planning/STATE.md`, `.planning/ROADMAP.md`, and other shared planning files untouched per the user’s phase-integration constraints.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed the obsolete installed-card source badge helper after card reduction**
- **Found during:** Task 1 implementation
- **Issue:** `ModpackList.tsx` still carried the old source-badge helper and memo dependency after source badges were removed from the installed card, leaving dead code behind the new card contract.
- **Fix:** Deleted the unused helper and narrowed the memo dependency to the remaining icon resolver.
- **Files modified:** `src/components/modpacks/ModpackList.tsx`
- **Verification:** `npx eslint src/components/ui/Button.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`; `npx tsc --noEmit`
- **Committed in:** not committed; left in working tree for commit safety

**2. [Rule 1 - Bug] Updated the density regression to match the removed installed summary text**
- **Found during:** Task 1 verification
- **Issue:** `ModpackCatalog.density.test.tsx` still expected the removed `Active:` header summary, so the test was asserting the old noisy shell instead of the new compact contract.
- **Fix:** Replaced that expectation with an explicit absence check and added assertions that provider/source labels stay out of the cards.
- **Files modified:** `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`
- **Verification:** `npx vitest run src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- **Committed in:** not committed; left in working tree for commit safety

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were direct fallout from the planned density/action changes. No scope creep beyond keeping the new contract lint-clean and correctly covered.

## Issues Encountered

- Commit safety issue: this plan had to build on a dirty wave baseline in files it also needed to modify, so per-task atomic commits were intentionally skipped rather than risk staging unrelated work.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan `33-04` can now update manual proof wording against a stable compact-card and catalog-action contract.
- Manual visual verification of the calmer cards and aligned CTAs was not run interactively in this turn; with auto-advance enabled, that check remains a follow-up product proof rather than an execution blocker.

## Verification

- `npx vitest run src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `npx eslint src/components/ui/Button.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `npx tsc --noEmit`

## Self-Check: PASSED

- Summary file created at `.planning/phases/33-classic-truth-and-catalog-density-repair/33-03-SUMMARY.md`
- Plan-owned verification commands passed with the updated card-density and action-geometry seams
- Shared planning files were intentionally left untouched per user instruction

---
*Phase: 33-classic-truth-and-catalog-density-repair*
*Completed: 2026-04-22*
