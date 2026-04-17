---
phase: 20-brand-system-shared-tokens-and-surface-migration
plan: "02"
subsystem: ui
tags: [react, branding, shell, settings, vitest]
requires:
  - phase: 20-01
    provides: canonical brand primitives, brand-owned tokens, and app-icon versus product-mark rules
provides:
  - shell-owned surfaces reuse the canonical product mark and wordmark instead of local text-brand variants
  - classic launcher-home and onboarding share one FMCL surface language
  - appearance settings explain the stable brand boundary and focused tests lock the contract
affects: [20-03, 20-04, launcher-home, empty-states, appearance-settings]
tech-stack:
  added: []
  patterns: [BrandLockup for shell identity, focused branding seam tests]
key-files:
  created:
    - src/components/layout/__tests__/EmptyStateView.branding.test.tsx
    - src/components/settings/__tests__/AppearanceTab.branding.test.tsx
  modified:
    - src/components/sidebar/SidebarHeader.tsx
    - src/components/SimplePlayDashboard.tsx
    - src/components/onboarding/WelcomePage.tsx
    - src/components/layout/EmptyStateView.tsx
    - src/components/settings/tabs/AppearanceTab.tsx
    - src/components/__tests__/TitleBar.branding.test.tsx
    - src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx
    - src/locales/en.json
    - src/locales/ru.json
key-decisions:
  - "Shell-owned brand surfaces use the shared BrandLockup or BrandMark plus BrandWordmark seam instead of raw FriendLauncher headings or route-local hero treatments."
  - "Classic launcher-home keeps pack metadata secondary while the product mark and wordmark remain the primary identity on the shell-owned dashboard hero."
  - "Appearance settings describe accent as personalization for highlights and active controls, while FMCL mark, wordmark, and shell surfaces remain product-owned."
patterns-established:
  - "Pattern 1: Use the product mark for product-subject shell surfaces and reserve the app icon for window chrome."
  - "Pattern 2: Guard brand drift with narrow seam tests on shell chrome, empty-state, and settings explanation layers."
requirements-completed: [BRAND-01, BRAND-02]
duration: 6min
completed: 2026-04-17
---

# Phase 20 Plan 02: Shell Brand Surface Migration Summary

**Canonical FMCL mark and wordmark adoption across shell-owned launcher-home, onboarding, empty-state, and appearance surfaces**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-17T20:57:00Z
- **Completed:** 2026-04-17T21:02:57Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Replaced the remaining high-visibility raw `FriendLauncher` shell headings with the shared brand primitives on sidebar, onboarding, and empty-state surfaces.
- Moved the classic launcher-home hero onto the canonical product mark and wordmark pairing while keeping pack metadata secondary to the shell brand treatment.
- Added focused regression tests for title-bar, empty-state, and appearance-brand seams so the shell-owned brand contract does not drift back into arbitrary text or icon usage.

## Task Commits

Each task was committed atomically:

1. **Task 1: Apply shared brand primitives to shell chrome, launcher-home, onboarding, and empty-state surfaces** - `3d29a5b` (feat)
2. **Task 2: Bring appearance settings onto the same brand language and lock shell-brand truth with focused tests** - `5a2427a` (test)

## Files Created/Modified
- `src/components/sidebar/SidebarHeader.tsx` - switches shell header identity from raw text to the shared lockup.
- `src/components/SimplePlayDashboard.tsx` - re-centers the classic hero around the canonical product mark and wordmark.
- `src/components/onboarding/WelcomePage.tsx` - adds the shared lockup and separates the welcome heading from the product name.
- `src/components/layout/EmptyStateView.tsx` - uses the canonical product mark and wordmark instead of split raw branding.
- `src/components/settings/tabs/AppearanceTab.tsx` - explains the stable FMCL brand boundary and keeps accent scope truthful.
- `src/components/__tests__/TitleBar.branding.test.tsx` - tightens the title-bar contract to a single shared wordmark.
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` - updates the dashboard proof seam to the canonical launcher mark.
- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx` - proves empty-state fallback and mark-wordmark pairing.
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx` - proves the appearance page presents the shared brand boundary with the canonical primitives.
- `src/locales/en.json` - adds the new onboarding intro and appearance-brand boundary copy in English.
- `src/locales/ru.json` - adds the new onboarding intro and appearance-brand boundary copy in Russian.

## Decisions Made
- Reused the `BrandLockup` seam for shell identity instead of inventing another sidebar or onboarding-specific brand component.
- Kept launcher-home pack information visible but subordinate to the product mark and wordmark so the dashboard stops mixing content-art and product-brand roles.
- Limited appearance-tab work to explanation and regression coverage, avoiding preset redesign or broader interaction-state work owned by later phases.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A stale `.git/index.lock` blocked staging twice during execution. Verified there was no live Git process, removed the stale lock, and continued without touching unrelated worktree changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 20 now has one shared shell-owned brand baseline for later surface migration and fallback-policy work.
- Appearance settings communicate the brand versus accent boundary clearly enough for later theme-fidelity phases to build on without reopening shell identity.

## Self-Check: PASSED

- Found `.planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-02-SUMMARY.md`
- Found task commits `3d29a5b` and `5a2427a` in repository history

---
*Phase: 20-brand-system-shared-tokens-and-surface-migration*
*Completed: 2026-04-17*
