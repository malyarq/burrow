---
phase: 11-adaptive-layout-and-interaction-foundations
plan: "03"
subsystem: ui
tags: [branding, fallback-assets, images, titlebar, classic-mode]
requires:
  - phase: 11-adaptive-layout-and-interaction-foundations
    plan: "01"
    provides: stable responsive classic surfaces for shipped visual truth
  - phase: 11-adaptive-layout-and-interaction-foundations
    plan: "02"
    provides: no conflicting overlay or shell regressions while fallback assets are refreshed
provides:
  - one shipped launcher mark used across classic surfaces and fallback-heavy seams
  - product-safe bundled fallback logic in `LazyImage`
  - consistent titlebar and packaged-icon fallback behavior
affects: [phase-11, visual-trust, images, classic-mode]
tech-stack:
  added: []
  patterns: [branding-constants, bundled-asset-fallback, shared-launcher-mark]
key-files:
  created:
    - public/launcher-mark.svg
    - src/app/assets/branding.ts
    - src/components/__tests__/SimplePlayHome.visualTruth.test.tsx
  modified:
    - public/icon.png
    - src/app/hooks/useAppIcon.ts
    - src/components/SimplePlayDashboard.tsx
    - src/components/SimplePlayHome.tsx
    - src/components/TitleBar.tsx
    - src/components/layout/EmptyStateView.tsx
    - src/components/ui/LazyImage.tsx
    - src/components/ui/__tests__/LazyImage.cache.test.tsx
key-decisions:
  - "Introduced a dedicated launcher mark instead of continuing to reuse the old bundled grass-block icon on logo-driven surfaces."
  - "Moved bundled asset identity into shared branding constants so fallback logic can distinguish shipped assets from remote image failures."
patterns-established:
  - "Foundational FMCL image fallbacks should default to a shipped launcher mark, not a placeholder-feeling generic icon."
requirements-completed: [VIS-01]
duration: 39min
completed: 2026-04-13
---

# Phase 11 Plan 03: Adaptive Layout And Interaction Foundations Summary

**A shipped launcher mark and shared fallback-asset contract now replace placeholder-feeling icon reuse across FMCL's titlebar, classic surfaces, and image fallbacks**

## Performance

- **Duration:** 39 min
- **Started:** 2026-04-13T15:58:00+03:00
- **Completed:** 2026-04-13T16:36:32+03:00
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Replaced placeholder-feeling classic and easter-egg icon reuse with a dedicated shipped launcher mark.
- Centralized branding asset paths and bundled-asset detection so titlebar, empty states, and `LazyImage` use a consistent fallback contract.
- Rebuilt `public/icon.png` from the new mark so dev, packaged icon delivery, and titlebar fallback no longer drift apart.

## Task Commits

1. **Task 1: Replace placeholder-looking bundled assets with an intentional shared launcher mark and fallback path** - `78b4da3` (`fix(11-03): align launcher fallback assets`)
2. **Task 2: Add focused regression coverage for fallback and classic-surface truth** - `f01c1b6` (`test(11-03): cover launcher asset truth`)

## Files Created/Modified

- `public/launcher-mark.svg` - shipped launcher mark used by classic and fallback-heavy UI surfaces.
- `public/icon.png` - regenerated packaged icon derived from the new launcher mark.
- `src/app/assets/branding.ts` - shared constants and bundled-asset detection helper.
- `src/app/hooks/useAppIcon.ts` and `src/components/TitleBar.tsx` - titlebar icon contract now uses shared branding constants and falls back intentionally.
- `src/components/SimplePlayHome.tsx` and `src/components/SimplePlayDashboard.tsx` - classic logo/easter-egg surfaces now render the shipped launcher mark.
- `src/components/layout/EmptyStateView.tsx` and `src/components/ui/LazyImage.tsx` - foundational fallback seams now land on the launcher mark instead of a placeholder-like generic icon.
- `src/components/ui/__tests__/LazyImage.cache.test.tsx` and `src/components/__tests__/SimplePlayHome.visualTruth.test.tsx` - regression coverage for default fallback and classic/easter-egg truth.

## Decisions Made

- Kept the titlebar on the packaged app icon path while making classic/logo-driven surfaces consume the dedicated launcher mark directly.
- Allowed `LazyImage` to default to the shipped launcher mark when no explicit fallback is provided, so broken remote imagery fails into a product-safe state instead of dead or generic placeholders.

## Deviations from Plan

None.

## Issues Encountered

- `sips` could not extract a PNG from the new SVG mark on this machine, so the packaged `public/icon.png` was regenerated through the macOS Quick Look thumbnailer instead.

## User Setup Required

None.

## Next Phase Readiness

- Phase 11 closeout can now verify fallback truth live on the classic dashboard and titlebar without seeing the old generic icon leak back in.
- Later UX phases inherit one shipped fallback mark instead of needing more per-surface placeholder cleanup.

---
*Phase: 11-adaptive-layout-and-interaction-foundations*
*Completed: 2026-04-13*
