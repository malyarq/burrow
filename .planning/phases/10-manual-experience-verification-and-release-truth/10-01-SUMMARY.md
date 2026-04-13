---
phase: 10-manual-experience-verification-and-release-truth
plan: "01"
subsystem: verification
tags: [verification, browser-sanity, react, vite, chromium, cdp]
requires:
  - phase: 08-core-route-rollout-and-ui-correctness
    provides: core route truth coverage for onboarding, settings or accounts, and modpack flows
provides:
  - a reusable same-origin browser entry for milestone walkthroughs
  - recorded live evidence across the refreshed core launcher journey
  - a stabilized account skin route gate for repeated integration runs
affects: [phase-verification, browser-sanity, release-truth, documentation]
tech-stack:
  added: []
  patterns: [reusable-manual-verification-entry, cdp-browser-capture]
key-files:
  created:
    - manual-verification.html
    - src/verification/manual/ManualVerificationApp.tsx
    - src/verification/manual/main.tsx
    - src/verification/manual/mockEnvironment.ts
    - src/verification/manual/scenarios.tsx
    - src/verification/manual/views.ts
  modified:
    - src/components/SettingsPage.tsx
    - src/features/accounts/__tests__/AccountSkinsPage.test.tsx
key-decisions:
  - "Shipped a reusable Vite entry at manual-verification.html instead of another disposable phase-only harness."
  - "Kept the browser seam production-safe by mounting real route components against deterministic preload-compatible fixture data instead of branching product logic."
  - "Switched browser evidence capture to Chromium DevTools after direct headless dump-dom and screenshot commands stalled on the live page."
patterns-established:
  - "Milestone walkthroughs can reuse manual-verification.html with fixture-backed route scenarios instead of rebuilding ad hoc phase harnesses."
  - "When stdout-based Chromium capture is unstable on macOS, use the same live page through the DevTools protocol and record screenshots plus status JSON."
requirements-completed: [VER-01]
duration: 1h 18m
completed: 2026-04-13
---

# Phase 10 Plan 01: Manual Experience Verification And Release Truth Summary

**Reusable browser walkthrough entry with live core-route evidence across welcome, play, settings or accounts, and modpack flows**

## Performance

- **Duration:** 1h 18m
- **Started:** 2026-04-13T13:02:00+0300
- **Completed:** 2026-04-13T14:20:17+0300
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Landed a reusable `manual-verification.html` entry that mounts the refreshed launcher routes on deterministic fixture data instead of relying on disposable per-phase harnesses.
- Captured live core walkthrough evidence for `welcome`, `tour`, `dashboard`, `settings-accounts`, `modpack-list`, `modpack-browser`, `modpack-details`, `modpack-export`, and `modpack-add`, all with `ready:true`.
- Closed the only verification fallout by making `AccountSkinsPage.test.tsx` resilient to repeated account loads during the focused route suite.

## Task Commits

Each task was committed atomically:

1. **Task 1: Stabilize the reusable live-browser verification entry for core launcher flows** - `6c9e615` (`fix(10-01): add manual verification entry`)

**Plan metadata:** Recorded in the follow-up docs commit after this summary lands.

## Files Created/Modified

- `manual-verification.html` - exposes a same-origin Vite entry dedicated to milestone walkthroughs.
- `src/verification/manual/ManualVerificationApp.tsx` - renders the reusable verification shell, status block, and per-view navigation.
- `src/verification/manual/main.tsx` - seeds deterministic storage and mounts the walkthrough entry.
- `src/verification/manual/mockEnvironment.ts` - installs preload-compatible mock APIs and fixture state for accounts, modpacks, mirrors, statistics, and dialogs.
- `src/verification/manual/scenarios.tsx` - mounts the real launcher screens used in the Phase 10 core walkthrough and marks them ready from visible UI text.
- `src/verification/manual/views.ts` - centralizes the reusable manual-view registry and validation helpers.
- `src/components/SettingsPage.tsx` - accepts `initialTab` so walkthroughs can open the accounts seam directly without extra route scaffolding.
- `src/features/accounts/__tests__/AccountSkinsPage.test.tsx` - stabilizes the offline-account expectation under repeated account loads.

## Decisions Made

- Preferred a durable same-origin entry over direct navigation to the live app because the real launcher boot path is not deterministic enough for milestone evidence capture in this environment.
- Kept the fixture layer narrow and preload-shaped so the walkthrough still exercises real renderer components and route seams instead of separate demo components.
- Treated the failing account skin test as verification fallout, not product fallout, because the live route behavior was already correct and only the mock lifetime was brittle.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Direct headless Chromium `--dump-dom` and `--screenshot` runs stalled after navigating to the live page on this macOS machine. The workaround was to keep using real Chromium but drive it through the DevTools protocol and capture both the hidden status JSON and PNG screenshots from the same page.
- The focused route suite exposed a flaky offline-account test seam in `AccountSkinsPage.test.tsx`; replacing one-time mock results with stable per-test offline fixtures resolved it without changing runtime behavior.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 10-02 can reuse `manual-verification.html` and the same fixture-backed browser path for secondary surfaces instead of rebuilding another harness.
- The core launcher journey now has screenshot evidence recorded at:
  - `/tmp/fmcl-phase10-welcome.png`
  - `/tmp/fmcl-phase10-tour.png`
  - `/tmp/fmcl-phase10-dashboard.png`
  - `/tmp/fmcl-phase10-settings-accounts.png`
  - `/tmp/fmcl-phase10-modpack-list.png`
  - `/tmp/fmcl-phase10-modpack-browser.png`
  - `/tmp/fmcl-phase10-modpack-details.png`
  - `/tmp/fmcl-phase10-modpack-export.png`
  - `/tmp/fmcl-phase10-modpack-add.png`

---
*Phase: 10-manual-experience-verification-and-release-truth*
*Completed: 2026-04-13*
