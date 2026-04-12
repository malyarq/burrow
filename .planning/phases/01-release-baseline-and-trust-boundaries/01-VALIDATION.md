---
phase: 1
slug: release-baseline-and-trust-boundaries
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other — ESLint + TypeScript + repo structural checks + targeted manual abuse matrix |
| **Config file** | `eslint.config.js`, `tsconfig.json`, `package.json` scripts |
| **Quick run command** | task-specific `<verify>` command from the active PLAN task |
| **Full suite command** | `npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` |
| **Estimated runtime** | task checks: 15-90s; full suite: ~120-180s |

---

## Execution Map

| Wave | Plans | Focus |
|------|-------|-------|
| 0 | setup gate before `01-01` and `01-02` | `npm ci` (if needed) plus the manual abuse fixture matrix are required before either root Wave 1 branch may run automated verification |
| 1 | `01-01`, `01-02` | Core renderer baseline recovery plus modpacks/worlds seam cleanup before deeper hardening |
| 2 | `01-03`, `01-04`, `01-08` | Typed preload and wrapper alignment, privileged ingress validation, and path-guard foundation |
| 3 | `01-05`, `01-06`, `01-07`, `01-09` | Service-level containment, archive/import hardening, typed external-link trust path, and persisted insecure config disablement |
| 4 | `01-10` | Secondary renderer cleanup plus repo-wide release-gate closeout |

---

## Sampling Rate

