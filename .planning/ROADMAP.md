# Roadmap: FriendLauncher (FMCL)

## Overview

This roadmap turns FMCL's broad existing feature surface into a release-ready desktop launcher by sequencing work around trust restoration first, then verification, then the remaining product gaps that fit the current architecture. It stays brownfield-safe: harden the current Electron + React + TypeScript launcher, finish missing release-critical flows inside existing domains, and close on accessibility, documentation truth, and security confidence rather than introducing rewrite work.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Release Baseline And Trust Boundaries** - Restore the reliability, lint, type, and security baseline that every later release change depends on.
- [x] **Phase 2: Automated Release Verification** - Put a repeatable automated safety net around the highest-risk service and formatting flows.
- [x] **Phase 3: Modpack Workflow Completion** - Finish the missing browser and instance-management flows already supported by the current launcher model.
- [x] **Phase 4: Delivery, Cache, Accounts, And Stats Hardening** - Extend existing domains for image caching, skins, mirror resilience, and local statistics export. (completed 2026-04-12)
- [x] **Phase 5: Accessibility And Release Truthfulness** - Lock the shipped UI and docs into an accessible, accurate final release state. (completed 2026-04-12)
- [x] **Phase 6: Milestone Auditability Recovery** - Close the remaining audit-discovered product drift, reconstruct verification evidence, and restore `v1.0` milestone archival readiness. (completed 2026-04-12)

## Phase Details

### Phase 1: Release Baseline And Trust Boundaries
**Goal**: FMCL has a trustworthy release baseline: critical launcher flows stop regressing at runtime, quality gates are clean, and privileged boundaries reject unsafe input before work starts.
**Depends on**: Nothing (first phase)
**Requirements**: REL-01, REL-02, SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):
  1. User can use background, accounts, share, and storage-heavy flows without hook-order crashes, stale-effect breakage, or cascading re-render regressions.
  2. Release candidates pass `npx tsc --noEmit` and `npx eslint src/` before shipment, and regressions in either gate are visible immediately.
  3. Invalid IPC payloads and unsafe values are rejected before privileged handlers begin work.
  4. File and archive operations stay inside allowed roots, and renderer/window behavior blocks unsafe navigation, XSS exposure, and insecure web preferences.
**Plans**: TBD

### Phase 2: Automated Release Verification
**Goal**: The launcher's highest-risk service logic has an automated release gate that maintainers can run locally and in CI instead of relying on manual QA only.
**Depends on**: Phase 1
**Requirements**: TEST-01, TEST-02
**Success Criteria** (what must be TRUE):
  1. Maintainer can run `npm test` locally and in CI to execute the FMCL automated test suite.
  2. Regressions in `modpackService`, `contentManager`, `shareService`, and formatting utilities fail the automated suite before release candidates ship.
  3. Release-critical malformed-input and round-trip scenarios are covered by automated tests rather than only manual verification.
**Plans**: TBD

### Phase 3: Modpack Workflow Completion
**Goal**: Core modpack browsing and instance-management workflows feel complete from the list and browser surfaces without forcing users into workaround navigation.
**Depends on**: Phase 2
**Requirements**: FLOW-01, FLOW-02, FLOW-03, FLOW-04
**Success Criteria** (what must be TRUE):
  1. User can duplicate an instance directly from modpack list cards or card actions without opening the details view.
  2. User can rename an instance directly from modpack list cards or card actions without opening the details view.
  3. User can return to recently opened or viewed modpacks in the browser.
  4. User can configure page size and navigate paginated modpack browser results without losing browsing context.
**Plans**: TBD

