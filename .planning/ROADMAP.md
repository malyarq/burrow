# Roadmap: FriendLauncher (FMCL)

## Overview

This roadmap continues from the completed `v1.0` release-hardening milestone into `v0.2.0`, which is focused on product coherence rather than raw capability expansion. The objective is to turn FMCL's broad existing launcher surface into a visually unified, theme-correct, fully translated, and manually verified desktop experience without rewriting the current Electron + React + TypeScript architecture.

## Phases

**Phase Numbering:**
- Integer phases (7, 8, 9, 10): Planned milestone work
- Decimal phases (7.1, 8.1): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 7: UI System Foundations** - Establish the shared visual system, theme source of truth, and icon/shell contracts that every later screen rollout depends on. Completed 2026-04-13.
- [x] **Phase 8: Core Route Rollout And UI Correctness** - Move the highest-traffic launcher flows onto the shared system while removing visible translation, icon, and state defects. Completed 2026-04-13.
- [ ] **Phase 9: Secondary Surface Alignment And UX Polish** - Bring advanced or lower-traffic launcher surfaces into the same product language and close accessibility and atmosphere fallout.
- [ ] **Phase 10: Manual Experience Verification And Release Truth** - Validate the refreshed launcher through real browser walkthroughs, land fallout fixes, and update release-facing documentation.

## Phase Details

### Phase 7: UI System Foundations
**Goal**: FMCL has one shared visual foundation for shells, cards, forms, dialogs, icons, and theme behavior instead of a patchwork of per-screen styling.
**Depends on**: Phase 6
**Requirements**: DSYS-01, DSYS-02, THEME-01
**Success Criteria** (what must be TRUE):
  1. Shared UI primitives and launcher shell components define the main visual language for refreshed surfaces.
  2. Theme and accent changes visibly affect the launcher shell, dialogs, cards, and shared controls instead of only isolated elements.
  3. Iconography and repeated action affordances are standardized across navigation, cards, dialogs, and empty states.
  4. High-traffic surfaces stop relying on unowned hardcoded visual exceptions for their core structure.
**Plans**: 4

### Phase 8: Core Route Rollout And UI Correctness
**Goal**: The launcher's most-used routes feel coherent, translated, and intentionally convenient instead of merely functional.
**Depends on**: Phase 7
**Requirements**: DSYS-03, LOCL-01, UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. Launcher home/play, settings, accounts, onboarding, and modpack flows consume the shared visual system rather than parallel styling patterns.
  2. Visible EN/RU UI copy on refreshed core routes no longer leaks placeholder text, missing translations, or mismatched helper states.
  3. Core dialogs, forms, and action states use consistent icons, spacing, hierarchy, and feedback patterns.
  4. The primary launcher workflows feel clearer and lower-friction in a real browser run than they did before the rollout.
**Plans**: 4

### Phase 9: Secondary Surface Alignment And UX Polish
**Goal**: The rest of the launcher stops feeling like leftover modules and the polished UI still respects accessibility, performance, and readability.
**Depends on**: Phase 8
**Requirements**: A11Y-04, UX-04
**Success Criteria** (what must be TRUE):
  1. Sharing, statistics, mirrors, and remaining advanced or content-management surfaces feel like the same product as the refreshed shell and core flows.
  2. The refreshed UI preserves visible focus, sufficient contrast, reduced-motion behavior, and runtime readability across updated surfaces.
  3. Backgrounds, gradients, blur, and motion support hierarchy and atmosphere without overwhelming content or making the launcher feel heavier.
**Plans**: TBD

### Phase 10: Manual Experience Verification And Release Truth
**Goal**: The milestone closes on live experience evidence and truthful release messaging rather than assuming the redesigned UI is done.
**Depends on**: Phase 9
**Requirements**: VER-01, DOC-03
**Success Criteria** (what must be TRUE):
  1. Maintainers execute a real browser-based walkthrough across refreshed critical routes and interactions before claiming completion.
  2. Fallout found during that walkthrough is fixed without reopening design-system drift or leaving known UX defects untracked.
  3. README and roadmap-facing UI descriptions reflect the shipped launcher experience accurately after the redesign lands.
  4. The refreshed milestone still closes with the normal repository quality gates green.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 7 -> 8 -> 9 -> 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. UI System Foundations | 4/4 | Complete | 2026-04-13 |
| 8. Core Route Rollout And UI Correctness | 4/4 | Complete | 2026-04-13 |
| 9. Secondary Surface Alignment And UX Polish | 0/0 | Planned | — |
| 10. Manual Experience Verification And Release Truth | 0/0 | Planned | — |
