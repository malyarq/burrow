---
phase: 28-product-restraint-and-native-shell-truth
verified_on: 2026-04-20
status: passed
requirements:
  - SHELL-05
  - SHELL-06
  - SHELL-07
  - SHELL-08
---

# Phase 28 Verification

## Goal Check

Phase 28 goal was to remove top-level launcher noise, restore native shell behavior where the platform expects it, and make reopened app state match the user's real runtime context before deeper workflow cleanup begins.

That goal is satisfied in the current codebase:

- macOS main windows now use native-first framed `hiddenInset` chrome instead of a frameless hybrid contract.
- Critical shell surfaces no longer rely on loud hero-brand fallback treatment for orientation.
- Modpack update urgency is confined to modpack-owned surfaces instead of the global shell.
- Startup and restart flows now wait for persisted selection/runtime truth instead of rendering stale `1.12.2` / `vanilla` defaults.

## Evidence Basis

- Execution evidence comes from `28-01-SUMMARY.md`, `28-02-SUMMARY.md`, `28-03-SUMMARY.md`, and `28-04-SUMMARY.md`.
- Validation contract comes from `28-VALIDATION.md`, now marked `complete` with Wave 0 seams landed.
- Requirement ownership still matches the roadmap and archived milestone requirements truth:
  - `.planning/ROADMAP.md` assigns `SHELL-05` through `SHELL-08` to Phase 28.
  - `.planning/milestones/v0.6.0-REQUIREMENTS.md` marks `SHELL-05` through `SHELL-08` complete.
- Final automated closeout was rerun on the current baseline:

```bash
npx vitest run electron/window/__tests__/windowManager.macos.test.ts \
  src/components/__tests__/TitleBar.branding.test.tsx \
  src/components/__tests__/UpdateNotification.layout.test.tsx \
  src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx \
  src/components/__tests__/SimplePlayHome.visualTruth.test.tsx \
  src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx \
  src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx \
  src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx \
  src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx \
  src/components/settings/__tests__/AppearanceTab.branding.test.tsx \
  src/contexts/__tests__/ModpackContext.startup-truth.test.ts \
  electron/services/instances/__tests__/instanceMetadataCrud.test.ts \
  electron/services/instances/__tests__/legacySeed.startupTruth.test.ts \
  && npx tsc --noEmit \
  && npx eslint src/ electron/
```

## Requirement Matrix

| Requirement | Status | Evidence | Residual debt / blocker |
| --- | --- | --- | --- |
| SHELL-05 | Verified | `electron/window/windowManager.ts` now resolves macOS main windows to `frame: true` + `titleBarStyle: 'hiddenInset'`; `src/services/ipc/windowControlsIPC.ts`, `src/components/TitleBar.tsx`, and `src/components/AppLayout.tsx` keep renderer chrome subordinate to the native shell contract; `electron/window/__tests__/windowManager.macos.test.ts`, `src/components/__tests__/TitleBar.branding.test.tsx`, and `src/components/__tests__/UpdateNotification.layout.test.tsx` are green. | Real macOS traffic-light/drag walkthrough was auto-approved by workflow policy and was not interactively executed in this terminal turn. |
| SHELL-06 | Verified | `src/components/sidebar/SidebarHeader.tsx`, `src/components/SimplePlayDashboard.tsx`, `src/components/SimplePlayHome.tsx`, and `src/components/settings/tabs/AppearanceTab.tsx` now orient around app context rather than hero-brand filler; focused regression coverage is green in `SidebarHeader.compact-mode`, `SimplePlayDashboard.launch-state`, `SimplePlayHome.visualTruth`, and `AppearanceTab.branding`. | Visual restraint sampling was auto-approved rather than manually reviewed in-app during this turn. |
| SHELL-07 | Verified | `src/components/UpdateNotification.tsx` is explicitly launcher-scoped, while `src/components/modpacks/ModpackList.tsx`, `src/components/modpacks/details/ModpackDetailsActions.tsx`, and `src/components/modpacks/ModpackUpdateModal.tsx` keep update urgency local to pack surfaces; focused modpack and shell regression tests are green. | Human scanability review for update weight was auto-approved rather than interactively sampled during this turn. |
| SHELL-08 | Verified | `src/App.tsx`, `src/contexts/ModpackContext.tsx`, and `src/features/launch/hooks/useLaunchState.ts` now gate visible shell labels on hydrated truth; `src/contexts/instances/services/legacySeed.ts`, `electron/services/instances/indexStore.ts`, and `electron/services/instances/configStore.ts` recover persisted truth before fallback; `ModpackContext.startup-truth`, `instanceMetadataCrud`, and `legacySeed.startupTruth` tests are green. | Full quit/relaunch walkthrough was auto-approved by workflow policy and not executed manually in this terminal turn. |

## Bounded Residuals

- Manual-only checklist items from `28-VALIDATION.md` were not interactively run here. They were auto-approved because `workflow.auto_advance=true` during execution.
- This does not reopen a Phase 28 implementation gap. It is release-signoff sampling debt, not a code or requirement-coverage failure.

## Audit Outcome

- Phase 28 requirements `SHELL-05`, `SHELL-06`, `SHELL-07`, and `SHELL-08` are all covered by landed code, focused regression seams, and a rerun of the full automated phase suite.
- No implementation gaps were found in the current Phase 28 scope.
- Phase 28 passes verification and the roadmap can remain advanced to Phase 29 planning.
