# Roadmap: FriendLauncher (FMCL)

## Milestone Status

**Active milestone:** `v0.6.0` — Feedback-Driven Stabilization And Expansion
**Latest shipped milestone:** `v0.5.0` — Experience Reinvention And Brand Reset (`2026-04-20`)
**Next step:** Execute Phase 29 Plan 04

## Latest Archive

`v0.5.0` shipped FMCL's redesign-quality reset across shell invariants, brand and fallback language, dense modpack IA, theme and locale fidelity, degraded-state productization, deterministic closeout proof, and final audit-trail cleanup.

Archive:
- Roadmap: `.planning/milestones/v0.5.0-ROADMAP.md`
- Requirements: `.planning/milestones/v0.5.0-REQUIREMENTS.md`
- Audit: `.planning/milestones/v0.5.0-MILESTONE-AUDIT.md`

## Active Milestone

### v0.6.0 Feedback-Driven Stabilization And Expansion

`v0.6.0` is the active milestone and stays bounded to one truthful release story: reduce shell and workflow weirdness from shipped feedback, restore trust in modpack and settings behavior, then add only the constrained guided content expansion that depends on that earlier cleanup.

## Proposed Phases

### Phase 28: Product Restraint And Native Shell Truth

**Goal:** Remove top-level launcher noise, restore native shell behavior where the platform expects it, and make reopened app state match the user's real runtime context before deeper workflow cleanup begins.
**Owns requirements:** `SHELL-05`, `SHELL-06`, `SHELL-07`, `SHELL-08`
**Execution progress:** 4/4 plans complete (`28-01` through `28-04` complete)

**Observable success criteria:**

- macOS users no longer see duplicate or competing custom chrome alongside native traffic-light controls.
- Critical shell and fallback surfaces use restrained app identity instead of loud branding standing in for missing content.
- Modpack update urgency appears only on the relevant modpack list and detail surfaces, not as global launcher alarm.
- Reopening or restarting the launcher restores the actual selected profile and runtime state instead of stale defaults.

### Phase 29: Modpack Workflow Simplification And Runtime Truth

**Goal:** Make the core modpack browse, detail, dependency, and creation seams smaller, clearer, and grounded in one authoritative runtime summary rather than split renderer interpretations.
**Owns requirements:** `MODPACK-01`, `MODPACK-02`, `MODPACK-03`, `MODPACK-04`, `MODPACK-05`, `MODPACK-06`
**Execution progress:** 3/4 plans complete (`29-01` through `29-03` complete; `29-04` planned)

**Observable success criteria:**

- Installed and browsed modpacks share one compact search and filter composition without clipped or vertically stacked controls.
- Modpack cards surface only high-value summary information, and detail tabs stay reachable without scrolling past oversized summary or action blocks.
- List, detail, and launch-adjacent surfaces all read from one authoritative loader, version, dependency, and runtime summary.
- Dependency colors and copy distinguish healthy, warning, and broken states consistently enough that users can trust the status at a glance.
- Create-modpack and add-mod flows keep stable confirmation actions and explain failures without silent errors, flicker, or reload-style recovery.

### Phase 30: Settings Truth And Honest Personalization

**Goal:** Restore trust in settings before adding any bounded personalization by making preset themes deterministic, control geometry consistent, and appearance controls honest about what they change.
**Owns requirements:** `SETTINGS-01`, `SETTINGS-02`, `SETTINGS-03`, `SETTINGS-04`

**Observable success criteria:**

- Switching preset themes produces an immediate, deterministic visual result without hidden dark or light mode coupling.
- Settings controls, labels, and navigation follow one consistent geometry and alignment system across the settings surface.
- Appearance controls that do not create a meaningful visible effect are removed or clearly explain their scope.
- `CUSTOM-01` lands only as a bounded follow-up on top of already truthful and stable settings behavior.

### Phase 31: Guided Content Browsers And Capability Expansion

**Goal:** Make resource-pack and shader management feel first-class inside FMCL through guided in-app flows, compatibility guidance, and recoverable failures without turning the launcher into a broad marketplace.
**Owns requirements:** `CONTENT-01`, `CONTENT-02`, `CONTENT-03`, `CONTENT-04`, `CONTENT-05`

**Observable success criteria:**

- Resource packs can be browsed and installed from an in-app flow instead of Finder or Explorer being the default path.
- Shaders can be browsed and installed from an in-app flow with compatibility guidance tied to the active modpack or runtime.
- Resource-pack and shader failures surface recoverable, actionable explanations instead of opaque failure states.
- Local file import remains available as an explicit fallback path when guided in-app flows are not the right fit.
- `EXPAND-01` stays bounded to first-class resource-pack and shader management rather than expanding into a broad content marketplace.

## Milestones

- 🟡 **v0.6.0 Feedback-Driven Stabilization And Expansion** — Phases 28-31, roadmap created 2026-04-20. Next: Phase 29 Plan 04 execution.
- ✅ **v0.2.0 UI System And Experience Rework** — Phases 7-10, shipped 2026-04-13. Archive: `.planning/milestones/v0.2.0-ROADMAP.md`
- ✅ **v0.3.0 Adaptive UX Hardening And Launcher Ergonomics** — Phases 11-14, shipped 2026-04-14. Archive: `.planning/milestones/v0.3.0-ROADMAP.md`
- ✅ **v0.4.0 Launcher Truth And Product Polish** — Phases 15-18, shipped 2026-04-17. Archive: `.planning/milestones/v0.4.0-ROADMAP.md`
- ✅ **v0.5.0 Experience Reinvention And Brand Reset** — Phases 19-27, shipped 2026-04-20. Archive: `.planning/milestones/v0.5.0-ROADMAP.md`

## Progress

| Milestone | Phases | Plans | Status | Shipped |
| --- | --- | --- | --- | --- |
| v0.2.0 UI System And Experience Rework | 7-10 | 17/17 | Shipped | 2026-04-13 |
| v0.3.0 Adaptive UX Hardening And Launcher Ergonomics | 11-14 | 17/17 | Shipped | 2026-04-14 |
| v0.4.0 Launcher Truth And Product Polish | 15-18 | 16/16 | Shipped | 2026-04-17 |
| v0.5.0 Experience Reinvention And Brand Reset | 19-27 | 36/36 | Shipped | 2026-04-20 |
| v0.6.0 Feedback-Driven Stabilization And Expansion | 28-31 | 7/8 | In Progress | — |
