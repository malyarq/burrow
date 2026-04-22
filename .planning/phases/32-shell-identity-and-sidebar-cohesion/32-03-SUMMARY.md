---
phase: 32-shell-identity-and-sidebar-cohesion
plan: "03"
subsystem: ui
tags: [react, branding, fallback, empty-state, modpacks]
requires: []
provides:
  - one calmer content-first fallback rule across empty and modpack artwork gaps
  - a restrained empty-state composition that no longer reads like a branded hero
affects: [BRAND-01, artwork-fallback, empty-state, modpack-artwork]
tech-stack:
  added: []
  patterns: [content-first placeholder routing, restrained empty-state identity]
key-files:
  created: [.planning/phases/32-shell-identity-and-sidebar-cohesion/32-03-SUMMARY.md]
  modified: [src/app/assets/branding.ts, src/components/layout/EmptyStateView.tsx, src/components/layout/__tests__/EmptyStateView.branding.test.tsx, src/components/modpacks/ModpackList.tsx, src/components/modpacks/details/ModpackDetailsHeader.tsx, src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx, src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx]
key-decisions:
  - "Missing-content surfaces now prefer calm placeholder art over launcher icon fallback on installed and local modpacks."
  - "Empty states keep only minimal app identity instead of a full brand-led hero treatment."
patterns-established:
  - "App identity belongs on shell-owned seams; missing-art and empty-content surfaces stay content-first."
requirements-completed: [BRAND-01]
duration: not recorded
completed: 2026-04-22
---

# Phase 32 Plan 03 Summary

**Missing-art and empty-state surfaces now follow one calmer content-first placeholder rule instead of mixing app-icon fallback with hero-brand filler.**

## Performance

- **Duration:** not recorded
- **Started:** 2026-04-22T11:09:00+0300
- **Completed:** 2026-04-22T13:07:36+0300
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Replaced the louder cube-like media fallback with calmer neutral placeholder art.
- Simplified `EmptyStateView` from a framed branded hero into a restrained utility surface that still keeps minimal app identity when needed.
- Unified installed, local, and detail-header modpack artwork gaps under the neutral content-artwork fallback rule and flipped the regression seams accordingly.

## Task Commits

1. **Task 1: Replace loud fallback art and unify the missing-art rule across shell and modpack surfaces** - not committed
2. **Task 2: Flip fallback, modpack-artwork, and empty-state regression tests to the new restraint posture** - not committed

**Commit status:** intentionally skipped because the worktree already contained unrelated local edits, so creating an atomic task commit would have bundled baseline changes outside this plan.

## Files Created/Modified

- `src/app/assets/branding.ts` - replaced the old media fallback art with a calmer neutral placeholder.
- `src/components/layout/EmptyStateView.tsx` - removed the branded hero framing and reduced the empty state to a restrained utility composition.
- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx` - flipped the empty-state seam away from branded hero expectations.
- `src/components/modpacks/ModpackList.tsx` - routed installed and local modpack artwork gaps through the neutral content fallback.
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` - aligned detail-header missing art with the same content-artwork rule.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - locked local and installed artwork fallback to the neutral placeholder path.
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx` - added missing-art proof for detail headers.

## Decisions Made

- Reused the existing brand-role split and changed usage policy instead of performing another brand-system rewrite.
- Treated empty states as utility surfaces that may keep a small app identity cue but must not read like a product-marketing hero.

## Deviations from Plan

- `src/components/ui/ArtworkFallback.tsx`, `src/components/ui/LazyImage.tsx`, `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx`, and `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` were inspected but did not require code changes. The shared fallback behavior already routed correctly once the upstream placeholder asset and consuming surfaces were corrected.

## Issues Encountered

- The repo already mixed neutral and app-icon fallback rules by surface, so the main work was not the SVG swap alone; it was deciding one authoritative consumption rule and moving local/installed modpack surfaces onto it.
- Manual visual review of fallback calmness was not rerun in this noninteractive turn, so product-feel sampling remains human signoff debt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Later catalog and content phases can now assume one calmer missing-art policy instead of compensating for different local versus remote artwork contracts.
- No additional implementation work is needed for `32-03`; remaining signoff is manual-only fallback feel review.

