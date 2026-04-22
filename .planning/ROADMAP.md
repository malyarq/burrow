# Roadmap: FriendLauncher (FMCL)

## Milestone Status

**Active milestone:** `v0.7.0` — Direct Feedback Closure And Interface Cohesion
**Latest shipped milestone:** `v0.6.0` — Feedback-Driven Stabilization And Expansion (`2026-04-21`)  
**Next step:** `$gsd-execute-phase 36`

## Latest Archive

`v0.6.0` shipped FMCL's feedback-driven stabilization pass across shell restraint, modpack workflow truth, honest settings behavior, and guided resource-pack and shader management.

Archive:

- Roadmap: `.planning/milestones/v0.6.0-ROADMAP.md`
- Requirements: `.planning/milestones/v0.6.0-REQUIREMENTS.md`
- Audit: `.planning/milestones/v0.6.0-MILESTONE-AUDIT.md`

## Active Milestone

### v0.7.0 Direct Feedback Closure And Interface Cohesion

`v0.7.0` is the active milestone and uses `docs/ru/product-feedback-2026-04-20.md` as the primary source of truth. The milestone is explicitly about closing the feedback gaps that still feel wrong in live use: leftover shell and sidebar drift, catalog and detail density, unreliable or underexplained content flows, settings unpredictability, and the lack of one shared control contract across the launcher.

## Proposed Phases

### Phase 32: Shell Identity And Sidebar Cohesion

**Goal:** Remove the remaining shell-level weirdness by making the sidebar header readable, fallback identity restrained, and macOS chrome behavior verifiably native under real window runs.
**Owns requirements:** `SHELL-09`, `SHELL-10`, `BRAND-01`
**Execution progress:** `4/4` plans complete
**Status:** complete on `2026-04-22`

**Observable success criteria:**

- The sidebar no longer uses a redundant square logo block, the launcher title fits naturally, and compact-mode controls sit visibly aligned.
- macOS traffic-light clearance and title-bar behavior no longer compete with custom chrome or duplicated controls in real app runs.
- Missing media and fallback states no longer substitute loud branding where calm content-first placeholders or real imagery should appear.
- Manual proof routes now describe the direct-feedback shell contract instead of stale brand-reset wording.

### Phase 33: Classic Truth And Catalog Density Repair

**Goal:** Restore truthful classic-state presentation and compress the modpack catalog into one scan-friendly surface with minimal card data and coherent action geometry.
**Owns requirements:** `MODPACK-07`, `MODPACK-08`, `MODPACK-09`, `MODPACK-10`
**Execution progress:** `4/4` plans complete
**Status:** complete on `2026-04-22`

**Observable success criteria:**

- Classic mode no longer shows stale `1.12.2` or overloaded vanilla labels when persisted runtime truth differs.
- Catalog summary counters disappear, while search and filter controls stay horizontal and compact at common desktop widths.
- Modpack cards keep only the small set of summary facts that help decide whether to open details.
- Primary catalog actions share one height, icon, padding, and wrapping contract instead of drifting visually.

### Phase 34: Detail Hierarchy And Content Surface Cohesion

**Goal:** Make modpack details and content tabs feel like one product surface by keeping tabs reachable above the fold and aligning runtime, dependency, and tab language truth.
**Owns requirements:** `MODPACK-11`, `MODPACK-12`, `CONTENT-07`
**Execution progress:** `4/4` plans complete
**Status:** complete on `2026-04-22`

**Observable success criteria:**

- Modpack detail tabs stay discoverable and usable without scrolling past oversized hero or action blocks.
- Runtime and dependency summaries read as authoritative, and healthy, warning, and broken states use believable color semantics.
- Mods, Resource Packs, Shaders, Worlds, and Screenshots share one layout language instead of looking like separate mini-apps.

### Phase 35: Async Flow Reliability And Guided Content Honesty

**Goal:** Make create/add and guided content flows explain themselves, keep their primary actions stable, and feel trustworthy under real async work instead of only passing proof routes.
**Owns requirements:** `MODPACK-13`, `MODPACK-14`, `CONTENT-08`, `CONTENT-09`
**Execution progress:** `4/4` plans complete
**Status:** complete on `2026-04-22`

**Observable success criteria:**

- Create-modpack and add-mod flows keep their confirmation action fixed and reachable while long result lists or installs continue.
- Failures explain concrete causes and next actions instead of forcing users to infer hidden blockers such as modloader incompatibility.
- Guided resource-pack and shader flows answer compatibility questions in context of the active runtime.
- Switching active modpacks and installing content no longer produces obvious flicker or churn.

### Phase 36: Settings Predictability And Shared Control Contract

