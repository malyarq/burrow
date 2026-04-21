---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "07"
subsystem: manual-proof
tags: [manual-verification, react, resource-packs, shaders, proof-harness]
requires:
  - phase: 31-guided-content-browsers-and-capability-expansion
    provides: actionable guided recovery plus honest shader capability guidance from 31-01 through 31-06
provides:
  - direct guided resource-pack proof routes in the manual harness
  - direct guided shader proof routes in the manual harness
  - fallback, compatibility, and recovery fixtures that exercise the shipped Phase 31 launcher story
affects: [CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, manual-proof-harness]
tech-stack:
  added: []
  patterns: [self-driving manual proof fixtures, namespaced manual feature APIs with ipc resolve-path fallback]
key-files:
  created: [src/verification/manual/__tests__/guidedContentProof.test.tsx]
  modified: [src/verification/manual/scenarios.tsx, src/verification/manual/views.ts, src/verification/manual/mockEnvironment.ts, src/verification/manual/__tests__/views.test.ts, .planning/STATE.md, .planning/ROADMAP.md, .planning/REQUIREMENTS.md, docs/en/roadmap.md, docs/ru/roadmap.md]
key-decisions:
  - "Wave 7 proof now uses direct guided resource-pack and shader routes instead of treating the generic add-content screen as sufficient evidence."
  - "Manual proof fixtures should drive fallback and blocked-install states automatically so the harness exposes recoverable failure and capability messaging without extra operator setup."
patterns-established:
  - "Guided manual-proof pattern: mount the real AddModPage content type under deterministic mock APIs, then auto-drive one bounded interaction when the proof needs a recovery or compatibility state on screen."
requirements-completed: [CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04]
duration: not recorded
completed: 2026-04-21
---

# Phase 31 Plan 07: Guided Manual-Proof Harness Summary

**The manual verification harness now shows direct guided resource-pack and shader routes, including local fallback, shader capability guidance, and recoverable failure fixtures, instead of leaning on a generic add-content proof.**

## Accomplishments

- Added four explicit Phase 31 manual views for guided resource-pack browsing, resource-pack fallback recovery, guided shader browsing, and shader runtime-blocked recovery.
- Refreshed the manual mock environment so the harness serves resource-pack-specific and shader-specific catalog fixtures, namespaced resource-pack and shader APIs, and the `modpacks:resolvePath` IPC seam used by guided local fallback.
- Added a focused manual proof test that renders the real guided scenarios against the seeded mock environment and locks the direct resource-pack or shader fixture expectations plus the recovery states.
- Advanced Phase 31 tracking so Wave 7 is complete and only Plan 08 remains in the milestone.

## Verification

- Passed: `npx vitest run src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit`

## Commits

1. **Task 1: Refresh the manual guided-content proof harness for direct resource-pack and shader coverage** - not committed

**Plan metadata:** not committed because the worktree already contained unrelated local edits in the same plan-owned files before execution, including `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `docs/en/roadmap.md`, `docs/ru/roadmap.md`, `src/verification/manual/scenarios.tsx`, `src/verification/manual/views.ts`, and `src/verification/manual/mockEnvironment.ts`.

## Issues Encountered

- The first Wave 7 pass exposed a real harness gap: guided local fallback resolves through the raw `window.ipcRenderer` seam, so the manual environment had to add the `modpacks:resolvePath` channel and a compatible global `ipcRenderer` alias before the resource-pack recovery fixture could exercise the shipped code path.
- Browser-based manual walkthrough was not completed in this noninteractive execution environment. The refreshed routes and automated proof suite are green, but a human spot-check remains a residual release-signoff task if strict interactive evidence is required.

## Next Phase Readiness

- Plan 08 can now run the final bounded-scope regression lock against a manual harness that reflects the real Phase 31 launcher story instead of older resource-pack-heavy proof.
- No product behavior seams remain open in Wave 7; the remaining scope is validation and closeout discipline rather than new guided-content UI behavior.
