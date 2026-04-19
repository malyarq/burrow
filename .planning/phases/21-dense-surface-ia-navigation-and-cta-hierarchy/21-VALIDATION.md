---
phase: 21
slug: dense-surface-ia-navigation-and-cta-hierarchy
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-18
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx` |
| **Full suite command** | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx && npx tsc --noEmit && npx eslint src/` |
| **Estimated runtime** | ~220 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam touched by that task. If the task introduces a new constrained-width or runtime-summary test, extend the currently executable matrix with that new file immediately instead of waiting for phase closeout.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Start from the quick run command above during wave 1; expand it with the new density, edit-summary, and crowded-fixture tests as later waves land; after the final wave, run the full suite command including `npx eslint src/`.
- **Before `$gsd-verify-work`:** The full suite must be green and manual proof must exist for a crowded browser or list view, a constrained-width details view, create and edit configuration truth, and at least one dense secondary-content route inside the real shell.
- **Max feedback latency:** 220 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | SHELL-04, DENSE-01 | catalog density structure | `npx eslint src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/ModpackList.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 21-01-02 | 01 | 1 | SHELL-04, DENSE-01, DENSE-04 | constrained-width browser or list ergonomics | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx` | ❌ planned | ⬜ pending |
| 21-02-01 | 02 | 2 | SHELL-04, DENSE-02 | details IA and action grouping structure | `npx eslint src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/details/ModpackDetailsActions.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/ShadersTab.tsx src/components/modpacks/details/WorldsTab.tsx src/components/modpacks/details/WorldDatapacksModal.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 21-02-02 | 02 | 2 | SHELL-04, DENSE-02, DENSE-04 | constrained-width details and secondary tabs | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx` | ❌ planned | ⬜ pending |
| 21-03-01 | 03 | 3 | DENSE-03 | create and edit runtime truth structure | `npx eslint src/components/modpacks/CreateModpackModal.tsx src/components/modpacks/ModpackCreationWizard.tsx src/components/sidebar/ModpackDependencySummary.tsx src/components/sidebar/modpackRuntimeDependencies.ts src/components/modpacks/details/ModpackDetailsSettingsTab.tsx src/features/modpacks/hooks/useModpackDetailsConfig.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 21-03-02 | 03 | 3 | DENSE-03, DENSE-04 | create/edit summary truth regression | `npx vitest run src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx` | ❌ planned | ⬜ pending |
| 21-04-01 | 04 | 4 | SHELL-04, DENSE-01, DENSE-02, DENSE-03, DENSE-04 | manual crowded-proof harness | `npx eslint src/verification/manual/scenarios.tsx src/verification/manual/views.ts src/verification/manual/mockEnvironment.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 21-04-02 | 04 | 4 | SHELL-04, DENSE-01, DENSE-02, DENSE-03, DENSE-04 | focused density closeout matrix | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure already covers the phase. Phase 21 reuses:

- the existing Vitest setup in `vitest.config.ts`;
- the current dense-surface seams in `ModpackBrowser.ergonomics.test.tsx`, `ModpackList.ergonomics.test.tsx`, `ModpackDetails.layout.test.tsx`, `ModpackDetails.actions.test.tsx`, `SecondaryContentTabs.test.tsx`, `CreateModpackDependencies.test.tsx`, and `ModpackCreationWizard.layout.test.tsx`;
- the shared manual verification harness in `src/verification/manual/*`;
- the standard repo checks `npx tsc --noEmit` and `npx eslint src/`.

No new test framework, screenshot runner, or watch-mode tooling is required.

The new Phase 21 structural tests should be created during execution where coverage gaps currently exist:

- `src/components/modpacks/__tests__/ModpackDetails.density.test.tsx` for constrained-width details with long metadata and tab labels;
- `src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx` for edit-surface runtime-summary truth;
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx` for crowded browser or list data fixtures with long labels and multi-row metadata pressure.

These files are not required for wave 1 feedback; they become part of the executable phase matrix as their owning plans land.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Browser or installed list stays readable under realistic crowded data | SHELL-04, DENSE-01, DENSE-04 | The issue is about real card density, line wraps, and filter rhythm under desktop pressure, which is easy to miss in isolated DOM assertions | Open the shell-integrated crowded browser or list proof. Use long labels, stacked metadata, and enough cards to force scroll. Confirm filters remain grouped, primary actions stay attached to their card context, and no controls wrap into ambiguous orphan rows |
| Modpack details preserves hierarchy under constrained desktop width | SHELL-04, DENSE-02, DENSE-04 | Metadata clusters, tabs, and action grouping are visually sensitive to real composition and width pressure | Open a constrained-width details proof with long title, long version or loader labels, and at least one dense secondary tab. Confirm tabs stay readable, the primary action does not compete with secondary actions, and metadata labels still explain counts and summaries |
| Create and edit flows expose the same truthful runtime and dependency summary | DENSE-03, DENSE-04 | Summary truth is cross-surface and easier to judge when a human compares create and edit states side by side | Open proof states for create wizard or modal and details settings edit mode using the same modpack data. Confirm version, loader, dependency counts, and warnings match across both surfaces and do not contradict the display header |
| Dense secondary content remains usable instead of collapsing into internal-scroll clutter | DENSE-02, DENSE-04 | Secondary tabs and datapack modal behavior depend on live spacing, wrapping, and perceived hierarchy | Review at least one dense secondary route such as resource packs, shaders, worlds, or the world datapacks modal. Confirm rows, counts, toggles, and supporting actions remain legible without nested-scroll confusion or unlabeled values |

---

## Retrospective Recovery Note

- Phase 26 normalized this validation record retrospectively and backfilled the final sign-off from shipped Phase 21 summaries, the original task-level verification contract above, and the shell-integrated closeout evidence captured in `21-04-SUMMARY.md`.
- The per-task map remains the historical execution record from Phase 21. This document now records recovered closure truth; it does not claim that Phase 26 reran dense-surface implementation from scratch.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure dependencies
- [x] Quick-run guidance is wave-aware and executable from wave 1 onward
- [x] New Phase 21 structural tests are scheduled into later waves instead of blocking early feedback loops
- [x] No watch-mode flags
- [x] Final full matrix becomes mandatory only after wave 4 test seams land
- [x] Retrospective sign-off is recovered from shipped evidence and final gates while preserving the original task map as history
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** complete