### Phase 4: Delivery, Cache, Accounts, And Stats Hardening
**Goal**: FMCL deepens its existing launcher domains so delivery and content flows are resilient, cached, configurable, and inspectable without changing architecture.
**Depends on**: Phase 3
**Requirements**: FLOW-05, ACCT-01, DLVR-01, DLVR-02, DLVR-03, STAT-01, STAT-02
**Success Criteria** (what must be TRUE):
  1. Modpack and mod imagery loads from a persistent disk cache, and users have cache size management and cleanup controls.
  2. User can preview supported custom-account skins, refresh that preview, and open the provider management page directly from within the launcher.
  3. User can set mirror priority, the launcher falls back to healthy mirrors automatically, and corrupted or incomplete downloads are rejected instead of being accepted as successful.
  4. User can view popular modpacks and local usage trends in the launcher and export local statistics data for backup or analysis.
**Scope Note**: Phase 4 intentionally stopped at provider-aware preview, refresh, and provider-site handoff for Blessing Skin and LittleSkin after the skin-provider APIs implied a broader auth expansion than the milestone allowed.
**Plans**: TBD

### Phase 5: Accessibility And Release Truthfulness
**Goal**: The shipped FMCL release is keyboard-usable, assistive-technology friendly, visually accessible, and documented truthfully across its public artifacts and IPC maps.
**Depends on**: Phase 4
**Requirements**: A11Y-01, A11Y-02, A11Y-03, DOC-01, DOC-02
**Success Criteria** (what must be TRUE):
  1. User can complete core launcher and modpack flows with keyboard-only navigation, clear focus movement, and recoverable dialogs and menus.
  2. Interactive controls expose accessible names, roles, and states for assistive technologies.
  3. Themes, backgrounds, and animations meet contrast and reduced-motion expectations for release use.
  4. README and EN/RU roadmaps accurately describe shipped FMCL behavior, and the contract maps document the active IPC channels for the release surface.
**Plans**: TBD

### Phase 6: Milestone Auditability Recovery
**Goal**: `v1.0` regains auditability on honest release truth: the remaining audit-discovered runtime and documentation drift is closed, each completed phase has verification evidence, and milestone archival can proceed without accepting avoidable process debt.
**Depends on**: Phase 5
**Requirements**: REL-01, REL-02, TEST-01, TEST-02, FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05, ACCT-01, DLVR-01, DLVR-02, DLVR-03, STAT-01, STAT-02, A11Y-01, A11Y-02, A11Y-03, DOC-01, DOC-02, SEC-01, SEC-02, SEC-03
**Gap Closure:** Closes `v1.0-MILESTONE-AUDIT.md` blockers caused by missing `VERIFICATION.md` files, requirement-tracking drift, and the final shipped-behavior mismatches found during milestone review.
**Success Criteria** (what must be TRUE):
  1. Launcher mirror selection and fallback no longer bypass the persisted mirror-priority model, and the remaining live modpack imagery surfaces use the shipped cache path instead of raw remote URLs.
  2. Phase 4 and Phase 5 documentation truth is repaired where the audit found drift, including roadmap language and requirement wording that overstated or understated shipped behavior.
  3. Phases 1 through 5 each have `VERIFICATION.md` artifacts that map shipped work to requirements, evidence, and unresolved debt.
  4. `REQUIREMENTS.md` checkboxes and traceability rows reflect verified status instead of the pre-audit `Pending` baseline, including explicit closure evidence for `REL-02`.
  5. Re-running `$gsd-audit-milestone` for `v1.0` no longer reports orphaned or unsatisfied requirements caused by missing verification artifacts or known phase drift.
**Plans**: 3 planned in 2 waves

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 2.1 -> 2.2 -> 3 -> 3.1 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Release Baseline And Trust Boundaries | 10/10 | Completed | 2026-04-12 |
| 2. Automated Release Verification | 3/3 | Completed | 2026-04-12 |
| 3. Modpack Workflow Completion | 3/3 | Completed | 2026-04-12 |
| 4. Delivery, Cache, Accounts, And Stats Hardening | 5/5 | Complete   | 2026-04-12 |
| 5. Accessibility And Release Truthfulness | 5/5 | Complete | 2026-04-12 |
| 6. Milestone Auditability Recovery | 3/3 | Complete | 2026-04-12 |
