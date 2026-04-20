---
gsd_state_version: 1.0
milestone: v0.6.0
milestone_name: Feedback-Driven Stabilization And Expansion
current_phase: 28
current_phase_name: Product Restraint And Native Shell Truth
current_plan: "04"
status: Phase `28` is in progress with plans `28-01`, `28-02`, and `28-03` completed and `28-04` next
stopped_at: Completed 28-03-PLAN.md
last_updated: "2026-04-20T11:16:23Z"
last_activity: 2026-04-20 - Completed plan 28-03 for local-only modpack update urgency and marked SHELL-07 complete
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 4
  completed_plans: 3
  percent: 75
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-20)

**Core value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.
**Current focus:** Execute the four approved plans for Phase `28` from the `v0.6.0` roadmap.

## Current Position

- Active milestone: `v0.6.0` — Feedback-Driven Stabilization And Expansion
- Latest shipped milestone: `v0.5.0` — Experience Reinvention And Brand Reset
- Current phase: Phase 28 — Product Restraint And Native Shell Truth (in progress)
- Current plan: 04 of 04
- Status: Plans `28-01`, `28-02`, and `28-03` completed; continue Phase 28 execution with `28-04`
- Last activity: 2026-04-20 - completed Plan 28-03 and locked local-only modpack update urgency

Progress: [████████░░] 75% for the active milestone

## Decisions

- macOS main windows now use framed `hiddenInset` chrome so Electron owns the native traffic lights.
- Renderer title-bar chrome now follows `windowControlsIPC` for native-versus-custom control decisions.
- The app update banner remains ordered between the title bar and the shell-safe content seam.
- [Phase 28]: Critical shell surfaces now use the small app icon as a restrained identity seam while pack/runtime text carries orientation.
- [Phase 28]: Classic home and dashboard no longer render centered brand-wordmark hero blocks; launch context stays primary.
- [Phase 28]: Appearance guidance now lives in theme/accent copy instead of a separate launcher-brand explainer card.
- [Phase 28]: The shell banner now names launcher updates explicitly so modpack updates stay scoped to pack surfaces.
- [Phase 28]: Play remains the only route-primary details CTA; update review is a local secondary affordance.

## Performance Metrics

- 2026-04-20 — Phase 28 Plan 01 — 9 min — 2 tasks — 7 files
- 2026-04-20 — Phase 28 Plan 02 — 6 min — 2 tasks — 10 files
- 2026-04-20 — Phase 28 Plan 03 — 5 min — 2 tasks — 11 files

## Session Info

- Last updated: 2026-04-20T11:16:23Z
- Stopped at: Completed 28-03-PLAN.md

## Accumulated Context

- Use `.planning/milestones/v0.5.0-ROADMAP.md` and `.planning/milestones/v0.5.0-REQUIREMENTS.md` as the authoritative shipped milestone record.
- Use `.planning/milestones/v0.5.0-MILESTONE-AUDIT.md` as the authoritative audit result for the archived redesign milestone.
- Use `docs/ru/product-feedback-2026-04-20.md` and `docs/ru/ui-qa-audit-2026-04-14.md` as the primary scope inputs for `v0.6.0`.
- `.planning/REQUIREMENTS.md` now holds 19 scoped `v0.6.0` requirements mapped one-to-one onto Phases 28-31.
- `.planning/ROADMAP.md` now tracks Phase 28 as in progress with `28-01` and `28-02` complete and `28-03` next.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-01-SUMMARY.md` is the authoritative execution record for the native macOS shell contract work.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-02-SUMMARY.md` is the authoritative execution record for shell restraint across sidebar, classic launcher surfaces, and appearance settings.
- `.planning/phases/28-product-restraint-and-native-shell-truth/28-03-SUMMARY.md` is the authoritative execution record for local-only modpack update visibility and shell/home regression coverage.
- Unrelated local files such as `AGENTS.md`, local `*/AGENTS.md`, `.planning/config.json`, `new_screens/`, and `screens/` remain untouched.
