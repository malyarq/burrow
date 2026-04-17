---
gsd_state_version: 1.0
milestone: v0.5
milestone_name: milestone
current_phase: 21
current_phase_name: 21-dense-surface-ia-navigation-and-cta-hierarchy
current_plan: 4
status: complete
stopped_at: Completed 21-04-PLAN.md
last_updated: "2026-04-17T23:42:48.636Z"
last_activity: 2026-04-18 - Completed Phase 21 plan 04 crowded proof fixtures and focused density closeout
progress:
  total_phases: 6
  completed_phases: 3
  total_plans: 12
  completed_plans: 12
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-17)

**Core value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.
**Current focus:** Phase 21 is complete after landing 21-04 crowded proof fixtures and focused density closeout; the next step is planning Phase 22 theme truth and interaction-state fidelity work.

## Current Position

Current Phase: 21
Current Phase Name: 21-dense-surface-ia-navigation-and-cta-hierarchy
Current Plan: 4
Total Phases: 6
Total Plans in Phase: 4
Phase: 21
Plan: 04
Status: Complete
Last activity: 2026-04-18 - Completed Phase 21 plan 04 crowded proof fixtures and focused density closeout

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 81
- Active phase plans completed: 36
- Average duration: 16 min
- Total execution time: 6.0 hours

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
- Last 5 plans: 20-04, 21-01, 21-02, 21-03, 21-04
- Trend: Phase 21 closed on crowded shell proof and focused density regression coverage, clearing the way for Phase 22 theme and interaction-state work.

*Updated after each plan completion*
- Previous milestone totals retained below as historical context

**Recent plan metrics**

