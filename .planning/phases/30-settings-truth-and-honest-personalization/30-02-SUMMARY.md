---
phase: 30-settings-truth-and-honest-personalization
plan: "02"
subsystem: ui
tags: [react, electron, typescript, vitest, settings, layout]
requires:
  - phase: 30-01
    provides: deterministic appearance runtime contract
provides:
  - compact shell-owned settings framing and navigation
  - embedded utility panels that stop duplicating hero and summary shells
  - direct route-level regression coverage for launcher, downloads, statistics, storage, and accounts tabs
affects: [settings-shell, settings-tabs, downloads, launcher, storage, accounts, mirrors, statistics]
tech-stack:
  added: []
  patterns:
    - shell-owned orientation copy
    - embedded utility tab framing
key-files:
  created:
    - src/components/__tests__/SettingsPage.downloads.test.tsx
    - src/components/__tests__/SettingsPage.launcher.test.tsx
    - src/components/__tests__/SettingsPage.launcher.i18n.test.tsx
    - src/components/__tests__/SettingsPage.statistics.test.tsx
    - src/components/__tests__/SettingsPage.storage.test.tsx
    - src/features/accounts/__tests__/AccountsPage.layout.test.tsx
    - src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx
    - src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx
  modified:
    - src/components/SettingsPage.tsx
    - src/components/settings/SettingsTabsHeader.tsx
    - src/components/settings/tabs/DownloadsTab.tsx
    - src/components/settings/tabs/LauncherTab.tsx
    - src/components/settings/tabs/StorageTab.tsx
    - src/features/settings/mirrors/MirrorsSettings.tsx
    - src/features/accounts/AccountsPage.tsx
    - src/features/settings/statistics/StatisticsTab.tsx
    - src/components/__tests__/SettingsPage.navigation.test.tsx
    - src/components/__tests__/SettingsPage.accounts.test.tsx
    - src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx
    - src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx
    - src/components/settings/__tests__/SecondarySettingsTabs.test.tsx
requirements-completed: [SETTINGS-02]
completed: 2026-04-20
---

# Phase 30 Plan 02: Settings Truth And Honest Personalization Summary

**Compact settings shell hierarchy with embedded utility surfaces that stop restacking their own page chrome**

## Accomplishments

- Reduced top-level settings framing to one shell-owned summary seam and lighter tabs so the modal stops repeating description and hint blocks above and below the active panel.
- Added explicit `embedded` behavior for Downloads, Launcher, Storage, Accounts, Mirrors, and Statistics so those surfaces suppress nested hero cards and reuse the shell hierarchy instead of rendering a second page inside the settings page.
- Kept standalone utility surfaces usable by preserving local context where it still matters outside the settings shell.
- Added direct route-level tests for downloads, launcher, statistics, storage, accounts, mirrors, and statistics embedding so geometry drift now fails where users actually see it.

## Decisions Made

- The settings shell owns orientation copy exactly once; embedded panels should only show task-local content, not restate page-level framing.
- Route-level settings tests are the authoritative seam for compact-shell regressions, not just isolated utility component tests with mocked shells.

## Task Commits

No isolated task commit was created for this plan. Execution continued on top of an already dirty local baseline, and the authoritative record is captured in this summary plus the updated planning artifacts.

## Verification

- `npx vitest run src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.launcher.i18n.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountsPage.layout.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx`
- `npx tsc --noEmit`

---
*Phase: 30-settings-truth-and-honest-personalization*
*Completed: 2026-04-20*
