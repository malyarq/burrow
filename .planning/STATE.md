---
gsd_state_version: 1.0
milestone: v0.4.0
milestone_name: launcher-truth-and-product-polish
status: defining_requirements
stopped_at: defining milestone requirements for v0.4.0
last_updated: "2026-04-14T17:43:04Z"
last_activity: 2026-04-14 - Milestone v0.4.0 started
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-14)

**Core value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.
**Current focus:** Defining milestone v0.4.0 Launcher Truth And Product Polish

## Current Position

Phase: Not started (defining requirements)
Plan: -
Status: Defining requirements
Last activity: 2026-04-14 - Milestone v0.4.0 started

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 63
- Active phase plans completed: 17
- Average duration: 16 min
- Total execution time: 4.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 7. UI System Foundations | 4 | 1.1h | 17 min |
| 8. Core Route Rollout And UI Correctness | 4 | 1.4h | 21 min |
| 9. Secondary Surface Alignment And UX Polish | 5 | 1.5h | 18 min |
| 10. Manual Experience Verification And Release Truth | 4 | 1.8h | 27 min |
| 11. Adaptive Layout And Interaction Foundations | 4 | 1.0h | 15 min |
| 12. Theme Truth And Settings IA Simplification | 4 | 0.9h | 14 min |
| 13. Launch Trust And Modpack Workflow Ergonomics | 5 | 1.2h | 14 min |
| 14. Manual Verification And Release Truth | 4 | 0.9h | 14 min |

**Recent Trend:**
- Last 5 plans: 13-04, 13-05, 14-01, 14-02, 14-03
- Trend: v0.3.0 is archived; v0.4.0 begins as a screenshot-audited bug-fix and polish milestone on the shipped launcher surface