| Plan | Duration | Tasks | Files |
| --- | --- | --- | --- |
| Phase 17 P01 | 8 min | 2 tasks | 4 files |
| Phase 17 P02 | 7 min | 2 tasks | 2 files |
| Phase 17 P03 | 8 min | 2 tasks | 10 files |
| Phase 17 P04 | 11 min | 2 tasks | 5 files |
| Phase 18 P01 | 4 min | 2 tasks | 2 files |
| Phase 18 P02 | 10 min | 2 tasks | 5 files |
| Phase 18 P03 | 11 min | 2 tasks | 6 files |
| Phase 18 P04 | 11 min | 1 task | 2 files |
| Phase 19 P01 | 5 min | 2 tasks | 6 files |
| Phase 19 P02 | 12 min | 2 tasks | 8 files |
| Phase 19 P03 | 11 min | 2 tasks | 13 files |
| Phase 19 P04 | 11 min | 2 tasks | 3 files |
| Phase 20 P01 | 18 min | 2 tasks | 17 files |
| Phase 20 P02 | 6 min | 2 tasks | 11 files |
| Phase 20 P03 | 6 min | 2 tasks | 14 files |
| Phase 20 P04 | 10 min | 2 tasks | 3 files |
| Phase 21 P01 | 7 min | 2 tasks | 7 files |
| Phase 21 P02 | 5 min | 2 tasks | 8 files |
| Phase 21 P03 | 10 min | 2 tasks | 9 files |
| Phase 21 P04 | 10min | 2 tasks | 3 files |

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
- [Phase 15]: Reuse the bundled launcher mark through the shared `LazyImage` seam instead of letting the classic hero fail open on missing art.
- [Phase 15]: Treat pending launch config as the visible source of truth for classic loader or version summary, and let structured runtime state stay authoritative over supporting logs.
- [Phase 15]: Keep advanced settings visible during active launch work by rendering them read-only on the classic surface instead of hiding them behind a blocking state.
- [Phase 17]: Reused LazyImage's launcher-mark default instead of passing '/icon.png' from catalog surfaces.
- [Phase 17]: Guarded the sidebar-width catalog fix with focused ergonomics assertions on the installed and remote filter shells.
- [Phase 17]: Replaced the collapsed modpacks placeholder letter with icon-led compact navigation so both launcher modes share one intentional shell language.
- [Phase 17]: Hardened the settings shell with curated fallback copy for high-risk tab summaries and hints instead of trusting raw translator misses to stay hidden.
- [Phase 17]: Localized preset display names through stable preset IDs so appearance labels and exported summaries can change per language without breaking persistence.
- [Phase 17]: Closed proof on a dedicated `manual-verification.html?view=phase-17-polish` route instead of introducing another phase-specific browser harness.
- [Phase 17]: Treated repo-wide closeout fallout as a test-alignment fix for shipped fallback labels, not as a reason to reopen settings-shell behavior.
- [Phase 18]: Make 18-VALIDATION.md the authoritative v0.4.0 requirement-to-seam map instead of relying on phase-memory summaries.
- [Phase 18]: Use `LaunchControls.status.test.tsx` as the LAUNCH-03/04 owner seam by deriving visible launch copy through the active translator instead of hard-coded English fixtures.
- [Phase 18]: Seed the `modpack-details` manual seam directly from deterministic metadata and expanded-mod fixtures instead of relying on post-mount click automation or live IPC.
- [Phase 18]: Capture closeout browser proof through an isolated local CDP Chromium session so `dashboard`, `modpack-details`, and `phase-17-polish` all produce reusable screenshot and DOM artifacts.
- [Phase 18]: Fix only bounded release metadata in `package.json` during the final gate and carry the renderer chunk warning as an explicit residual instead of reopening performance scope.
- [Phase 19]: AppLayout owns the post-title-bar safe area so overlays, routes, and the split inherit one shared shell contract.
- [Phase 19]: Sidebar collapse moved into SidebarHeader so the sidebar no longer needs an absolute top strip with local pt-6 compensation.
- [Phase 19]: ModpackRouter owns shell-versus-route CTA classification and publishes it through a shared seam so Sidebar can demote launch without route-aware button logic.
- [Phase 19]: Modpack details expose update as the sole route-primary action when available and keep play as a secondary action instead of competing primaries.
- [Phase 19]: Dense routes and add-content flows now end in one owning page or modal scroll instead of footer-like action rows.
- [Phase 19]: Shared Modal exposes its body as the dense-content scroll region so add-content helpers, results, and final actions stay in one flow.
- [Phase 19]: Phase 19 proof states should mount the real title bar and sidebar chrome instead of isolated route children so shell clearance and CTA hierarchy stay observable.
- [Phase 19]: Import preview proof can reuse the shared manual manifest fixture instead of a view-local stub or empty fallback.
- [Phase 19]: When the planned regression matrix is already green and scope-aligned, record it as a verification-only task commit instead of inventing churn in stable tests.
- [Phase 20]: Keep the canonical brand seam in src/app/assets/branding.ts and src/components/branding/* instead of introducing a parallel branding store.
- [Phase 20]: Extend CustomThemeConfig with brand tokens so product-owned shell and mark styling rides the existing theme-document pipeline.
- [Phase 20]: Use TitleBar and the classic home/dashboard surfaces as proof consumers for Phase 20 without absorbing the broader shell migration planned later in the phase.
- [Phase 20]: Shell-owned brand surfaces now consume BrandLockup or BrandMark plus BrandWordmark instead of raw FriendLauncher headings.
- [Phase 20]: Classic launcher-home keeps pack metadata secondary while the canonical product mark and wordmark remain the primary shell identity.
- [Phase 20]: Appearance settings explain accent as highlight personalization while FMCL mark, wordmark, and shell surfaces stay product-owned.
- [Phase 20]: Missing content artwork now defaults to the neutral media fallback at the LazyImage seam instead of the launcher mark or app icon.
- [Phase 20]: Planned artwork slots render through LazyImage even when source URLs are absent so route surfaces no longer hide placeholders or override them with `/icon.png`.
- [Phase 20]: Phase 20 plan 03 stays limited to fallback truth and route adoption, leaving richer degraded-state copy and error handling to Phase 23.
- [Phase 20]: Reused the existing manual verification shell and status JSON instead of adding a Phase 20-only harness.
- [Phase 20]: Used ResourcePacksTab as the deep media proof representative because it exercises LazyImage fallback truth directly inside real shell chrome.
- [Phase 20]: Recorded task 2 as a verification-only empty commit because the planned Phase 20 regression matrix was already green and scope-aligned.
- [Phase 21]: Replaced wrap-prone filter rows with grouped filter grids so dense desktop widths keep one readable control structure instead of orphaned selects.
- [Phase 21]: Kept Phase 19 card ownership intact by preserving card activation while adding one explicit primary CTA and labeled metadata blocks per catalog card.
- [Phase 21]: Used crowded long-title fixtures in browser and installed tests rather than broad visual rewrites, keeping the phase scoped to density truth.
- [Phase 21]: Let the shared Modal body own world-datapack scrolling and replace raw dense ratios with labeled summary cards on representative secondary tabs.
- [Phase 21]: Extended modpackRuntimeDependencies.ts and ModpackDependencySummary.tsx into the single create/edit runtime-summary contract instead of adding a settings-only summary path.
- [Phase 21]: Sanitized runtime loader edits in useModpackDetailsConfig so loader switches clear stale loader versions and incompatible OptiFine state before header or settings surfaces can drift.
- [Phase 21]: Added dedicated Phase 21 proof views instead of overloading legacy manual routes so crowded-shell closeout states are directly reviewable.
- [Phase 21]: Seeded create and edit proof from one shared runtime fixture and used a harness-only wizard priming helper instead of widening product props beyond the plan-owned manual seam.

### Pending Todos

[From .planning/todos/pending/ - ideas captured during sessions]

None yet.

### Blockers/Concerns

- Phase 21 is underway; later plans should preserve the grouped catalog density contract and avoid reopening Phase 19/20 shell, CTA, or fallback seams.
- The milestone archive relies on `.planning/phases/18-verification-and-release-truth/18-VERIFICATION.md` because no standalone `v0.4.0-MILESTONE-AUDIT.md` was created before completion.
- The only intentionally carried product-adjacent debt is the non-blocking large renderer chunk warning from the build.
- `.planning/config.json` remains an unrelated local modification and is intentionally excluded from milestone commits.

## Session Continuity

Last session: 2026-04-17T23:42:48.633Z
Stopped at: Completed 21-04-PLAN.md
Resume file: None
