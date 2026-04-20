---
phase: 29-modpack-workflow-simplification-and-runtime-truth
plan: "01"
subsystem: ui
tags: [react, electron, typescript, modpacks, catalog, vitest]
requires:
  - phase: 28-product-restraint-and-native-shell-truth
    provides: restrained shell and modpack-surface baseline for the compact catalog cleanup
provides:
  - shared compact controls shell for installed and remote modpack catalogs
  - quieter installed and remote cards with runtime-first scan metadata
  - regression coverage for shared controls composition and dense card scanability
affects: [29-02, 29-03, modpack-browser, modpack-list]
tech-stack:
  added: []
  patterns: [shared catalog controls shell, remote search-result runtime summary fallback]
key-files:
  created:
    - src/components/modpacks/ModpackCatalogControls.tsx
    - src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx
  modified:
    - src/components/modpacks/ModpackList.tsx
    - src/components/modpacks/ModpackBrowser.tsx
    - src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx
    - src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx
    - src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx
    - shared/contracts/modpacks.ts
    - electron/services/mods/platform/modPlatformService.ts
key-decisions:
  - "Installed and remote catalog surfaces now render through one shared ModpackCatalogControls shell instead of separate summary-plus-filter compositions."
  - "Remote browser cards now prefer a search-result minecraftVersion and only fall back to the active filter value when the provider payload omits it."
patterns-established:
  - "Shared controls shell: list and browser surfaces compose search, sort, filters, reset, and inline status through one presentational seam."
  - "Quiet card summaries: catalog cards keep runtime and recency metadata on-card while descriptions, downloads, and other weight stay out of the scan path."
requirements-completed: [MODPACK-01, MODPACK-02]
duration: 9 min
completed: 2026-04-20
---

# Phase 29 Plan 01: Compact Catalog Controls Summary

**Shared compact catalog controls with quieter installed and remote modpack cards, plus truthful remote Minecraft-version summaries for scan-first browsing**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-20T14:42:12Z
- **Completed:** 2026-04-20T14:50:59Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Replaced the installed-list and remote-browser split control layouts with one reusable `ModpackCatalogControls` shell and removed the heavyweight top-of-list summary panels from both surfaces.
- Reduced card noise so installed cards keep only runtime and recency summaries, while remote cards now also surface a truthful Minecraft version instead of only an updated date.
- Added focused regression seams for the shared controls contract and dense catalog scanability so later Phase 29 plans can build on one stable catalog language.

## Task Commits

Each task was committed atomically:

1. **Task 1: Establish the shared compact catalog-controls shell and its Wave 0 seam** - `8066ec2` (feat)
2. **Task 2: Reduce card summary noise and lock dense scanability** - `a3a2430` (feat)

## Files Created/Modified
- `src/components/modpacks/ModpackCatalogControls.tsx` - shared presentational shell for catalog search, filters, reset, status, and optional footer content
- `src/components/modpacks/ModpackList.tsx` - installed catalog now consumes the shared controls shell and keeps card metadata runtime-first
- `src/components/modpacks/ModpackBrowser.tsx` - remote catalog now consumes the shared controls shell and renders Minecraft version plus updated time on cards
- `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx` - Wave 0 proof that installed and remote surfaces share the same compact controls contract
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - installed-card ergonomics coverage aligned with the quieter metadata contract
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` - remote-card ergonomics coverage aligned with the quieter metadata contract
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx` - dense catalog regression coverage for shared controls and quieter cards
- `shared/contracts/modpacks.ts` - optional remote-search `minecraftVersion` summary surfaced to the renderer
- `electron/services/mods/platform/modPlatformService.ts` - Modrinth and CurseForge modpack search results now derive a primary Minecraft version when available

## Decisions Made

- Used one shared controls component rather than separate installed and browser filter compositions so future catalog changes have a single layout seam.
- Kept inline status and recent-history affordances inside the shared shell instead of reviving standalone summary cards above the catalog results.
- Preferred an explicit `minecraftVersion` on remote search results so the browser card density contract stays truthful even without opening a modpack’s versions view.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Extended remote search results with a primary Minecraft version**
- **Found during:** Task 2 (Reduce card summary noise and lock dense scanability)
- **Issue:** The renderer-only plan files could not make remote cards satisfy the required "Minecraft version plus updated timestamp" summary contract because search results did not expose a trustworthy Minecraft version field.
- **Fix:** Added an optional `minecraftVersion` to remote modpack search results, derived a preferred release version from Modrinth and CurseForge payloads, and rendered that summary on remote cards with a fallback to the active version filter when needed.
- **Files modified:** `shared/contracts/modpacks.ts`, `electron/services/mods/platform/modPlatformService.ts`, `src/components/modpacks/ModpackBrowser.tsx`, `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`, `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`
- **Verification:** `npx vitest run src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx && npx eslint src/components/modpacks/ModpackCatalogControls.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx && npx tsc --noEmit` plus `npx eslint electron/services/mods/platform/modPlatformService.ts`
- **Committed in:** `a3a2430`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** The extra data-path change was narrowly required to make the remote browser meet the planned density contract. No unrelated scope was added.

## Issues Encountered

- Existing uncommitted baseline changes already touched the plan’s catalog files. Execution proceeded on top of that baseline and kept the work split into a shared-shell commit first, then a density/runtime-summary commit second.
- The plan’s manual desktop walkthrough was not defined as a separate checkpoint. With `workflow.auto_advance=true` in `.planning/config.json`, the autonomous run relied on the green DOM, lint, and type gates without pausing for human verification.
- `gsd-tools` could not safely advance the repo’s current `STATE.md` format and partially rewrote the frontmatter during `state update-progress`; the final `STATE.md`, `ROADMAP.md`, and `REQUIREMENTS.md` updates were repaired manually so the planning record remained consistent.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The catalog surfaces now share one compact controls family, which reduces churn for `29-02` detail-layout work and any later catalog polish.
- `29-03` can reuse the new remote `minecraftVersion` summary seam while it centralizes broader runtime-truth ownership across list, details, and launch-adjacent surfaces.

## Self-Check

PASSED

- Found summary file: `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-01-SUMMARY.md`
- Found task commits: `8066ec2`, `a3a2430`

---
*Phase: 29-modpack-workflow-simplification-and-runtime-truth*
*Completed: 2026-04-20*
