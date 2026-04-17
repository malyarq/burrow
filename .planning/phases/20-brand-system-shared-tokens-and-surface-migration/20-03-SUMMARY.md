---
phase: 20-brand-system-shared-tokens-and-surface-migration
plan: "03"
subsystem: ui
tags: [react, typescript, lazy-image, branding, modpacks, accounts]
requires:
  - phase: 20-brand-system-shared-tokens-and-surface-migration
    provides: canonical brand assets and shared shell brand truth from plans 01 and 02
provides:
  - shared neutral artwork fallback policy for content media
  - modpack and account route adoption that removes app-icon fallback drift
  - focused regression coverage for shared artwork fallback behavior
affects: [20-04, modpacks, accounts, content-artwork, degraded-state-followup]
tech-stack:
  added: []
  patterns: [shared artwork fallback policy via LazyImage, route adoption through shared image seams]
key-files:
  created: [src/components/ui/ArtworkFallback.tsx, src/components/ui/__tests__/ArtworkFallback.policy.test.tsx]
  modified: [src/components/ui/LazyImage.tsx, src/components/sidebar/ModpackSection.tsx, src/components/modpacks/details/ModpackDetailsHeader.tsx, src/components/modpacks/details/ResourcePacksTab.tsx, src/components/modpacks/details/WorldDatapacksModal.tsx, src/components/modpacks/InstallModpackPage.tsx, src/components/modpacks/AddModPage.tsx, src/components/modpacks/AddModModal.tsx, src/features/accounts/AccountSkinPanel.tsx, src/components/ui/__tests__/LazyImage.cache.test.tsx, src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx, src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx]
key-decisions:
  - "Content artwork now defaults to the neutral media-fallback asset at the LazyImage seam; product-mark and app-icon usage require explicit opt-in."
  - "Planned artwork slots render through LazyImage even when source URLs are absent so routes stop hand-rolling /icon.png fallbacks or suppressing placeholders."
  - "Phase 20 plan 03 stayed scoped to fallback truth and route adoption without taking on broader degraded-state copy or error-state work."
patterns-established:
  - "Use ArtworkFallback as the owning policy seam for content-media placeholders rather than scattering asset-path fallbacks across route components."
  - "For fixed artwork slots, render LazyImage unconditionally and let the shared fallback policy handle missing media."
requirements-completed: [BRAND-03]
duration: 6 min
completed: 2026-04-17
---

# Phase 20 Plan 03: Artwork Fallback Policy And Route Adoption Summary

**Neutral content artwork fallback policy wired through LazyImage with modpack and account routes migrated off launcher-mark and app-icon drift**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-17T21:07:50Z
- **Completed:** 2026-04-17T21:14:33Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- Added `ArtworkFallback` as the shared policy seam that maps content artwork, product mark, and app icon to distinct owned assets.
- Switched `LazyImage` to the neutral media fallback by default and removed the sidebar’s raw `img onError` fallback logic.
- Migrated the planned modpack and account surfaces off route-local `/icon.png` overrides and locked the new policy with focused regression tests.

## Task Commits

Each task was committed atomically:

1. **Task 1: Introduce a shared neutral-artwork fallback seam above LazyImage and direct route error handlers** - `74d1199` (feat)
2. **Task 2: Migrate the highest-visibility modpack and account artwork consumers onto the shared policy and lock it with focused tests** - `d6db3f3` (feat)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `src/components/ui/ArtworkFallback.tsx` - Declares the reusable fallback policy for neutral artwork, product mark, and app icon roles.
- `src/components/ui/LazyImage.tsx` - Defaults content artwork to the shared neutral fallback instead of the launcher mark.
- `src/components/sidebar/ModpackSection.tsx` - Routes the selected modpack artwork through `LazyImage` instead of a raw `/icon.png` error handler.
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` - Keeps the modpack hero slot visible even when metadata artwork is missing.
- `src/components/modpacks/details/ResourcePacksTab.tsx` - Removes local app-icon fallback overrides from installed resource-pack artwork.
- `src/components/modpacks/details/WorldDatapacksModal.tsx` - Aligns datapack search cards with the shared neutral fallback.
- `src/components/modpacks/InstallModpackPage.tsx` - Shows a consistent shared placeholder in the install header when remote artwork is absent.
- `src/components/modpacks/AddModPage.tsx` - Stops hiding mod search artwork slots when provider icons are missing.
- `src/components/modpacks/AddModModal.tsx` - Mirrors the page-level add-mod artwork behavior inside the modal flow.
- `src/features/accounts/AccountSkinPanel.tsx` - Uses the shared artwork fallback for account skin preview instead of the app icon.
- `src/components/ui/__tests__/LazyImage.cache.test.tsx` - Verifies the neutral default fallback still works with cached remote images.
- `src/components/ui/__tests__/ArtworkFallback.policy.test.tsx` - Locks the role and asset mapping between media fallback, product mark, and app icon.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - Confirms installed cards use the neutral artwork fallback.
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` - Confirms remote browser cards use the neutral artwork fallback.

## Decisions Made
- Defaulted content artwork fallback to the neutral media asset instead of the launcher mark so missing modpack, datapack, and account art no longer degrades into product branding.
- Preserved explicit distinction between content artwork, product-mark, and app-icon assets in the shared seam so future surfaces can opt into the right brand role intentionally.
- Treated missing artwork visibility as part of route adoption by removing truthy `iconUrl` guards on planned slots rather than letting those slots disappear.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The initial `ArtworkFallback` module exported runtime helpers alongside the component, which triggered the Fast Refresh lint rule. The helpers were folded onto the exported component as static properties and the task verification was rerun cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 20 now has one trustworthy shared seam for missing content artwork across the planned modpack and account surfaces.
- Phase 23 can build degraded-state copy or richer error-state behavior on top of this neutral fallback truth without first untangling route-local `/icon.png` overrides.

## Self-Check
PASSED

- Found `.planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-03-SUMMARY.md`
- Found task commit `74d1199`
- Found task commit `d6db3f3`

---
*Phase: 20-brand-system-shared-tokens-and-surface-migration*
*Completed: 2026-04-17*
