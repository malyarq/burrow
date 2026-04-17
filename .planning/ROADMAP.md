# Roadmap: FriendLauncher (FMCL)

## Milestones

- ✅ **v0.2.0 UI System And Experience Rework** — Phases 7-10, shipped 2026-04-13. Archive: `.planning/milestones/v0.2.0-ROADMAP.md`
- ✅ **v0.3.0 Adaptive UX Hardening And Launcher Ergonomics** — Phases 11-14, shipped 2026-04-14. Archive: `.planning/milestones/v0.3.0-ROADMAP.md`
- ◆ **v0.4.0 Launcher Truth And Product Polish** — Phases 15-18, planned 2026-04-14. Active milestone.

## Current Status

- Active milestone: `v0.4.0 Launcher Truth And Product Polish`
- Current phase: `18` — Verification And Release Truth
- Next step: plan Phase 18 verification and release-truth closeout

## Active Milestone

**Milestone:** `v0.4.0 Launcher Truth And Product Polish`  
**Status:** READY TO PLAN PHASE 18  
**Phases:** 15-18  
**Mapped requirements:** 12

### Overview

`v0.4.0` is a release-truth and finish-quality milestone. It repairs the screenshot-backed defects captured in `docs/ru/ui-qa-audit-2026-04-14.md` and closes directly related shipped-surface inconsistencies without expanding FMCL into new feature scope.

The milestone focuses on four workstreams:

- truthful launch state and localized runtime feedback
- correct modpack dependency semantics and discoverable dense navigation
- catalog scanability, fallback imagery, and compact-nav coherence
- settings/localization completion, plus final verification and release truth

## Phases

### Phase 15: Launch Truth And Shared Surface Contracts

**Status:** Complete (`2026-04-14`)  
**Goal:** FMCL's main play surface stops showing contradictory launcher state and missing-art failure modes by moving launch truth, progress, and localized runtime feedback onto one reliable shared contract.  
**Depends on:** Phase 14  
**Requirements:** `LAUNCH-01`, `LAUNCH-02`, `LAUNCH-03`, `LAUNCH-04`

**Success criteria:**
1. Missing or invalid launch artwork renders a deliberate branded fallback on the audited launch surface.
2. The visible modloader selection and summary state agree for the active launch configuration.
3. Launch progress, CTA state, and status messaging stay synchronized across representative preparing, working, success, and failure flows.
4. Launch and runtime-status copy follows the active launcher language on the audited launch flow.

### Phase 16: Modpack Detail Integrity And Discoverable Dense Navigation

**Status:** Complete (`2026-04-15`)  
**Goal:** Users can trust what modpack details say about runtime dependencies and reach primary detail sections without fighting dense-screen navigation.  
**Depends on:** Phase 15  
**Requirements:** `DETAIL-01`, `DETAIL-02`, `DETAIL-03`

**Success criteria:**
1. Runtime dependencies such as `minecraft` and `forge` are recognized as satisfied when the installed pack configuration already provides them.
2. Dependency requirements render as readable product copy instead of raw version-range syntax.
3. Primary modpack detail sections stay discoverable without default horizontal tab scrolling.
4. The repaired detail screens remain scannable on the audited desktop widths.

### Phase 17: Catalog, Compact Nav, And Settings Localization Polish

**Status:** Completed (`2026-04-17`)  
**Goal:** The remaining shipped-surface polish defects across catalog browsing, compact navigation, and settings localization are removed without reopening broader feature or IA redesign scope.  
**Depends on:** Phase 16  
**Requirements:** `CATALOG-01`, `CATALOG-02`, `CATALOG-03`, `SET-01`, `SET-02`

**Success criteria:**
1. Catalog filters and primary controls stay legible with the sidebar open at the audited desktop widths.
2. Modpacks without artwork show a branded fallback instead of an empty gray placeholder.
3. Collapsed navigation shows a coherent active state without stray placeholder letters.
4. Audited settings and launch-adjacent surfaces no longer expose raw localization keys.
5. Theme preset names follow one deliberate RU/EN naming policy on the shipped appearance surface.

### Phase 18: Verification And Release Truth

**Goal:** The milestone closes on proof, not assumption, by validating repaired surfaces through focused tests, manual walkthrough evidence, and truthful release-facing state.  
**Depends on:** Phase 17  
**Requirements:** Closeout phase

**Success criteria:**
1. Focused automated checks cover the milestone-owned launch, detail, catalog/nav, and settings/locale regressions.
2. Manual verification evidence demonstrates the repaired audited surfaces on the existing verification seam.
3. Active planning and release-facing docs stay truthful to the shipped `v0.4.0` behavior.
4. Milestone closeout finishes on green `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build -- --publish never` gates.

## Progress

| Milestone | Phases | Plans | Status | Shipped |
| --- | --- | --- | --- | --- |
| v0.2.0 UI System And Experience Rework | 7-10 | 17/17 | Shipped | 2026-04-13 |
| v0.3.0 Adaptive UX Hardening And Launcher Ergonomics | 11-14 | 17/17 | Shipped | 2026-04-14 |
| v0.4.0 Launcher Truth And Product Polish | 15-18 | 12/12 | Ready to plan Phase 18 | — |
