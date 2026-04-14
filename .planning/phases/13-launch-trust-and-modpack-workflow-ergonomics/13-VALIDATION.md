---
phase: 13
slug: launch-trust-and-modpack-workflow-ergonomics
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/SimplePlayDashboard.route.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~180 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest or static/type command for the affected seam, or the quick run command above if multiple launch/modpack surfaces changed together
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | LAUNCH-01, LAUNCH-02 | static/type | `npx eslint src/features/launcher/hooks/useLauncher.ts src/features/launcher/hooks/useLauncherIPC.ts src/components/sidebar/LaunchControls.tsx src/components/Sidebar.tsx src/components/SimplePlayDashboard.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 13-01-02 | 01 | 1 | LAUNCH-01, LAUNCH-02 | component | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` | ❌ planned | ⬜ pending |
| 13-02-01 | 02 | 1 | MPUX-01 | static/type | `npx eslint src/components/modpacks/CreateModpackModal.tsx src/components/modpacks/ModpackCreationWizard.tsx src/components/sidebar/ModloaderSection.tsx electron/services/modpacks/modpackService.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 13-02-02 | 02 | 1 | MPUX-01 | component+service | `npx vitest run src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx electron/services/modpacks/__tests__/modpackService.createLocalDependencies.test.ts` | ❌ planned | ⬜ pending |
| 13-03-01 | 03 | 2 | MPUX-02 | static/type | `npx eslint src/components/modpacks/ModpackBrowser.tsx src/features/modpacks/hooks/useModpackNavigation.ts electron/services/mods/platform/modPlatformService.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 13-03-02 | 03 | 2 | MPUX-02 | component | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx` | ❌ planned | ⬜ pending |
| 13-04-01 | 04 | 2 | MPUX-03 | static/type | `npx eslint src/components/modpacks/ModpackList.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 13-04-02 | 04 | 2 | MPUX-03 | component | `npx vitest run src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx` | ❌ planned | ⬜ pending |
| 13-05-01 | 05 | 3 | LAUNCH-01, LAUNCH-02, MPUX-01, MPUX-02, MPUX-03 | full gate + manual | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx electron/services/modpacks/__tests__/modpackService.createLocalDependencies.test.ts src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx && npm test && npm run lint && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Main play surface communicates preparing, downloading, launching, waiting, failed, and running states clearly enough that the user does not assume a freeze | LAUNCH-01, LAUNCH-02 | Stage trust is experiential and depends on real pacing, message hierarchy, and disabled-action affordances | Open the launcher, trigger launch-state transitions through the verification harness or live runtime, and confirm the main play surface changes state visibly without requiring the console to understand what is happening |
| Create-modpack flow shows required runtime dependencies truthfully before confirmation and the resulting pack keeps those dependencies consistent in its summary/header | MPUX-01 | The critical failure is a combined data + UI truth problem, not only a DOM structure problem | Create a local modpack, verify Minecraft version and selected loader are shown before create/finish, then open the created pack and confirm the same dependency truth is still visible |
| Remote browser and installed-pack cards stay easy to scan and act on at common resized widths | MPUX-02, MPUX-03 | Density, scan speed, and menu/action ergonomics are browser-visible behaviors | Check the remote browser and installed modpack list at default and narrower desktop widths, confirm filters and paging remain legible, and verify common card actions do not require awkward extra hops |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
