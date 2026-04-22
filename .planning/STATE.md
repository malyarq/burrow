---
gsd_state_version: 1.0
milestone: v0.7.0
milestone_name: Direct Feedback Closure And Interface Cohesion
status: Phase 36 gap execution is in progress; 36-05 through 36-07 are complete, revised settings fix plans 36-08 through 36-09 remain, and modpack spillover stays in inserted Phase 36.1
last_updated: "2026-04-22T20:53:00Z"
progress:
  total_phases: 6
  completed_phases: 4
  total_plans: 27
  completed_plans: 23
  percent: 85
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-22)

**Core value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.
**Current focus:** Close the still-open direct feedback gaps through one cohesion-first milestone instead of another narrowed polish pass.

## Current Position

- Active milestone: `v0.7.0` — Direct Feedback Closure And Interface Cohesion
- Latest shipped milestone: `v0.6.0` — Feedback-Driven Stabilization And Expansion
- Current phase: `36` — Settings Predictability And Shared Control Contract
- Current plan: `36-08` - pending gap-only execution to make advanced appearance controls produce visible effects instead of saved-but-inert state
- Status: Phase 36 UAT found 13 diagnosed gaps across settings shell nesting, preset visibility, shared control alignment, modpack workspace cohesion, and proof-route honesty. Settings-owned fixes now live in revised plans `36-05` through `36-09`, with `36-05` through `36-07` now complete and modpack spillover moved into inserted follow-up Phase `36.1`.
- Last activity: 2026-04-22 - completed `36-07` by centering the compact sidebar rail and making launcher utility actions label-safe

Progress: [████████░░] 85% of milestone `v0.7.0`

## Key Decisions

- `v0.7.0` uses the current direct-feedback audit as the primary planning contract rather than relying on the narrower `v0.6.0` requirement archive.
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
- Custom accent selection now uses the same chip contract as preset accents, with the native color input hidden behind the same visible button semantics instead of acting as an overlay exception.
- Phase 36 now has dedicated layout seams for appearance, downloads, and launcher, so control-family drift is no longer proven only through broader SettingsPage route tests.
- Embedded storage and statistics now share the same settings shell contract as downloads and launcher, so utility tabs no longer drift back into standalone dashboard framing.
- Phase 36 closeout proof now names duplicate-copy removal, preset predictability, aligned control geometry, and visible-effect scope explicitly instead of relying on preset-era shorthand.
- Phase 36 UAT proved that the initial settings closure overfit to automated seams: the remaining direct-feedback gaps are now captured as diagnosed root causes in `.planning/phases/36-settings-predictability-and-shared-control-contract/36-UAT.md` and grouped into the follow-up plans `36-05..36-09`.
- Checker review after UAT forced an ownership split: Phase 36 keeps only settings-owned fixes, while inserted Phase `36.1` holds modpack workspace and create-flow spillover so archived modpack/content requirements are not silently reopened inside the settings phase.
- `36-05` removes route-level settings helper copy entirely, keeps preset ancestry inside one compact appearance section, and demotes inner settings surfaces so the modal shell stays dominant.
- `36-06` makes presets own mode-specific accent defaults, preserves explicit accent overrides across preset changes, and repaints dashboard/sidebar shell surfaces with theme tokens.
- `36-07` puts the collapsed sidebar burger on the shared compact-control seam and adds utility-button geometry for long localized settings actions.

## Open Blockers

- No implementation blockers are recorded in planning state, but the original Phase 36 closure was invalidated by UAT and now requires the revised settings gap packet `36-05..36-09`.
- The direct feedback file is broader than the archived `v0.6.0` scoped requirements, so future closeout must prove against the feedback gaps themselves, not only internal requirement coverage.
- The current worktree is still dirty, so future milestone commits should isolate planning changes from unrelated local edits.
- Phase 32 still carries manual-only signoff debt: live sidebar readability, macOS traffic-light clearance and drag feel, and the fallback calmness walkthrough were not rerun interactively in this turn.
- Phase 33 still carries manual-only signoff debt: classic cold-start feel, desktop-width catalog compactness, and CTA geometry/product-feel were not rerun interactively in this turn.
- Phase 34 closeout still carries manual-only signoff debt: tab reachability at live desktop width, first-read runtime/dependency authority feel, and one-session cross-tab cohesion were not rerun interactively in this turn.
- Phase 35 closeout still carries manual-only signoff debt: live create/add feel, guided runtime clarity, and active-modpack switching calmness were not rerun interactively in this turn.
- Phase 36 is no longer in signoff-only state: UAT found diagnosed settings and modpack cohesion gaps, and the milestone cannot close until revised settings plans `36-05..36-09` and inserted follow-up Phase `36.1` are executed and retested.
- Phase 36 still has two settings-owned gap plans pending after `36-07`: visible advanced effects and proof-route behavior coverage.

## Accumulated Context

- Use `.planning/milestones/v0.6.0-ROADMAP.md`, `.planning/milestones/v0.6.0-REQUIREMENTS.md`, and `.planning/milestones/v0.6.0-MILESTONE-AUDIT.md` as the authoritative record of the shipped milestone.
- Use `.planning/milestones/v0.5.0-*` artifacts as the prior redesign baseline.
- Use the current direct-feedback audit as the milestone-owned gap list; if a visible complaint is still open, the roadmap should capture it explicitly instead of treating it as implied polish.
- Active milestone planning now lives in `.planning/REQUIREMENTS.md` and `.planning/ROADMAP.md`.
- Public roadmap docs should describe `v0.7.0` as the active planned milestone focused on direct feedback closure.

## Resume Point

- Next command: `$gsd-execute-phase 36 --gaps-only`
- Immediate next wave: execute `36-08` on top of the flattened shell, preset-runtime truth, and centered control geometry established by `36-05` through `36-07`
- After Phase 36 settings gap execution: rerun `$gsd-verify-work` on the live settings surface, then execute inserted Phase `36.1` for the modpack spillover packet
