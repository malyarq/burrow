---
phase: 20-brand-system-shared-tokens-and-surface-migration
plan: "01"
subsystem: ui
tags: [react, typescript, branding, theme-tokens]
requires:
  - phase: 19-shell-integrated-truth-and-proof-driven-closeout
    provides: shell-integrated proof surfaces and stable shell geometry for brand-contract adoption
provides:
  - canonical FMCL asset-role contract for app icon, product mark, wordmark, and neutral media fallback
  - brand-owned document token layer wired through the existing SettingsContext and preset seams
  - proof-surface adoption on the title bar and classic home/dashboard with focused regression coverage
affects: [20-02, 20-03, 20-04, shell-branding, fallback-policy]
tech-stack:
  added: []
  patterns: [brand asset-role mapping, theme brand token extension, CSS variable brand utilities]
key-files:
  created: [src/components/branding/BrandMark.tsx, src/components/branding/BrandWordmark.tsx, src/components/branding/BrandLockup.tsx, src/components/__tests__/TitleBar.branding.test.tsx]
  modified: [src/app/assets/branding.ts, src/app/hooks/useAppIcon.ts, src/index.css, src/contexts/settings/theme.ts, src/contexts/settings/theme-presets.ts, src/contexts/settings/types.ts, src/contexts/SettingsContext.tsx, src/components/TitleBar.tsx, src/components/SimplePlayHome.tsx, src/components/SimplePlayDashboard.tsx]
key-decisions:
  - "Keep the canonical brand seam in src/app/assets/branding.ts and src/components/branding/* instead of introducing a parallel branding store."
  - "Extend CustomThemeConfig with brand tokens so product-owned shell and mark styling rides the existing theme-document pipeline."
  - "Use TitleBar and the classic home/dashboard surfaces as proof consumers for Phase 20 without absorbing the broader shell migration planned later in the phase."
patterns-established:
  - "Brand roles: app icon, product mark, and neutral media fallback resolve from one shared contract."
  - "Brand document tokens: shell glow, mark frame, media frame, and wordmark typography flow into CSS variables via applyThemeToDocument."
requirements-completed: [BRAND-01, BRAND-02]
duration: 18 min
completed: 2026-04-17
---

# Phase 20 Plan 01: Canonical Brand Contract Summary

**Canonical FMCL brand roles and theme-owned product tokens now drive the title bar plus classic home surfaces without depending on raw asset constants or accent-led identity.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-17T20:30:00Z
- **Completed:** 2026-04-17T20:47:49Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Added one canonical FMCL branding contract with explicit roles for app icon, in-product mark, shared wordmark, and neutral media fallback art.
- Extended the existing SettingsContext and theme seams with product-owned brand tokens for shell glow, mark framing, media framing, and wordmark typography.
- Proved the contract on the title bar and classic home/dashboard surfaces and locked the behavior with focused regression tests.

## Task Commits

Each task was committed atomically:

1. **Task 1: Introduce one canonical FMCL brand contract for mark, wordmark, icon, and media-fallback roles** - `fe74951` (feat)
2. **Task 2: Add a product-owned token layer above raw palette and accent seams, then lock it with focused tests** - `e07a92f` (feat)

## Files Created/Modified

- `src/app/assets/branding.ts` - Defines FMCL asset roles, canonical wordmark text, and neutral inline media fallback art.
- `src/components/branding/BrandMark.tsx` - Shared mark primitive for app icon, product mark, and media fallback roles.
- `src/components/branding/BrandWordmark.tsx` - Shared wordmark primitive with shell and hero treatments.
- `src/components/branding/BrandLockup.tsx` - Composes mark and wordmark for future surface migration work.
- `src/contexts/settings/theme.ts` - Applies the brand token layer to document CSS variables alongside palette and accent tokens.
- `src/contexts/settings/theme-presets.ts` - Keeps preset identity compatible while allowing optional brand-token overrides.
- `src/index.css` - Adds brand utility classes and shifts shell depth away from hardcoded shadows and accent-led glows.
- `src/components/TitleBar.tsx` - Uses the shared app-icon and shell wordmark primitives with safe fallback behavior.
- `src/components/SimplePlayHome.tsx` - Uses the shared product mark and wordmark primitives for the classic launcher identity.
- `src/components/SimplePlayDashboard.tsx` - Uses neutral media fallback framing and the shared wordmark contract on the classic dashboard.

## Decisions Made

- Kept the neutral content-art fallback as a data-URI SVG inside the shared branding seam so the policy lives with the contract rather than another ad hoc public asset.
- Added `brand` to `CustomThemeConfig` instead of inventing a second document-token pipeline beside `resolveThemeConfig` and `applyThemeToDocument`.
- Limited proof-surface adoption to the title bar and classic home/dashboard so later plans can migrate more shell and route surfaces onto a stable contract.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Allow BrandMark to honor explicit runtime sources**
- **Found during:** Task 2
- **Issue:** The new `BrandMark` primitive always forced the canonical asset path, which would have broken the resolved runtime window icon path coming from `useAppIcon()`.
- **Fix:** Allowed `BrandMark` to accept an explicit `src` override while keeping canonical role metadata and fallback behavior.
- **Files modified:** `src/components/branding/BrandMark.tsx`
- **Verification:** `npx eslint ...`, `npx vitest run ...`, `npx tsc --noEmit`
- **Committed in:** `e07a92f`

**2. [Rule 1 - Bug] Preserve legacy preset inference after adding brand overrides**
- **Found during:** Task 2
- **Issue:** Once presets started carrying `brand` tokens, `inferThemePresetId()` would no longer match legacy color-only stored presets.
- **Fix:** Kept preset inference normalized on color/background data while leaving brand overrides opt-in at runtime.
- **Files modified:** `src/contexts/settings/theme-presets.ts`
- **Verification:** `npx eslint ...`, `npx tsc --noEmit`
- **Committed in:** `e07a92f`

---

**Total deviations:** 2 auto-fixed (2 rule-1 bugs)
**Impact on plan:** Both fixes were direct fallout from the new contract and kept the plan phase-bounded without expanding scope.

## Issues Encountered

- The plan-specified ESLint command warns that `src/index.css` has no matching ESLint configuration. Targeted TS and TSX linting was rerun cleanly so the actual code gate remains green.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 20 now has stable primitives and brand-token ownership for broader shell and route migration work.
- Later phase plans can consume `BrandMark`, `BrandWordmark`, `BrandLockup`, and the new document brand variables without re-deciding fallback or shell identity rules.
- Unrelated local files in the worktree were left untouched.

## Self-Check: PASSED

- Found summary file: `.planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-01-SUMMARY.md`
- Found task commit: `fe74951`
- Found task commit: `e07a92f`

---
*Phase: 20-brand-system-shared-tokens-and-surface-migration*
*Completed: 2026-04-17*