*Updated after each plan completion*
- Previous milestone totals retained below as historical context

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 1: Restore reliability and security guardrails before landing more release work.
- Phase 2: Add the automated test safety net before extending persisted launcher domains.
- Phase 2 Wave 1: Keep Vitest node-first and opt into jsdom per test file instead of making the whole suite browser-like.
- Phase 2 Wave 2: Use temp roots and narrow Electron or download mocks for service coverage instead of refactoring the services around the tests.
- Phase 3 Wave 1: Preserve browser sessions in typed navigation entries instead of introducing a global modpack-browser store.
- Phase 3 Wave 1: Fix metadata truth inside instance CRUD while exposing rename and duplicate more prominently from installed cards.
- Phase 3 Wave 2: Make modpack browser history and favorites provider-aware instead of assuming `projectId` is globally unique.
- Phase 3 Wave 2: Fix Modrinth alphabetical pagination at the service boundary by collecting, sorting, and slicing the full hit set.
- Phase 4 Wave 1: Keep remote image caching in the main process and route renderer consumers through the shared `LazyImage` seam plus launcher settings controls.
- Phase 4 Wave 1: Keep account skin work at provider-aware preview, refresh, and direct provider-site handoff instead of expanding launcher auth for in-app uploads in this phase.
- Phase 4 Wave 2: Treat persisted mirror order as the runtime fallback order for auto downloads instead of a cosmetic settings preference.
- Phase 4 Wave 2: Keep statistics analytics local by extending `statistics.json` with daily history buckets and deriving rankings plus trends in the main process.
- Phase 4 Wave 3: Keep release-gate fallout limited to allowlist and contracts-map drift caused directly by new Phase 4 IPC channels.
- Phase 5: Hold documentation parity and final release truth checks until shipped behavior is stable.
- Phase 5 Wave 1: Keep dialog semantics and settings-tab behavior in shared shell components so later surfaces inherit accessibility fixes instead of reimplementing them.
- Phase 5 Wave 1: Make launcher and modpack cards keyboard-usable by adding explicit activators and menu semantics in the existing layouts instead of redesigning those flows.
- Phase 5 Wave 2: Respect reduced-motion preferences by disabling decorative dashboard and background motion entirely rather than trying to partially animate those surfaces.
- Phase 5 Wave 2: Bring Phase 4 settings screens onto shared theme tokens and shared modal semantics instead of leaving dark-only styling and custom dialog behavior in place.
- Phase 5 Wave 3: Refresh README, roadmap checklists, and contract maps from the live preload and IPC surfaces instead of preserving stale release promises.
- Phase 5 Wave 4: Treat the final repo-wide gate as a fallout-only wave; if it passes cleanly, close the milestone without adding unnecessary churn.
- Phase 6: Close the remaining audit-discovered mirror-runtime split, incomplete image-cache rollout, stale roadmap claims, and account-skin wording drift before reconstructing verification and rerunning the milestone audit.
- [Phase 06]: Normalize legacy downloadProvider persistence to compatibility-only state and keep runtime mirror selection on persisted mirror order.
- [Phase 06]: Reuse LazyImage with bundled fallback art on the remaining shipped modpack surfaces instead of adding a second image cache path.
- [Phase 06]: Treat ACCT-01 as the shipped preview, refresh, and provider-site handoff contract until a broader provider-auth flow exists.
- [Phase 06]: Rebuild verification artifacts from shipped summaries and validation records while preserving real residual blockers instead of flattening them into blanket completion.
- [Phase 06]: Treat Phase 6 recovery summaries as the closure evidence for blocker debt preserved in reconstructed phase verification files
- [Phase 06]: Roll REQUIREMENTS.md forward before rerunning the milestone audit so the rerun reflects the verified shipped state
- Milestone v0.2.0: Go system-first on UI work, allow strong UX redesign inside the existing launcher architecture, and require manual browser testing as part of completion
- [Phase 07]: Keep the UI-system rollout foundation-first by stabilizing primitives, shell, and document theme seams before broad route redesign.
- [Phase 07]: Treat live browser renders as required evidence for foundation work, but record environment-level browser scripting limits explicitly instead of hiding them.
- [Phase 08]: Treat route rollout as owner-surface work, not a router rewrite; preserve the state-driven app structure while aligning the highest-traffic flows.
- [Phase 08]: Fix route truth as part of UI work, especially misleading onboarding guidance and any modpack actions that promise behavior they do not perform.
- [Phase 08]: Route quick actions, settings/accounts copy, and provider-aware skin actions should ship together with seam-level tests so refreshed surfaces stay behaviorally honest.
- [Phase 08]: Close the phase on integrated route gates plus recorded live browser sanity, and keep any extra fallout limited to verification seams instead of reopening route polish.
- [Phase 09]: Treat the remaining launcher debt as owner-surface rollout across share/screenshots, settings utilities, and content-management tabs instead of generic global polish.
- [Phase 09]: Close A11Y-04 explicitly across the updated secondary surfaces, with a dedicated accessibility or atmosphere slice rather than assuming Phase 7 foundations are enough.
- [Phase 09]: Keep Phase 9 browser sanity narrow and surface-owned so Phase 10 still owns the milestone-wide walkthrough and release-truth claims.
- [Phase 09]: Close the phase on focused seam tests, repo gates, and temporary same-origin browser sanity evidence instead of pulling broader release messaging into the execution wave.
- [Phase 10]: Reuse one same-origin manual verification entry across core and secondary walkthroughs instead of building phase-specific browser harnesses.
- [Phase 10]: Refresh public docs from walkthrough evidence first, then mark the milestone complete only after the packaging-aware gate passes.
- [Phase 11]: Express adaptive layout through shared shell and control seams rather than per-screen breakpoint fixes.
- [Phase 11]: Fix overlay overflow with one anchored overlay contract reused by tooltips, onboarding, and installed-modpack actions.
- [Phase 11]: Replace placeholder-feeling logo reuse with one shipped launcher mark shared by classic surfaces and fallback seams.
- [Phase 12]: Persist preset identity separately from custom theme overrides and infer it once from legacy preset-shaped storage for brownfield-safe migration.
- [Phase 12]: Resolve the full document token contract from preset mode variants so applying a preset repaints shell, overlay, helper-text, and border tokens immediately.
- [Phase 12]: Reuse shared semantic theme seams for contrast cleanup instead of per-screen zinc/white overrides.
- [Phase 12]: Lock preset readability with focused DOM-class regression tests on the highest-risk settings and modpack import surfaces.
- [Phase 12]: Drive settings tab labels, descriptions, and panel hints from shared metadata so the shell stays consistent.
- [Phase 12]: Expose presets, language, accent, launch behavior, mirrors, and tuning in the first visible card groups while leaving low-frequency controls secondary.
- [Phase 12]: Flatten utility settings by pairing current state with the main action instead of adding nested routes or extra tab layers.
- [Phase 12]: Close the phase on reviewed dark and light preset screenshots plus focused navigation and accounts tests when the direct settings-path Chromium capture is machine-flaky.
- [Phase 13]: Promote launch-trust from one generic loading state to an explicit stage model shared by launcher hooks, dashboard, and shared launch controls.
- [Phase 13]: Keep create-modpack dependency truth bound to the persisted manifest data instead of layering a pretty but lossy summary over malformed state.
- [Phase 13]: Improve remote modpack browsing through clearer scan and filter context plus honest provider availability messaging without rewriting the platform browser subsystem.
- [Phase 13]: Rebalance installed-card actions around the next likely user task while reusing the anchored-overlay contract from Phase 11 instead of reopening placement work.
- [Phase 13]: Close on focused seam tests plus reviewed browser evidence, and keep closeout fallout limited to verification seams such as legacy bootstrap cleanup.
- [Phase 14]: Reuse the existing `manual-verification.html` seam for milestone closeout instead of inventing another phase-specific browser harness.
- [Phase 14]: Capture bounded future parity opportunities from live evidence, but keep Phase 14 execution limited to closure blockers plus release-truth docs and final gating.

### Pending Todos

[From .planning/todos/pending/ - ideas captured during sessions]

None yet.

### Blockers/Concerns

- Final gate for `v0.3.0` is green, including `npm run build -- --publish never`.
- `docs/ru/ui-qa-audit-2026-04-14.md` records 12 screenshot-backed UI or truth defects that now define the starting bug pool for `v0.4.0`.
- Packaging still emits non-blocking warnings for large renderer chunks and missing `package.json` metadata (`description`, `author`).
- Workflow metadata still has drift: `gsd-tools init milestone-op` reports stale `v0.2`, and phase 13 or 14 summary frontmatter uses `requirements:` instead of `requirements_completed:`.
- `.planning/config.json` remains an unrelated local modification and is intentionally excluded from phase commits.

## Session Continuity

Last session: 2026-04-14T17:43:04Z
Stopped at: defining milestone requirements for v0.4.0
Resume file: .planning/PROJECT.md
