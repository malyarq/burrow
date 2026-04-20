---
gsd_state_version: 1.0
milestone: v0.6.0
milestone_name: Feedback-Driven Stabilization And Expansion
current_phase: 29
current_phase_name: Modpack Workflow Simplification And Runtime Truth
current_plan: "04"
status: Phase `29` execution in progress with 3 of 4 plans complete
stopped_at: Completed 29-03-PLAN.md
last_updated: "2026-04-20T18:12:41+0300"
last_activity: 2026-04-20 - Completed Phase 29 Plan 03 by promoting config-first runtime truth and neutral dependency states
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 8
  completed_plans: 7
  percent: 88
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-20)

**Core value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.
**Current focus:** Execute the four approved plans for Phase `29` from the `v0.6.0` roadmap.

## Current Position

- Active milestone: `v0.6.0` — Feedback-Driven Stabilization And Expansion
- Latest shipped milestone: `v0.5.0` — Experience Reinvention And Brand Reset
- Current phase: Phase 29 — Modpack Workflow Simplification And Runtime Truth (in progress)
- Current plan: `29-04`
- Status: Phase 29 execution in progress; runtime truth and dependency semantics are now authoritative across dashboard and settings surfaces
- Last activity: 2026-04-20 - completed Phase 29 Plan 03 for config-first runtime summary authority and truthful dependency status semantics

Progress: [█████████░] 88% for the active milestone

## Decisions

- macOS main windows now use framed `hiddenInset` chrome so Electron owns the native traffic lights.
- Renderer title-bar chrome now follows `windowControlsIPC` for native-versus-custom control decisions.
- The app update banner remains ordered between the title bar and the shell-safe content seam.
- [Phase 28]: Critical shell surfaces now use the small app icon as a restrained identity seam while pack/runtime text carries orientation.
- [Phase 28]: Classic home and dashboard no longer render centered brand-wordmark hero blocks; launch context stays primary.
- [Phase 28]: Appearance guidance now lives in theme/accent copy instead of a separate launcher-brand explainer card.
- [Phase 28]: The shell banner now names launcher updates explicitly so modpack updates stay scoped to pack surfaces.
- [Phase 28]: Play remains the only route-primary details CTA; update review is a local secondary affordance.
- [Phase 28]: Startup shell surfaces stay pending until selected/classic runtime truth is hydrated instead of rendering hardcoded defaults.
- [Phase 28]: Missing index or config files now reuse persisted config or metadata truth before any 1.12.2/vanilla fallback is allowed.
- [Phase 29]: Approved execution now converges installed and remote catalog controls into one compact scanning seam with quieter cards.
- [Phase 29]: Approved execution now treats runtime summary as a config-first modpack-owned contract and create/add flows as committed async workflows with explicit recovery.
- [Phase 29]: Installed and remote catalogs now share `ModpackCatalogControls` so search, filters, reset, and inline status all follow one compact composition seam.
- [Phase 29]: Remote browser cards now prefer provider-derived Minecraft version summaries so both catalog surfaces expose only runtime version plus updated time before details.
- [Phase 29]: Modpack details now keep metadata, play, and tabs inside one compact hero seam so content stays reachable near the top of the route.
- [Phase 29]: Detail utility actions now live in a lighter support rail so play remains the only route-primary CTA.
- [Phase 29]: Runtime summary precedence is effective config first, metadata second, and launch fallback only when no modpack truth exists.
- [Phase 29]: Dependency summaries now expose explicit status badges so healthy states stay neutral instead of reading like warnings.

## Performance Metrics

- 2026-04-20 — Phase 28 Plan 01 — 9 min — 2 tasks — 7 files
- 2026-04-20 — Phase 28 Plan 02 — 6 min — 2 tasks — 10 files
- 2026-04-20 — Phase 28 Plan 03 — 5 min — 2 tasks — 11 files
- 2026-04-20 — Phase 28 Plan 04 — 5 min — 2 tasks — 11 files
- 2026-04-20 — Phase 29 Plan 01 — 9 min — 2 tasks — 9 files
- 2026-04-20 — Phase 29 Plan 02 — 7 min — 2 tasks — 6 files
- 2026-04-20 — Phase 29 Plan 03 — 3 min — 2 tasks — 7 files

## Session Info

- Last updated: 2026-04-20T18:12:41+0300
- Stopped at: Completed 29-03-PLAN.md
- Resume file: `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-04-PLAN.md`

## Accumulated Context

- Use `.planning/milestones/v0.5.0-ROADMAP.md` and `.planning/milestones/v0.5.0-REQUIREMENTS.md` as the authoritative shipped milestone record.
- Use `.planning/milestones/v0.5.0-MILESTONE-AUDIT.md` as the authoritative audit result for the archived redesign milestone.
- Use `docs/ru/product-feedback-2026-04-20.md` and `docs/ru/ui-qa-audit-2026-04-14.md` as the primary scope inputs for `v0.6.0`.
- `.planning/REQUIREMENTS.md` now holds 19 scoped `v0.6.0` requirements mapped one-to-one onto Phases 28-31.
- `.planning/ROADMAP.md` now tracks Phase 28 as complete and Phase 29 as in progress after completing Plan 29-03.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-CONTEXT.md` captures the locked decisions for Phase 29 planning.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-RESEARCH.md` captures the code-informed implementation guidance for Phase 29 planning.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-VALIDATION.md` defines the Nyquist validation contract for shared controls, runtime truth, and async recovery.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-01-PLAN.md` through `29-04-PLAN.md` are the approved execution plans for compact catalog controls, details tab reachability, runtime-summary authority, and create/add async stabilization.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-01-SUMMARY.md` is the authoritative execution record for the shared compact catalog controls shell and quieter installed/remote card summaries.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-02-SUMMARY.md` is the authoritative execution record for the compact details hero seam and detail tab reachability regressions.
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-03-SUMMARY.md` is the authoritative execution record for config-first runtime summary authority and truthful dependency status semantics.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-01-SUMMARY.md` is the authoritative execution record for the native macOS shell contract work.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-02-SUMMARY.md` is the authoritative execution record for shell restraint across sidebar, classic launcher surfaces, and appearance settings.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-03-SUMMARY.md` is the authoritative execution record for local-only modpack update visibility and shell/home regression coverage.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-04-SUMMARY.md` is the authoritative execution record for startup shell truth and persisted-runtime recovery on reopen.
- Unrelated local files such as `AGENTS.md`, local `*/AGENTS.md`, `.planning/config.json`, `new_screens/`, and `screens/` remain untouched.