- **After every task:** Run that task's exact `<verify>` command before moving on.
- **After every completed plan:** Run the plan's full `<verification>` checklist, not just the last task check.
- **After Wave 1:** Run `npx eslint src/components/layout/BackgroundLayer.tsx src/features/accounts/AccountsPage.tsx src/features/accounts/AddAccountDialog.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/components/settings/tabs/StorageTab.tsx electron/ipc/handlers/modpacksHandlers.ts shared/contracts/worlds.ts src/services/ipc/worldsIPC.ts && npm run contracts:check && npm run ipc:check && npx tsc --noEmit`.
- **After Wave 2:** Run `npx eslint electron/preload.ts electron/preload/bridges/IpcRendererBridge.ts electron/preload/bridges/AccountBridge.ts electron/preload/bridges/MirrorsBridge.ts electron/preload/bridges/ShareBridge.ts electron/ipc/validation/privilegedPayloads.ts electron/ipc/handlers/accountHandlers.ts electron/ipc/handlers/mirrorsHandlers.ts electron/ipc/handlers/shareHandlers.ts electron/ipc/handlers/settingsHandlers.ts electron/ipc/handlers/modpacksHandlers.ts electron/security/pathGuards.ts electron/services/instances/paths.ts electron/ipc/handlers/worldsHandlers.ts electron/ipc/handlers/resourcePacksHandlers.ts electron/ipc/handlers/shadersHandlers.ts electron/ipc/handlers/screenshotsHandlers.ts src/services/ipc/accountIPC.ts src/services/ipc/mirrorsIPC.ts src/services/ipc/shareIPC.ts src/features/accounts/AccountsPage.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/features/settings/mirrors/MirrorsSettings.tsx shared/contracts src/vite-env.d.ts && npm run contracts:check && npm run ipc:check && npx tsc --noEmit`.
- **After Wave 3:** Run `npx eslint electron/services/account/accountService.ts electron/services/mirrors/mirrorsService.ts electron/services/worlds/worldService.ts electron/services/resourcePacks/resourcePackService.ts electron/services/shaders/shaderService.ts electron/services/screenshots/screenshotService.ts electron/services/modpacks/importers/localInstaller.ts electron/services/instances/importer/InstanceImporterService.ts electron/services/modpacks/modpackService.ts electron/ipc/handlers/externalLinksHandlers.ts electron/ipc/ipcManager.ts electron/security/externalUrls.ts electron/window/windowManager.ts electron/preload.ts electron/preload/bridges/ExternalLinksBridge.ts electron/preload/bridges/IpcRendererBridge.ts src/services/ipc/externalLinksIPC.ts src/components/modpacks/details/ModsTab.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/features/accounts/AccountsPage.tsx src/features/settings/mirrors/MirrorsSettings.tsx shared/contracts src/vite-env.d.ts && npm run contracts:check && npm run ipc:check && npx tsc --noEmit`.
- **After Wave 4 / before `$gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 90 seconds for task-level checks, 180 seconds for wave-level suites.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-T1 | 01-01 | 1 | REL-01 | targeted lint | `npx eslint src/components/layout/BackgroundLayer.tsx src/features/accounts/AccountsPage.tsx src/components/settings/tabs/StorageTab.tsx` | ✅ | ⬜ pending |
| 01-01-T2 | 01-01 | 1 | REL-01 | targeted lint + manual UX smoke | `npx eslint src/features/accounts/AccountsPage.tsx src/features/accounts/AddAccountDialog.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/components/settings/tabs/StorageTab.tsx src/contexts/ConfirmContext.tsx src/components/ui/ConfirmDialog.tsx` | ✅ | ⬜ pending |
| 01-01-T3 | 01-01 | 1 | REL-01 | targeted lint + typecheck | `npx eslint src/components/layout/BackgroundLayer.tsx src/features/accounts/AccountsPage.tsx src/features/accounts/AddAccountDialog.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/components/settings/tabs/StorageTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-02-T1 | 01-02 | 1 | SEC-01 | handler lint + IPC structure | `npx eslint electron/ipc/handlers/modpacksHandlers.ts && npm run ipc:check` | ✅ | ⬜ pending |
| 01-02-T2 | 01-02 | 1 | SEC-01 | contract seam verification | `npm run contracts:check && npm run ipc:check && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-03-T1 | 01-03 | 2 | SEC-01 | targeted lint | `npx eslint electron/ipc/validation/privilegedPayloads.ts` | ✅ | ⬜ pending |
| 01-03-T2 | 01-03 | 2 | SEC-01 | handler lint + typecheck | `npx eslint electron/ipc/handlers/accountHandlers.ts electron/ipc/handlers/mirrorsHandlers.ts electron/ipc/handlers/shareHandlers.ts electron/ipc/handlers/settingsHandlers.ts electron/ipc/handlers/modpacksHandlers.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-04-T1 | 01-04 | 2 | SEC-02 | targeted lint | `npx eslint electron/security/pathGuards.ts electron/services/instances/paths.ts` | ✅ | ⬜ pending |
| 01-04-T2 | 01-04 | 2 | SEC-01, SEC-02 | handler lint + typecheck | `npx eslint electron/ipc/handlers/worldsHandlers.ts electron/ipc/handlers/resourcePacksHandlers.ts electron/ipc/handlers/shadersHandlers.ts electron/ipc/handlers/screenshotsHandlers.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-08-T1 | 01-08 | 2 | SEC-01, SEC-03 | preload and contract lint | `npx eslint electron/preload.ts electron/preload/bridges/IpcRendererBridge.ts electron/preload/bridges/AccountBridge.ts electron/preload/bridges/MirrorsBridge.ts electron/preload/bridges/ShareBridge.ts shared/contracts/windowApi.ts shared/contracts/account.ts shared/contracts/mirrors.ts shared/contracts/share.ts && npm run contracts:check` | ✅ | ⬜ pending |
| 01-08-T2 | 01-08 | 2 | SEC-01, SEC-03 | wrapper lint + IPC checks | `npx eslint src/services/ipc/accountIPC.ts src/services/ipc/mirrorsIPC.ts src/services/ipc/shareIPC.ts src/features/accounts/AccountsPage.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/vite-env.d.ts && npm run ipc:check && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-05-T1 | 01-05 | 3 | SEC-02 | service lint + typecheck | `npx eslint electron/services/worlds/worldService.ts electron/services/resourcePacks/resourcePackService.ts electron/services/shaders/shaderService.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-05-T2 | 01-05 | 3 | SEC-02 | service lint + typecheck | `npx eslint electron/services/screenshots/screenshotService.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-06-T1 | 01-06 | 3 | SEC-02 | importer lint + typecheck | `npx eslint electron/services/modpacks/importers/localInstaller.ts electron/services/instances/importer/InstanceImporterService.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-06-T2 | 01-06 | 3 | SEC-02 | service lint + typecheck | `npx eslint electron/services/modpacks/modpackService.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-07-T1 | 01-07 | 3 | SEC-03 | typed boundary lint + contract checks | `npx eslint shared/contracts/externalLinks.ts shared/contracts/windowApi.ts src/services/ipc/externalLinksIPC.ts src/components/modpacks/details/ModsTab.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/vite-env.d.ts && npm run contracts:check` | ✅ | ⬜ pending |
| 01-07-T2 | 01-07 | 3 | SEC-03 | preload and main lint + IPC checks | `npx eslint electron/preload.ts electron/preload/bridges/ExternalLinksBridge.ts electron/ipc/handlers/externalLinksHandlers.ts electron/ipc/ipcManager.ts electron/security/externalUrls.ts electron/window/windowManager.ts && npm run ipc:check && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-07-T3 | 01-07 | 3 | SEC-03 | build + posture verification | `npm run build -- --publish never` | ✅ | ⬜ pending |
| 01-09-T1 | 01-09 | 3 | SEC-01, SEC-03 | persisted-state service lint + typecheck | `npx eslint electron/services/account/accountService.ts electron/services/mirrors/mirrorsService.ts shared/types/account.ts shared/types/mirrors.ts shared/contracts/account.ts shared/contracts/mirrors.ts src/services/ipc/accountIPC.ts src/services/ipc/mirrorsIPC.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-09-T2 | 01-09 | 3 | SEC-01, SEC-03 | UI lint + typecheck | `npx eslint src/features/accounts/AccountsPage.tsx src/features/settings/mirrors/MirrorsSettings.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-10-T1 | 01-10 | 4 | REL-01, REL-02 | secondary renderer lint + typecheck | `npx eslint src/components/modpacks/ModpackList.tsx src/components/modpacks/ImportModpackPreviewModal.tsx src/components/modpacks/ImportModpackPreviewPage.tsx src/contexts/ConfirmContext.tsx src/components/ui/ConfirmDialog.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-10-T2 | 01-10 | 4 | REL-02 | warning cleanup lint + typecheck | `npx eslint src/components/modpacks/ModpackList.tsx src/components/settings/tabs/AppearanceTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 01-10-T3 | 01-10 | 4 | REL-02 | full release gate | `npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `01-01` and `01-02` both gate entry on `npm ci` when `node_modules/` is absent, so neither Wave 1 root branch can skip dependency setup
- [x] `01-01` and `01-02` both gate entry on the shared manual abuse fixture matrix for insecure auth URLs, insecure mirror URLs, traversal archives, unsafe settings paths, unfamiliar external domains, and repo-wide warning-only lint hotspots
- [x] Execution follows the wave map above and no task skips its targeted `<verify>` command

