# Roadmap: FriendLauncher (FMCL)

## Active Milestone: v0.5.0 Experience Reinvention And Brand Reset

**Status:** Phase 19 complete `2026-04-17`  
**Phases:** 19-24  
**Requirements:** 23  
**Next step:** `$gsd-plan-phase 20`

## Overview

`v0.5.0` is a redesign-quality milestone for the existing FMCL launcher, not a feature-expansion milestone. The plan starts by hardening the shipped desktop baseline, then moves through brand and token reset, dense-surface IA and CTA hierarchy, theme and locale truth, degraded-state productization, and finally verification plus release-facing truth.

The roadmap is intentionally ordered to prevent another "screen-by-screen repaint" cycle: shared shell and state invariants land before broad surface migration, and fallback/error quality is treated as milestone-owned product scope rather than cleanup.

## Phases

### Phase 19: Baseline Stability, Scope, And Shell Invariants

**Goal:** FMCL's redesign starts from a trustworthy desktop baseline by removing shared shell breakage, locking primary-action ownership, and stabilizing the highest-risk route geometry before visual reinvention spreads.
**Depends on:** Phase 18
**Requirements:** `SHELL-01`, `SHELL-02`, `SHELL-03`
**Success criteria:**
1. Major launcher surfaces no longer render under the custom title bar.
2. Dense pages no longer hide actionable content behind sticky headers or fixed footers.
3. Each affected route exposes one clear primary action with no competing duplicate CTA.
4. Shared shell and action-bar invariants are defined in reusable seams rather than route-local spacing hacks.

### Phase 20: Brand System, Shared Tokens, And Surface Migration

**Goal:** FMCL gains a deliberate new visual language by formalizing brand tokens, logo/wordmark usage, and product-owned fallback art before more screens migrate onto the redesign.
**Depends on:** Phase 19
**Requirements:** `BRAND-01`, `BRAND-02`, `BRAND-03`
**Success criteria:**
1. Shared design tokens define FMCL's typography, spacing, surface hierarchy, and brand accents across the shell.
2. Logo and wordmark usage follow one intentional rule set instead of ad hoc repetition.
3. Missing media and launcher fallback art use one product-owned visual policy across shipped surfaces.
4. Updated brand primitives are reused by multiple routes rather than living on a single hero surface.

### Phase 21: Dense Surface IA, Navigation, And CTA Hierarchy

**Goal:** FMCL's densest modpack flows become readable and trustworthy by reworking tabs, filters, summaries, and action hierarchy around real desktop content pressure.
**Depends on:** Phase 20
**Requirements:** `SHELL-04`, `DENSE-01`, `DENSE-02`, `DENSE-03`, `DENSE-04`
**Success criteria:**
1. Modpack browser filters, cards, and actions stay readable without wrapped or orphaned controls at shipped desktop widths.
2. Modpack details present tabs and actions without broken wrapping or duplicated primary CTAs.
3. Modpack creation and editing surfaces show truthful version, loader, and dependency summaries.
4. Counts, summaries, and metadata on dense screens are labeled and non-contradictory.
5. Dense-surface redesign decisions are validated against realistic long labels, narrow desktop widths, and seeded edge-case data.

### Phase 22: Theme Truth And Interaction-State Fidelity

**Goal:** FMCL's redesigned themes stop being cosmetic labels and become truthful interaction systems with readable states, real accent propagation, and consistent locale-sensitive presentation.
**Depends on:** Phase 21
**Requirements:** `THEME-01`, `THEME-02`, `THEME-03`, `THEME-04`
**Success criteria:**
1. Selected, active, hover, focus, and disabled states are clearly legible in dark and light themes.
2. Accent color applies consistently to the controls and states that claim to use it.
3. Presets are visually distinct and read as intentional launcher appearances rather than near-duplicates.
4. Dates, numbers, and translated copy follow the active locale on redesigned milestone surfaces.

### Phase 23: Fallback, Error, And Placeholder Productization

**Goal:** FMCL's degraded states become product-grade by replacing raw placeholders, ambiguous empties, misleading dependency states, and raw crash output with one consistent fallback language.
**Depends on:** Phase 22
**Requirements:** `FALL-01`, `FALL-02`, `FALL-03`, `FALL-04`
**Success criteria:**
1. Shipped UI no longer exposes unresolved placeholders, raw bindings, or developer-facing debug strings.
2. Empty, missing-data, and zero-result states are intentional, readable, and branded rather than ambiguous blanks.
3. Fatal errors render through a user-safe recovery surface instead of raw React internals and stack traces.
4. Dependency and degraded-data states are expressed through truthful product copy instead of misleading missing-state logic.

### Phase 24: Verification, Locale, And Release Truth

**Goal:** `v0.5.0` closes on proof by extending the manual verification seam, adding screenshot regression coverage, and synchronizing release-facing truth with the shipped redesign.
**Depends on:** Phase 23
**Requirements:** `VER-01`, `VER-02`, `VER-03`, `VER-04`
**Success criteria:**
1. Manual verification routes cover redesigned core surfaces and degraded states.
2. Visual regression checks catch milestone-owned screenshot drift before release.
3. Verification evidence covers dark/light themes and EN/RU locales on milestone-owned surfaces.
4. Release-facing docs and planning truth match the shipped redesign behavior at closeout.

## Milestones

- ✅ **v0.2.0 UI System And Experience Rework** — Phases 7-10, shipped 2026-04-13. Archive: `.planning/milestones/v0.2.0-ROADMAP.md`
- ✅ **v0.3.0 Adaptive UX Hardening And Launcher Ergonomics** — Phases 11-14, shipped 2026-04-14. Archive: `.planning/milestones/v0.3.0-ROADMAP.md`
- ✅ **v0.4.0 Launcher Truth And Product Polish** — Phases 15-18, shipped 2026-04-17. Archive: `.planning/milestones/v0.4.0-ROADMAP.md`
- ◆ **v0.5.0 Experience Reinvention And Brand Reset** — Phases 19-24, planned 2026-04-17.

## Progress

| Milestone | Phases | Plans | Status | Shipped |
| --- | --- | --- | --- | --- |
| v0.2.0 UI System And Experience Rework | 7-10 | 17/17 | Shipped | 2026-04-13 |
| v0.3.0 Adaptive UX Hardening And Launcher Ergonomics | 11-14 | 17/17 | Shipped | 2026-04-14 |
| v0.4.0 Launcher Truth And Product Polish | 15-18 | 16/16 | Shipped | 2026-04-17 |
| v0.5.0 Experience Reinvention And Brand Reset | 19-24 | 4/4 | Phase 19 complete | — |
