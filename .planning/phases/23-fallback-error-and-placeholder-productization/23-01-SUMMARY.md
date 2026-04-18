---
phase: 23-fallback-error-and-placeholder-productization
plan: "01"
subsystem: ui
tags: [react, typescript, i18n, fallback-states, error-handling]
requires:
  - phase: 20-brand-system-and-fallback-art-truth
    provides: product-owned branding and fallback-art boundaries that degraded states must not reuse
  - phase: 22-theme-and-locale-runtime-truth
    provides: runtime locale truth reused by degraded copy and outer-boundary translation helpers
provides:
  - calm degraded-state component for empty, zero-result, unavailable, and inline error surfaces
  - shared sanitizers for IPC wrapper text, suspicious placeholders, and mixed-language fallback copy
  - runtime translator lookup and fatal-error recovery seam ready for later ErrorBoundary adoption
affects: [phase-23-route-adoption, degraded-state-copy, crash-recovery]
tech-stack:
  added: []
  patterns: [shared degraded-state seam, display-string sanitization, runtime translator lookup outside SettingsProvider]
key-files:
  created:
    - src/components/layout/DegradedStateView.tsx
    - src/components/error/FatalErrorView.tsx
    - src/utils/displayError.ts
    - src/utils/safeUiText.ts
    - src/components/layout/__tests__/DegradedStateView.test.tsx
    - src/utils/__tests__/displayError.test.ts
  modified:
    - src/contexts/settings/i18n.ts
    - src/locales/en.json
    - src/locales/ru.json
    - src/components/layout/__tests__/EmptyStateView.branding.test.tsx
key-decisions:
  - "Keep EmptyStateView brand-owned and introduce a separate calm degraded-state primitive instead of softening the hero seam."
  - "Sanitize user-facing fallback text through shared helpers that unwrap IPC prefixes and collapse suspicious placeholders to localized copy."
  - "Read the active language from persisted settings so the future outer crash boundary can translate before SettingsProvider mounts."
patterns-established:
  - "Degraded states use one neutral card/inline seam with explicit variant labels instead of decorative brand hero treatment."
  - "Fallback and error copy should pass through shared sanitizers before route surfaces render technical or placeholder text."
requirements-completed: [FALL-01, FALL-02, FALL-03]
duration: 8 min
completed: 2026-04-19
---

# Phase 23 Plan 01: Degraded-State Contract Summary

**Calm degraded-state cards, fatal-error recovery seam, and shared sanitizers for IPC wrappers and placeholder leaks**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-18T22:16:00Z
- **Completed:** 2026-04-18T22:24:04Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Added a reusable `DegradedStateView` that separates calm empty, zero-result, unavailable, and inline error presentation from the logo-forward `EmptyStateView` hero.
- Added shared `safeUiText` and `displayError` helpers that unwrap IPC failure prefixes and collapse suspicious placeholders or mixed-language fallback strings to localized product copy.
- Added a runtime translator helper plus `FatalErrorView` so the future outer crash boundary can adopt recovery-first copy without depending on `SettingsProvider`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create a calm degraded-state primitive and shared display-sanitization helpers** - `ff4dac5` (feat)
2. **Task 2: Add shared regression coverage for degraded-state variants and sanitization rules** - `c5958b9` (test)

## Files Created/Modified
- `src/components/layout/DegradedStateView.tsx` - Calm card and inline degraded-state seam with explicit variants.
- `src/components/error/FatalErrorView.tsx` - Recovery-first fatal error view that consumes the new degraded-state contract and runtime translator fallback.
- `src/utils/displayError.ts` - Shared user-facing error mapper that strips technical IPC wrappers before display.
- `src/utils/safeUiText.ts` - Suspicious placeholder and mixed-language fallback sanitizer for future route adoption.
- `src/contexts/settings/i18n.ts` - Added runtime language coercion and translator lookup outside provider context.
- `src/locales/en.json` - Added degraded-state and fatal-error copy, and corrected the changelog placeholder text.
- `src/locales/ru.json` - Added degraded-state and fatal-error copy, and corrected the mixed-language changelog placeholder.
- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx` - Locked the brand hero seam away from the new degraded-state contract.
- `src/components/layout/__tests__/DegradedStateView.test.tsx` - Covers the new degraded-state variants and inline-error presentation.
- `src/utils/__tests__/displayError.test.ts` - Covers IPC wrapper stripping, suspicious placeholder fallback, and technical detail formatting.

## Decisions Made
- Kept `EmptyStateView` untouched as the brand-owned hero seam and introduced `DegradedStateView` as the quieter degraded-state contract the rest of Phase 23 can adopt.
- Fixed user-facing placeholder truth at the shared helper and locale seam instead of scattering one-off string cleanup across route components first.
- Added persisted-language lookup in `i18n.ts` rather than wiring `FatalErrorView` through `SettingsProvider`, which keeps the future outer boundary integration brownfield-safe.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A stale `.git/index.lock` appeared twice during staging. It was removed and the targeted `git add` command was retried without touching any unrelated files.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Route-level Phase 23 work can now adopt `DegradedStateView`, `safeUiText`, and `displayError` instead of inventing per-surface fallback copy.
- `FatalErrorView` and `createRuntimeTranslator` are ready for later `ErrorBoundary` adoption without reopening the provider boundary in this plan.
- No blockers remain inside the plan write set.

## Self-Check: PASSED

- Found `.planning/phases/23-fallback-error-and-placeholder-productization/23-01-SUMMARY.md`
- Found commit `ff4dac5`
- Found commit `c5958b9`

---
*Phase: 23-fallback-error-and-placeholder-productization*
*Completed: 2026-04-19*
