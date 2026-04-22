---
gsd_state_version: 1.0
milestone: v0.7.0
milestone_name: Direct Feedback Closure And Interface Cohesion
status: Phase 36 plan 02 complete; plan 03 next
last_updated: "2026-04-22T17:52:20Z"
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 20
  completed_plans: 18
  percent: 90
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-22)

**Core value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.
**Current focus:** Close the still-open direct feedback gaps from `docs/ru/product-feedback-2026-04-20.md` through one cohesion-first milestone instead of another narrowed polish pass.

## Current Position

- Active milestone: `v0.7.0` — Direct Feedback Closure And Interface Cohesion
- Latest shipped milestone: `v0.6.0` — Feedback-Driven Stabilization And Expansion
- Current phase: `36` — Settings Predictability And Shared Control Contract
- Current plan: `36-03` - align settings controls under one shared geometry and scope contract
- Status: Phase 36 execution is in progress; `36-01` landed the lighter shell contract, `36-02` made preset ancestry and reset semantics product-readable, and `36-03` next tackles shared control geometry
- Last activity: 2026-04-22 - completed `36-02` with a visible preset runtime summary, preserved mode switching across preset families, and product-facing preset predictability tests

Progress: [█████████░] 90% of milestone `v0.7.0`

## Key Decisions

- `v0.7.0` uses `docs/ru/product-feedback-2026-04-20.md` as the primary planning contract rather than relying on the narrower `v0.6.0` requirement archive.
- The new milestone is explicitly cohesion-first: subtraction, clarity, and manual product truth take priority over new capability growth.
- Phase `32` is intentionally narrower than the earlier shell-brand reset work: it closes the direct feedback gaps in sidebar readability, macOS shell truth, and fallback restraint before catalog and settings cleanup resume.
- Manual verification wording is now treated as a product-truth seam, because older closeout routes and descriptions had drifted away from the real feedback criteria.
- Native macOS icon resolution remains PNG-first for shell-owned surfaces, but the candidate order is now centralized so bootstrap and `BrowserWindow` creation cannot drift.
- Modpack details now use one route-owned runtime/dependency summary object, with explicit `unverified` semantics before config-backed confirmation.
- Screenshots now live inside the same secondary details workspace contract as Mods, Resource Packs, Shaders, and Worlds instead of rendering as a foreign host surface.
- Phase 35 is intentionally corrective, not expansive: it finishes the async and guided-content trust story left partially closed by Phases 29 and 31.
- Phase 35 closeout treats manual proof wording as part of product truth: fixed CTA rails, actionable recovery, guided runtime honesty, and active-modpack continuity must all be visible in review routes, not only in component tests.
- Phase 36 treats settings as the milestone-owned shared-control contract seam: the shell must lose duplicate copy, preset behavior must become product-readable, and tabs, toggles, sliders, and accent pickers must align under one geometry system.
- The settings shell now owns first-read summary copy; the tab rail exposes compact labels and preserved tab semantics instead of visible description cards.
- Embedded statistics keeps headings and data only, leaving repeated summary language to the shell-level contract.
- Preset-family changes now preserve the active light/dark mode once a preset is already selected, removing hidden mode jumps while keeping the same normalized theme state.
- Appearance now exposes one preset runtime summary with exact reset-target copy instead of scattering ancestry hints across badges and helper text.

## Open Blockers

- No implementation blockers are recorded in planning state.
- The direct feedback file is broader than the archived `v0.6.0` scoped requirements, so future closeout must prove against the feedback gaps themselves, not only internal requirement coverage.
- The current worktree is still dirty, so future milestone commits should isolate planning changes from unrelated local edits.
- Phase 32 still carries manual-only signoff debt: live sidebar readability, macOS traffic-light clearance and drag feel, and the fallback calmness walkthrough were not rerun interactively in this turn.
- Phase 33 still carries manual-only signoff debt: classic cold-start feel, desktop-width catalog compactness, and CTA geometry/product-feel were not rerun interactively in this turn.
- Phase 34 closeout still carries manual-only signoff debt: tab reachability at live desktop width, first-read runtime/dependency authority feel, and one-session cross-tab cohesion were not rerun interactively in this turn.
- Phase 35 closeout still carries manual-only signoff debt: live create/add feel, guided runtime clarity, and active-modpack switching calmness were not rerun interactively in this turn.
- Phase 36 live settings signoff is still pending: shell density and preset predictability are covered by targeted tests, but the updated appearance surface was not rerun interactively because browser automation remains blocked by local Chromium/crashpad limitations.

## Accumulated Context

- Use `.planning/milestones/v0.6.0-ROADMAP.md`, `.planning/milestones/v0.6.0-REQUIREMENTS.md`, and `.planning/milestones/v0.6.0-MILESTONE-AUDIT.md` as the authoritative record of the shipped milestone.
- Use `.planning/milestones/v0.5.0-*` artifacts as the prior redesign baseline.
- Use `docs/ru/product-feedback-2026-04-20.md` as the milestone-owned gap list; if a visible complaint is still open, the roadmap should capture it explicitly instead of treating it as implied polish.
- Active milestone planning now lives in `.planning/REQUIREMENTS.md` and `.planning/ROADMAP.md`.
- Public roadmap docs should describe `v0.7.0` as the active planned milestone focused on direct feedback closure.

## Resume Point

- Next command: `$gsd-execute-phase 36`
- Optional follow-up before that: rerun the live Phase 36 settings walkthrough once local browser automation is available, then continue with `36-03`.
