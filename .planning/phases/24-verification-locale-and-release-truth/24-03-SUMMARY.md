---
phase: 24-verification-locale-and-release-truth
plan: "03"
subsystem: verification
tags: [playwright, vitest, typescript, closeout, screenshots]
requires:
  - phase: 24-01
    provides: v0.5.0 closeout registry and deterministic manual verification foundation
  - phase: 24-02
    provides: representative degraded closeout proof and explicit theme/locale closeout pairs
provides:
  - committed Chromium screenshot regression lane bound to the Phase 24 closeout registry
  - strict snapshot baselines for the owned `phase-24-*` closeout views
  - authoritative validation map synchronized to the landed visual lane and closeout commands
affects: [phase-24-closeout-proof, screenshot-regression-gate, validation-truth]
tech-stack:
  added: [@playwright/test]
  patterns: [registry-driven screenshot suite, system-browser fallback, manual-only toast suppression]
key-files:
  created:
    - playwright.config.ts
    - tests/visual/manual-closeout.spec.ts
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-home-closeout-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-modpacks-closeout-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-degraded-closeout-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-theme-dark-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-theme-light-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-locale-en-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-locale-ru-chromium-darwin.png
    - .planning/phases/24-verification-locale-and-release-truth/24-03-SUMMARY.md
  modified:
    - package.json
    - package-lock.json
    - vitest.config.ts
    - src/contexts/ToastContext.tsx
    - src/verification/manual/scenarios.tsx
    - src/verification/manual/views.ts
    - .planning/phases/24-verification-locale-and-release-truth/24-VALIDATION.md
key-decisions:
  - "Bound the Playwright suite directly to `PLAYWRIGHT_CLOSEOUT_VIEWS` so registry metadata, screenshot ownership, and validation truth cannot drift independently."
  - "Used a system Chromium fallback in `playwright.config.ts` because CDN-backed `npx playwright install chromium` was not reliable in this environment."
  - "Suppressed toast rendering only inside manual verification providers so the degraded closeout screenshot proves the shipped fallback surfaces instead of transient overlay noise."
patterns-established:
  - "Every screenshot-owned closeout view now carries viewport and negative-check metadata that the visual lane consumes without hard-coded route lists."
  - "Closeout readiness remains driven by hidden `#verification-status` state, letting the screenshot suite wait for real shell-integrated completion instead of arbitrary sleeps."
requirements-completed: [VER-01, VER-02, VER-03]
duration: 32 min
completed: 2026-04-19
---

# Phase 24 Plan 03: Closeout Screenshot Lane And Validation Truth

**Turned the curated `phase-24-*` closeout set into a committed screenshot regression gate and synchronized the validation contract to the landed lane.**

## Performance

- **Duration:** 32 min
- **Started:** 2026-04-19T21:45:00+03:00
- **Completed:** 2026-04-19T22:17:00+03:00
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments

- Added a Chromium-only Playwright lane and committed strict baselines for all seven owned Phase 24 closeout views.
- Exported `PLAYWRIGHT_CLOSEOUT_VIEWS` plus per-view negative-check metadata so the screenshot runner derives its scope from the closeout registry instead of a second hard-coded list.
- Stabilized the degraded closeout view by suppressing manual-only toast overlays and fixed theme readiness gating for the dark and light comparison pair.
- Refreshed `24-VALIDATION.md` so it names the actual screenshot script, browser provisioning path, and current task status instead of Wave 0 placeholders.

## Task Commits

Each task was committed atomically:

1. **Task 1-2: Land the closeout screenshot lane and validation truth** - `136e7bc` (feat)

## Files Created/Modified

- `package.json` / `package-lock.json` - added `@playwright/test` and the committed `test:visual:closeout` script.
- `playwright.config.ts` - introduced Chromium-only visual test config with system-browser fallback and reuse of the existing manual verification seam.
- `tests/visual/manual-closeout.spec.ts` - added the registry-driven visual suite that waits for `#verification-status`, disables motion, enforces forbidden-text checks, and snapshots each owned closeout view strictly.
- `tests/visual/manual-closeout.spec.ts-snapshots/` - seeded the seven committed baselines for the owned Phase 24 closeout views.
- `src/verification/manual/views.ts` - exposed `PLAYWRIGHT_CLOSEOUT_VIEWS` and per-view forbidden-text metadata for the screenshot lane.
- `src/verification/manual/scenarios.tsx` - fixed theme closeout readiness text and wired manual verification providers through toast suppression for deterministic degraded proof.
- `src/contexts/ToastContext.tsx` - added optional `suppressToasts` behavior so manual proof can disable transient overlay rendering without altering shipped app behavior elsewhere.
- `vitest.config.ts` - excluded `tests/visual/**/*` so Playwright specs do not leak into Vitest discovery.
- `.planning/phases/24-verification-locale-and-release-truth/24-VALIDATION.md` - promoted the landed commands, registry scope, browser fallback, and task status into the authoritative validation map.

## Decisions Made

- Kept screenshot scope strictly bounded to `phase-24-*` closeout views rather than freezing historical Phase 17/21/22 routes.
- Solved degraded screenshot instability at the manual-verification seam instead of mutating screenshots/product surfaces just to appease Playwright.
- Preserved the hidden readiness contract rather than replacing it with screenshot-only waits, so manual review and automated capture stay coupled to the same proof signal.

## Deviations from Plan

- `npx playwright install chromium` was not used as the primary provisioning path because CDN access was unreliable; the committed config now prefers a local Chromium executable and documents the `PLAYWRIGHT_CHROMIUM_EXECUTABLE` override.

## Issues Encountered

- The first strict run exposed a case-sensitive readiness mismatch between the Phase 24 theme callout titles and the `useReadyByText` needles.
- The degraded closeout view initially failed screenshot stabilization because `ScreenshotsTab` emitted transient error toasts above the real closeout surface.

## User Setup Required

None.

## Next Phase Readiness

- Wave 4 can now cite named `phase-24-*` view ids, a committed screenshot gate, and a synchronized validation matrix when refreshing README, roadmap docs, and planning truth.
- Any remaining closure work is now release-truth sync and final gate execution rather than proof-seam invention.

## Self-Check: PASSED

- Found `.planning/phases/24-verification-locale-and-release-truth/24-03-SUMMARY.md`
- Found commit `136e7bc`
- `git diff --check -- .planning/phases/24-verification-locale-and-release-truth/24-VALIDATION.md playwright.config.ts tests/visual/manual-closeout.spec.ts package.json`
- `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/utils/__tests__/format.test.ts src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx`
- `npx playwright test tests/visual/manual-closeout.spec.ts --project=chromium --update-snapshots`
- `npm run test:visual:closeout`
- `npx tsc --noEmit`

---
*Phase: 24-verification-locale-and-release-truth*
*Completed: 2026-04-19*
