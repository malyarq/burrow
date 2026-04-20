---
phase: 28
slug: product-restraint-and-native-shell-truth
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-20
---

# Phase 28 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/TitleBar.branding.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run electron/window/__tests__/windowManager.macos.test.ts src/components/__tests__/TitleBar.branding.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/contexts/__tests__/ModpackContext.startup-truth.test.ts electron/services/instances/__tests__/legacySeed.startupTruth.test.ts && npx tsc --noEmit && npx eslint src/ electron/` |
| **Estimated runtime** | ~240 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific verify command for the task you touched. Use the quick run command above when work crosses shell, update-locality, and startup-truth seams in one task.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Wave 1 may stay on the quick run command; waves that introduce new phase-owned tests must extend the suite with those new files immediately.
- **Before `$gsd-verify-work`:** The full suite must be green, and manual proof must exist for native macOS shell behavior and real quit/relaunch startup truth.
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 28-01-01 | 01 | 1 | SHELL-05 | main-process shell branch | `npx vitest run electron/window/__tests__/windowManager.macos.test.ts && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 28-01-02 | 01 | 1 | SHELL-05 | renderer shell seam | `npx vitest run src/components/__tests__/TitleBar.branding.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx && npx eslint src/components/TitleBar.tsx src/components/AppLayout.tsx electron/window/windowManager.ts && npx tsc --noEmit` | ✅ / ❌ W0 | ⬜ pending |
| 28-02-01 | 02 | 2 | SHELL-06 | shell restraint surfaces | `npx vitest run src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 28-02-02 | 02 | 2 | SHELL-06 | shell surface lint/type | `npx eslint src/components/sidebar/SidebarHeader.tsx src/components/SimplePlayDashboard.tsx src/components/SimplePlayHome.tsx src/components/settings/tabs/AppearanceTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 28-03-01 | 03 | 3 | SHELL-07 | positive update locality | `npx vitest run src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 28-03-02 | 03 | 3 | SHELL-07 | negative shell-level update urgency | `npx vitest run src/components/__tests__/UpdateNotification.layout.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npx eslint src/components/UpdateNotification.tsx src/components/SimplePlayDashboard.tsx src/features/modpacks/hooks/useModpackUpdates.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 28-04-01 | 04 | 4 | SHELL-08 | startup truth hydration | `npx vitest run src/contexts/__tests__/ModpackContext.startup-truth.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 28-04-02 | 04 | 4 | SHELL-08 | persistence + legacy migration | `npx vitest run electron/services/instances/__tests__/instanceMetadataCrud.test.ts electron/services/instances/__tests__/legacySeed.startupTruth.test.ts && npx eslint src/contexts/ModpackContext.tsx src/contexts/instances/hooks/useInstanceBootstrap.ts src/features/launch/hooks/useLaunchState.ts electron/services/instances/indexStore.ts electron/services/instances/configStore.ts electron/services/instances/instanceService.ts && npx tsc --noEmit` | ✅ / ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `electron/window/__tests__/windowManager.macos.test.ts` — assert `BrowserWindow` macOS chrome contract for `SHELL-05`
- [ ] `src/contexts/__tests__/ModpackContext.startup-truth.test.ts` — prove persisted selection/runtime truth hydrates before shell labels claim defaults for `SHELL-08`
- [ ] `electron/services/instances/__tests__/legacySeed.startupTruth.test.ts` — lock legacy bootstrap behavior so `1.12.2`/`vanilla` fallback does not override better persisted truth for `SHELL-08`

Existing infrastructure otherwise covers the phase:

- `vitest.config.ts`
- existing shell/component seams under `src/components/__tests__/`
- existing instance persistence seam `electron/services/instances/__tests__/instanceMetadataCrud.test.ts`
- standard repo checks `npx tsc --noEmit`, `npx eslint src/`, and `npx eslint electron/`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Native macOS shell behaves like a native-first window | SHELL-05 | jsdom cannot prove real `BrowserWindow` traffic lights, drag behavior, or absence of competing right-side controls | Launch FMCL on macOS, confirm traffic lights are visible and unobstructed, confirm there is no competing custom control group on the right, confirm the update banner sits below shell chrome, and confirm the window still drags as expected |
| Top-level shell surfaces feel restrained instead of overbranded | SHELL-06 | visual weight and product restraint cannot be fully captured by narrow component assertions | Open launcher-home/dashboard, sidebar, and settings appearance surfaces; confirm there is no loud hero-brand block or redundant logo panel replacing product orientation |
| Modpack update urgency stays local | SHELL-07 | automated tests can prove DOM boundaries, but product weight and scanability still need human review | Open modpack list and details for a pack with an available update; confirm update state appears only on list/detail surfaces, remains calm, and does not outrank launch intent on launcher-home or shell chrome |
| Reopen/restart shows truthful selected profile and runtime | SHELL-08 | persisted truth after full quit/relaunch crosses storage and app lifecycle in a way unit tests only approximate | Switch to Classic mode, choose a non-default version and loader, switch to Modpacks and select a non-default installed pack, fully quit the app, relaunch, and confirm visible shell mode, selected pack, version, and loader all match persisted truth before corrective interaction |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or explicit Wave 0 dependencies
- [ ] Wave 0 closes every missing main-process or startup-truth seam before execution depends on them
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] No watch-mode flags
- [ ] Feedback latency < 240s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