---

## Manual-Only Verifications

| Behavior | Plan/Task Anchor | Requirement | Why Manual | Test Instructions |
|----------|------------------|-------------|------------|-------------------|
| Inline recovery after blocked action | `01-01-T2`, `01-09-T2`, `01-10-T1` | REL-01, SEC-01, REL-02 | UX requirement across multiple flows | In accounts, share, storage cleanup, mirrors, modpack rename or duplicate, and modpack import preview, submit invalid or blocked input and verify the user stays in-flow with a retry path |
| Unsafe saved auth/mirror config disablement | `01-09-T1`, `01-09-T2` | SEC-01, SEC-03 | Requires persisted state migration and reload behavior | Seed an insecure saved config, restart FMCL, and verify it is disabled visibly instead of silently used |
| Path traversal rejected at handler boundary | `01-04-T2` | SEC-01, SEC-02 | Needs crafted inputs across several content tabs | Trigger world, resource pack, shader, and screenshot actions with `../`, absolute paths, or cross-root targets and verify FMCL blocks them before the action starts |
| Service-level containment still holds after ingress | `01-05-T1`, `01-05-T2` | SEC-02 | Needs real filesystem mutation attempts | Exercise delete, rename, copy, and open flows with escaped targets and verify no file outside the approved roots is touched |
| Archive traversal handling | `01-06-T1`, `01-06-T2` | SEC-02 | Needs crafted archive fixtures and import flow confirmation | Import an archive containing `../` or absolute-path entries and verify FMCL blocks or explicitly confirms according to the decided UX before writing files |
| Unknown external domain confirmation | `01-07-T1`, `01-07-T2` | SEC-03 | Depends on Electron navigation and user prompt flow | Trigger a trusted URL, an unfamiliar URL, and a dangerous-scheme URL from the renderer and verify FMCL opens, confirms, or blocks them according to policy |
| Sandbox fallback posture | `01-07-T3` | SEC-03 | Requires runtime behavior, not just config inspection | If `sandbox` remains disabled, verify the renderer still lacks Node globals, only supported preload APIs are reachable, and external navigation controls remain active |
| Secondary renderer release-gate smoke | `01-10-T1`, `01-10-T2`, `01-10-T3` | REL-01, REL-02 | Full lint cannot prove interactive recovery or secondary UI behavior | Verify modpack rename or duplicate, modpack import preview recovery, and appearance theme import or export still work after the final cleanup and repo-wide gate passes |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers dependency and fixture prerequisites
- [x] No watch-mode flags
- [x] Feedback latency < 180s at the wave level and < 90s at the task level
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