**Goal:** Remove leftover settings weirdness and align the launcher under one visible button, toggle, slider, tab, and copy contract.
**Owns requirements:** `SETTINGS-05`, `SETTINGS-06`, `SETTINGS-07`, `SETTINGS-08`, `DESIGN-01`
**Execution progress:** `3/4` plans complete
**Status:** in progress on `2026-04-22`

**Observable success criteria:**

- Settings no longer show unnecessary branding blocks or duplicate explanatory text.
- Preset themes produce immediate, visible, and predictable results with no hidden light/dark jumps.
- Accent pickers, sliders, toggles, and tabs align cleanly with no label overlap or geometry drift.
- Shared controls across shell, catalog, details, content, and settings now read as one design contract instead of unrelated component families.

## Shipped Milestones

- 🟡 **v0.7.0 Direct Feedback Closure And Interface Cohesion** — Phases `32-36`, roadmap created `2026-04-22`. Progress: Phase `32` complete (`4/4` plans), Phase `33` complete (`4/4` plans), Phase `34` complete (`4/4` plans), Phase `35` complete (`4/4` plans), Phase `36` in progress (`3/4` plans). Next: `$gsd-execute-phase 36`.
- ✅ **v0.6.0 Feedback-Driven Stabilization And Expansion** — Phases `28-31`, shipped `2026-04-21`. Progress: `20/20` plans complete. Audit: `19/19` requirements satisfied.
- ✅ **v0.5.0 Experience Reinvention And Brand Reset** — Phases `19-27`, shipped `2026-04-20`. Archive: `.planning/milestones/v0.5.0-ROADMAP.md`
- ✅ **v0.4.0 Launcher Truth And Product Polish** — Phases `15-18`, shipped `2026-04-17`. Archive: `.planning/milestones/v0.4.0-ROADMAP.md`
- ✅ **v0.3.0 Adaptive UX Hardening And Launcher Ergonomics** — Phases `11-14`, shipped `2026-04-14`. Archive: `.planning/milestones/v0.3.0-ROADMAP.md`
- ✅ **v0.2.0 UI System And Experience Rework** — Phases `7-10`, shipped `2026-04-13`. Archive: `.planning/milestones/v0.2.0-ROADMAP.md`

## Archived Phase Groups

<details>
<summary>✅ v0.6.0 Feedback-Driven Stabilization And Expansion (Phases 28-31) — SHIPPED 2026-04-21</summary>

- [x] Phase 28: Product Restraint And Native Shell Truth (`4/4` plans)
- [x] Phase 29: Modpack Workflow Simplification And Runtime Truth (`4/4` plans)
- [x] Phase 30: Settings Truth And Honest Personalization (`4/4` plans)
- [x] Phase 31: Guided Content Browsers And Capability Expansion (`8/8` plans)

</details>

<details>
<summary>✅ v0.5.0 Experience Reinvention And Brand Reset (Phases 19-27) — SHIPPED 2026-04-20</summary>

- [x] Phase 19: Baseline Stability, Scope, And Shell Invariants (`4/4` plans)
- [x] Phase 20: Brand System, Shared Tokens, And Surface Migration (`4/4` plans)
- [x] Phase 21: Dense Surface IA, Navigation, And CTA Hierarchy (`4/4` plans)
- [x] Phase 22: Theme Truth And Interaction-State Fidelity (`4/4` plans)
- [x] Phase 23: Fallback, Error, And Placeholder Productization (`4/4` plans)
- [x] Phase 24: Verification, Locale, And Release Truth (`4/4` plans)
- [x] Phase 25: Verification Artifact Recovery For Shell, Brand, And Dense Surfaces (`4/4` plans)
- [x] Phase 26: Verification Artifact Recovery For Theme, Fallback, And Release Truth (`4/4` plans)
- [x] Phase 27: Final Audit Trail And Residual Debt Closure (`4/4` plans)

</details>

## Progress

| Milestone | Phases | Plans | Status | Shipped |
| --- | --- | --- | --- | --- |
| v0.7.0 Direct Feedback Closure And Interface Cohesion | 32-36 | 19/20 | Active | — |
| v0.2.0 UI System And Experience Rework | 7-10 | 17/17 | Shipped | 2026-04-13 |
| v0.3.0 Adaptive UX Hardening And Launcher Ergonomics | 11-14 | 17/17 | Shipped | 2026-04-14 |
| v0.4.0 Launcher Truth And Product Polish | 15-18 | 16/16 | Shipped | 2026-04-17 |
| v0.5.0 Experience Reinvention And Brand Reset | 19-27 | 36/36 | Shipped | 2026-04-20 |
| v0.6.0 Feedback-Driven Stabilization And Expansion | 28-31 | 20/20 | Shipped | 2026-04-21 |
