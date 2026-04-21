---
phase: 29
slug: modpack-workflow-simplification-and-runtime-truth
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-20
---

# Phase 29 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/features/modpacks/__tests__/modpackNavigationState.test.tsx && npx tsc --noEmit && npx eslint src/ electron/` |
| **Estimated runtime** | ~240 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific verify command for the touched plan area; use the quick run command when work crosses catalog, details, runtime, and async create/add seams together.
- **After every plan wave:** Run the full suite command for all completed Phase 29 seams.
- **Before `$gsd-verify-work`:** Full suite must be green, and manual proof must exist for catalog scanability, detail tab reachability, and live create/add recovery feel.
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 29-01-01 | 01 | 1 | MODPACK-01 | catalog controls composition | `npx vitest run src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx && npx tsc --noEmit` | ✅ / ✅ / ✅ | ⬜ pending |
| 29-01-02 | 01 | 1 | MODPACK-02 | card density truth | `npx vitest run src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx && npx tsc --noEmit` | ✅ / ✅ | ⬜ pending |
| 29-02-01 | 02 | 2 | MODPACK-03 | details layout + tabs | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx && npx tsc --noEmit` | ✅ / ✅ / ✅ | ⬜ pending |
| 29-03-01 | 03 | 3 | MODPACK-04 | runtime summary authority | `npx vitest run src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npx tsc --noEmit` | ✅ / ✅ / ✅ | ⬜ pending |
| 29-03-02 | 03 | 3 | MODPACK-05 | dependency warning semantics | `npx vitest run src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx && npx tsc --noEmit` | ✅ / ✅ | ⬜ pending |
| 29-04-01 | 04 | 4 | MODPACK-06 | create/add async flow stability | `npx vitest run src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/features/modpacks/__tests__/modpackNavigationState.test.tsx && npx tsc --noEmit` | ✅ / ✅ / ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx` — shared compact installed/remote controls composition for `MODPACK-01`
- [ ] `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts` — authoritative runtime-summary precedence and normalized output for `MODPACK-04`
- [ ] `src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx` — create-flow busy-state and post-commit failure recovery for `MODPACK-06`
- [ ] `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx` — add-flow stale-response ordering, hidden-selection truth, and mixed-success recovery for `MODPACK-06`

Existing infrastructure otherwise covers the phase:

- `vitest.config.ts`
- current modpack catalog/detail layout seams under `src/components/modpacks/__tests__/`
- navigation persistence seam `src/features/modpacks/__tests__/modpackNavigationState.test.tsx`
- standard repo checks `npx tsc --noEmit`, `npx eslint src/`, and `npx eslint electron/`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Compact catalog controls feel scan-friendly on real desktop widths | MODPACK-01, MODPACK-02 | DOM assertions can prove composition, but not whether the new control row feels cramped or clearly readable in the live app | Open installed list and remote browser, confirm search/filters read as one compact row, buttons share one geometry, and cards expose only high-value summary data |
| Detail tabs feel reachable without fighting scroll | MODPACK-03 | Component tests can prove layout structure, but not the actual perceived ease of switching and scanning tabs in the running app | Open modpack details on a realistic desktop viewport and confirm tabs remain visible and content starts above the fold without action blocks pushing it away |
| Create/add failure recovery feels explicit and stable | MODPACK-06 | Unit tests can model error branches, but they cannot fully judge how post-commit recovery and mixed-success feedback feels in the live flow | Trigger create/add failures and partial success cases, confirm the user stays on the current surface, sees what succeeded or failed, and gets retry or finish guidance without silent close or reload dependence |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or explicit Wave 0 dependencies
- [x] Wave 0 closes the currently missing compact-controls, runtime-authority, and async-recovery seams before phase closeout depends on them
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] No watch-mode flags
- [x] Feedback latency < 240s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-20
