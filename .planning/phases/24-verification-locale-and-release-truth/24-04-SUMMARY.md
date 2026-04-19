---
phase: 24-verification-locale-and-release-truth
plan: "04"
subsystem: release-truth
tags: [docs, release, verification, playwright, build]
requires:
  - phase: 24-01
    provides: v0.5.0 closeout registry and deterministic manual verification foundation
  - phase: 24-02
    provides: representative degraded proof and explicit closeout comparison pairs
  - phase: 24-03
    provides: committed screenshot regression lane and authoritative validation map
provides:
  - synchronized README, EN/RU roadmap, planning roadmap, requirements, and state truth for v0.5.0
  - audit-ready Phase 24 verification artifact
  - green final gate on tests, lint, typecheck, packaged build, and strict closeout screenshots
affects: [release-truth, milestone-closeout, final-gate]
tech-stack:
  added: []
  patterns: [release-truth sync, bounded closeout fallout, audit-ready verification artifact]
key-files:
  created:
    - .planning/phases/24-verification-locale-and-release-truth/24-04-SUMMARY.md
  modified:
    - README.md
    - docs/en/roadmap.md
    - docs/ru/roadmap.md
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md
    - .planning/STATE.md
    - .planning/phases/24-verification-locale-and-release-truth/24-VALIDATION.md
    - .planning/phases/24-verification-locale-and-release-truth/24-VERIFICATION.md
    - package.json
    - package-lock.json
    - src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx
    - src/verification/manual/scenarios.tsx
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-home-closeout-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-modpacks-closeout-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-degraded-closeout-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-locale-en-chromium-darwin.png
    - tests/visual/manual-closeout.spec.ts-snapshots/phase-24-locale-ru-chromium-darwin.png
key-decisions:
  - "Treated stale `0.4.0` package metadata as a Phase 24 closure blocker because it leaked directly into packaged output paths and screenshot truth."
  - "Kept closeout fallout bounded to release-truth drift, one stale accessibility assertion, and screenshot reseeding caused by the version correction."
  - "Published `24-VERIFICATION.md` as the single audit artifact linking closeout views, commands, docs, and bounded residuals."
patterns-established:
  - "Final milestone closure now depends on the same named manual matrix and screenshot lane already used during execution instead of one-off release notes."
  - "Release docs and planning state are updated from proven closeout evidence before phase closure, preventing roadmap or README drift after the gate is already green."
requirements-completed: [VER-01, VER-02, VER-03, VER-04]
duration: 22 min
completed: 2026-04-19
---

# Phase 24 Plan 04: Release Truth And Final Closeout Gate

**Closed Phase 24 on synchronized `v0.5.0` release truth, a published verification artifact, and a green final repo-plus-screenshot gate.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-04-19T21:56:00+03:00
- **Completed:** 2026-04-19T22:18:00+03:00
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Rewrote README, EN/RU roadmap docs, planning roadmap, requirements, and state so they now describe the actual `phase-24-*` closeout set and the committed screenshot lane instead of stale `v0.4.0` language.
- Corrected exposed package metadata to `0.5.0`, which moved packaged build output to `release/0.5.0/` and aligned screenshot truth with the shipped milestone version.
- Published `24-VERIFICATION.md` as the audit-ready artifact tying together closeout view ids, final commands, docs truth, and bounded residuals.
- Closed the full gate on `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build -- --publish never`, and `npm run test:visual:closeout`.

## Task Commits

Each task was committed atomically:

1. **Task 1-2: Close release truth and the final gate** - `d533201` (feat)

## Files Created/Modified

- `README.md`, `docs/en/roadmap.md`, `docs/ru/roadmap.md` - refreshed public milestone truth around the named Phase 24 closeout views and screenshot lane.
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md` - marked Phase 24 complete, rolled verification requirements to complete, and moved the milestone state to ready-for-closure.
- `package.json`, `package-lock.json` - corrected the exposed app version to `0.5.0`.
- `.planning/phases/24-verification-locale-and-release-truth/24-VALIDATION.md` - marked the final docs audit and full gate green.
- `.planning/phases/24-verification-locale-and-release-truth/24-VERIFICATION.md` - published the final audit artifact.
- `src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx` - updated a stale search assertion to match the shipped `search region + textbox` accessibility contract.
- `src/verification/manual/scenarios.tsx` - removed the last hard-coded `0.4.0` version string from the legacy manual proof seam.
- `tests/visual/manual-closeout.spec.ts-snapshots/*` - reseeded the affected screenshot baselines after the version-truth correction changed visible sidebar build metadata.

## Decisions Made

- Treated the old package version as a real release blocker because it changed packaged output paths and visible build text, not as “just metadata”.
- Fixed the final failing a11y test by aligning it with the current accessible contract instead of mutating the product surface to satisfy a stale assertion.
- Kept the only named residual as the pre-existing large renderer chunk warning, since the build still passes and the milestone does not own chunking work.

## Deviations from Plan

- The final strict screenshot run briefly failed after the `0.5.0` metadata correction because several closeout views expose the sidebar build label. The baselines were intentionally reseeded to the final release truth before re-running the strict lane.

## Issues Encountered

- `npm test` initially failed on a stale `ModpackBrowser.a11y.test.tsx` expectation that looked for role `search` using the textbox placeholder as the accessible name.
- The first final build packaged to `release/0.4.0/`, exposing that `package.json` still leaked the previous milestone version.

## User Setup Required

None.

## Next Phase Readiness

- Phase 24 is complete.
- The milestone is ready for the archive/closure workflow rather than additional implementation.

## Self-Check: PASSED

- Found `.planning/phases/24-verification-locale-and-release-truth/24-04-SUMMARY.md`
- Found commit `d533201`
- `rg -n 'v0\\.5\\.0|Phase 24|phase-24-|manual-closeout|Playwright|closeout gate' README.md docs/en/roadmap.md docs/ru/roadmap.md .planning/ROADMAP.md .planning/REQUIREMENTS.md .planning/STATE.md package.json`
- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`
- `npx playwright test tests/visual/manual-closeout.spec.ts --project=chromium --update-snapshots`
- `npm run test:visual:closeout`

---
*Phase: 24-verification-locale-and-release-truth*
*Completed: 2026-04-19*
