---
phase: 33
slug: classic-truth-and-catalog-density-repair
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-22
---

# Phase 33 — Validation Strategy

> Per-phase validation contract for classic runtime truth and catalog density closure against the direct feedback file.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/contexts/__tests__/ModpackContext.startup-truth.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/Sidebar.classic-truth.test.tsx src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run src/contexts/__tests__/ModpackContext.startup-truth.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/Sidebar.classic-truth.test.tsx src/components/__tests__/Sidebar.primary-action.test.tsx src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/components/Sidebar.tsx src/components/SimplePlayDashboard.tsx src/components/modpacks/ModpackCatalogControls.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/sidebar/modpackRuntimeDependencies.ts src/contexts/ModpackContext.tsx src/features/launch/hooks/useLaunchState.ts src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` |
| **Estimated runtime** | ~240 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam you touched; if a task spans classic truth plus catalog surfaces, use the quick run command.
- **After every plan wave:** Run the full suite command for all completed wave seams.
- **Before `$gsd-verify-work`:** Full suite must be green, and manual proof must exist for classic cold-start truth, installed catalog density, remote browser density, and header/action consistency.
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 33-01-01 | 01 | 1 | MODPACK-07 | classic startup truth | `npx vitest run src/contexts/__tests__/ModpackContext.startup-truth.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 33-01-02 | 01 | 1 | MODPACK-07 | classic sidebar wording/truth seam | `npx vitest run src/components/__tests__/Sidebar.classic-truth.test.tsx && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 33-02-01 | 02 | 1 | MODPACK-08 | installed/remote catalog controls density | `npx vitest run src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 33-02-02 | 02 | 1 | MODPACK-08 | catalog shell lint and composition | `npx eslint src/components/modpacks/ModpackCatalogControls.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 33-03-01 | 03 | 2 | MODPACK-09 | dense card metadata | `npx vitest run src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 33-03-02 | 03 | 2 | MODPACK-10 | catalog action contract and implementation lint | `npx vitest run src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx && npx eslint src/components/ui/Button.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx && npx tsc --noEmit` | ❌ W0 for header-action seam | ⬜ pending |
| 33-04-01 | 04 | 3 | MODPACK-07, MODPACK-08, MODPACK-09, MODPACK-10 | manual proof route descriptions | `npx vitest run src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 33-04-02 | 04 | 3 | MODPACK-07, MODPACK-08, MODPACK-09, MODPACK-10 | manual proof harness lint | `npx eslint src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Phase 33 can reuse the current test stack, but it needs several proof seams tightened before execution can be trusted:

- [ ] `src/components/__tests__/Sidebar.classic-truth.test.tsx` — add a dedicated classic sidebar seam that proves short vanilla wording and persisted runtime truth on cold start.
- [ ] `src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx` — add a header/action-cluster seam that locks CTA height, icon scale, padding, and wrapping across installed catalog primary actions.
- [ ] `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx` may need to stop tolerating noisy status text if Phase 33 removes remaining top-level summary clutter.
- [ ] `src/verification/manual/__tests__/views.test.ts` should gate `modpack-list` and `modpack-browser` route descriptions against the new direct-feedback classic/catalog contract rather than legacy density wording.

Wave 0 ownership should be explicit in the plans:

- `33-01` owns the classic sidebar truth seam before label or cold-start claims are considered done.
- `33-02` owns catalog control proof adjustments before control-density cleanup is trusted.
- `33-03` depends on `33-02` and owns the new action-cluster seam before card-density or button-contract claims are considered done.
- `33-04` depends on the earlier execution plans and owns the manual-proof wording refresh before later audits rely on those routes.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Classic mode reads truthful runtime state on a cold app launch | MODPACK-07 | unit tests cannot fully judge perceived trust when the app wakes from a real cold start | Launch FMCL from a closed state, open Classic immediately, confirm displayed version and loader match the actual launch target, and confirm vanilla wording is short enough to fit without overloaded bracket text |
| Installed catalog feels compact and scan-friendly at common desktop widths | MODPACK-08, MODPACK-09 | DOM assertions cannot fully judge whether the screen still feels vertically heavy | Open the installed modpack list at common desktop widths, confirm search/filter controls stay on one compact surface, confirm top-level summary noise is gone, and confirm cards expose only the small set of summary facts needed before details |
| Header and card actions feel like one contract instead of mixed component families | MODPACK-10 | shared class names alone do not prove real visual coherence | Compare `Import from Code`, `Create`, `Browse modpacks`, installed-card actions, and browser primary actions in one session; confirm heights, icon scale, padding, and wrapping feel intentionally matched |
| Manual proof routes describe the current classic/catalog contract | MODPACK-07, MODPACK-08, MODPACK-09, MODPACK-10 | stale proof copy can mask product regressions even when automated tests stay green | Open the `modpack-list` and `modpack-browser` manual routes and confirm their descriptions instruct reviewers to check classic truth, compact controls, reduced card metadata, and coherent action geometry |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit Wave 0 ownership
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 identifies the missing proof seams before execution depends on them
- [x] No watch-mode flags
- [x] Feedback latency < 240s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-22
