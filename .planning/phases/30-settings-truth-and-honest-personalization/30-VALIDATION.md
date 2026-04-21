---
phase: 30
slug: settings-truth-and-honest-personalization
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-20
---

# Phase 30 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/StorageTab.layout.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.launcher.i18n.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountsPage.layout.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/StorageTab.layout.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.launcher.i18n.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountsPage.layout.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit && npx eslint src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts src/contexts/settings/types.ts src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/settingsTabs.ts src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/DownloadsTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/tabs/StorageTab.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/features/accounts/AccountsPage.tsx src/features/settings/statistics/StatisticsTab.tsx src/components/layout/BackgroundLayer.tsx src/components/ui/CollapsibleSection.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx src/components/ui/Button.tsx src/verification/manual/scenarios.tsx src/verification/manual/views.ts` |
| **Estimated runtime** | ~240 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific verify command for the touched task. If work spans runtime truth, shell hierarchy, honest control destination, and geometry together, run the quick run command instead of narrower slices.
- **After Wave 1:** Run the runtime truth lane from Plan `30-01`.
- **After Waves 2-3:** Run the quick run command to keep runtime, shell, geometry, direct Downloads and Launcher routes, and utility-tab seams synchronized.
- **Before Task `30-04-03`:** Run the explicit pre-`CUSTOM-01` truth gate from Plan `30-04`, and do not open customization work until it and the companion manual truth walkthrough are green.
- **After Wave 4 and before `$gsd-verify-work`:** Run the full suite command, then complete the manual appearance walkthrough covering preset import/export truth, shell density, truthful control scope, and either the bounded customized-from-preset state or the explicit no-ship defer.
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 30-01-01 | 01 | 1 | SETTINGS-01 | runtime contract + document tokens | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts && npx tsc --noEmit` | ✅ / ✅ | ⬜ pending |
| 30-01-02 | 01 | 1 | SETTINGS-01 | preset state + accent persistence + import/export round-trip + background truth | `npx vitest run src/components/layout/__tests__/BackgroundLayer.motion.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/contexts/settings/__tests__/themeRuntimeContract.test.ts && npx eslint src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts src/components/settings/tabs/AppearanceTab.tsx src/components/layout/BackgroundLayer.tsx && npx tsc --noEmit` | ✅ / ✅ / ✅ / ✅ | ⬜ pending |
| 30-02-01 | 02 | 2 | SETTINGS-02 | settings shell navigation + a11y | `npx vitest run src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx && npx tsc --noEmit` | ✅ / ✅ / ✅ | ⬜ pending |
| 30-02-02 | 02 | 2 | SETTINGS-02 | embedded utility-tab hierarchy | `npx vitest run src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx && npx eslint src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/settingsTabs.ts src/components/settings/tabs/DownloadsTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/tabs/StorageTab.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/features/accounts/AccountsPage.tsx src/features/settings/statistics/StatisticsTab.tsx && npx tsc --noEmit` | ✅ existing + ❌ planned (`SettingsPage.downloads.test.tsx`, `SettingsPage.launcher.test.tsx`, `SettingsPage.statistics.test.tsx`, `SettingsPage.storage.test.tsx`) | ⬜ pending |
| 30-03-01 | 03 | 3 | SETTINGS-02, SETTINGS-03 | shared geometry + utility-surface layout | `npx vitest run src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/StorageTab.layout.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountsPage.layout.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx && npx eslint src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/DownloadsTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/tabs/StorageTab.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/features/accounts/AccountsPage.tsx src/features/settings/statistics/StatisticsTab.tsx src/components/ui/CollapsibleSection.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx src/components/ui/Button.tsx && npx tsc --noEmit` | ✅ existing + ❌ planned (`SettingsPage.downloads.test.tsx`, `SettingsPage.launcher.test.tsx`, `SettingsPage.statistics.test.tsx`, `SettingsPage.storage.test.tsx`, `StorageTab.layout.test.tsx`, `AccountsPage.layout.test.tsx`, `MirrorsSettings.layout.test.tsx`, `StatisticsTab.layout.test.tsx`) | ⬜ pending |
| 30-03-02 | 03 | 3 | SETTINGS-03 | truthful copy + honest moved-control destination + conditional background controls | `npx vitest run src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.launcher.i18n.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx && npx tsc --noEmit` | ✅ existing + ❌ planned (`AppearanceTab.background-controls.test.tsx`, `SettingsPage.launcher.i18n.test.tsx`) | ⬜ pending |
| 30-04-01 | 04 | 4 | SETTINGS-03 | manual-proof harness + stale-copy removal | `npx vitest run src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx && npx tsc --noEmit` | ✅ existing + ❌ planned (`appearanceProof.test.tsx`, `views.test.ts`) | ⬜ pending |
| 30-04-02 | 04 | 4 | SETTINGS-01, SETTINGS-02, SETTINGS-03 | pre-`CUSTOM-01` truth gate | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/StorageTab.layout.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.launcher.i18n.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountsPage.layout.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` | ✅ existing + ❌ planned (`SettingsPage.downloads.test.tsx`, `SettingsPage.launcher.test.tsx`, `SettingsPage.launcher.i18n.test.tsx`, `SettingsPage.statistics.test.tsx`, `SettingsPage.storage.test.tsx`, `AppearanceTab.background-controls.test.tsx`, `StorageTab.layout.test.tsx`, `AccountsPage.layout.test.tsx`, `MirrorsSettings.layout.test.tsx`, `StatisticsTab.layout.test.tsx`, `appearanceProof.test.tsx`, `views.test.ts`) | ⬜ pending |
| 30-04-03 | 04 | 4 | SETTINGS-04 | explicit gate resolution: bounded customized-from-preset state or locked no-ship defer | `npx vitest run src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx && npx eslint src/components/settings/tabs/AppearanceTab.tsx src/contexts/SettingsContext.tsx src/verification/manual/scenarios.tsx src/verification/manual/views.ts && npx tsc --noEmit` | ✅ existing + ❌ planned (`AppearanceTab.customized-state.test.tsx`, with the test required to lock either the shipped slice or the explicit no-ship branch) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/__tests__/SettingsPage.downloads.test.tsx` — direct downloads-tab embedding and honest shell-owned hierarchy proof for Plans `30-02` and `30-03`
- [ ] `src/components/__tests__/SettingsPage.launcher.test.tsx` — direct launcher-tab embedding and moved-control destination proof for Plans `30-02` and `30-03`
- [ ] `src/components/__tests__/SettingsPage.launcher.i18n.test.tsx` — launcher-side EN/RU copy-truth seam for moved controls in Plan `30-03`
- [ ] `src/components/__tests__/SettingsPage.statistics.test.tsx` — direct statistics-tab embedding and standalone-safe shell contract proof for Plans `30-02`, `30-03`, and the pre-`CUSTOM-01` gate in `30-04`
- [ ] `src/components/__tests__/SettingsPage.storage.test.tsx` — storage-tab embedding and shell-owned hierarchy proof for Plan `30-02`
- [ ] `src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx` — conditional background-control visibility and honest scope seam for Plan `30-03`
- [ ] `src/components/settings/__tests__/StorageTab.layout.test.tsx` — geometry and layout seam for Plan `30-03`
- [ ] `src/features/accounts/__tests__/AccountsPage.layout.test.tsx` — explicit accounts-surface geometry seam for Plan `30-03` and the pre-`CUSTOM-01` gate in `30-04`
- [ ] `src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx` — explicit mirrors-surface geometry seam for Plan `30-03` and the pre-`CUSTOM-01` gate in `30-04`
- [ ] `src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx` — explicit statistics-surface geometry seam for Plan `30-03` and the pre-`CUSTOM-01` gate in `30-04`
- [ ] `src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx` — final Task `30-04-03` outcome seam, proving either the bounded customized-from-preset state or the explicit no-ship branch for `CUSTOM-01`
- [ ] `src/verification/manual/__tests__/appearanceProof.test.tsx` — manual appearance proof regression seam for Plan `30-04`
- [ ] `src/verification/manual/__tests__/views.test.ts` — manual verification view registry seam for Plan `30-04`

Existing infrastructure already covers the remaining Phase 30 seams:

- `src/contexts/settings/__tests__/themeDocument.test.ts`
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/__tests__/SettingsPage.navigation.test.tsx`
- `src/components/__tests__/SettingsPage.accounts.test.tsx`
- `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx`
- `src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx`
- `src/components/layout/__tests__/BackgroundLayer.motion.test.tsx`
- `src/features/accounts/__tests__/AccountsPage.a11y.test.tsx`
- `src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx`
- `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Preset switches, import/export, and any retained bounded edits feel deterministic in the live shell | SETTINGS-01, SETTINGS-04 | jsdom proves contract state, but not whether the launcher visibly reads as one preset-driven system and either retains an honest customized-from-preset state or keeps a truthful no-ship defer after a real export/import round-trip | Open Settings → Appearance, switch between at least one light preset and one dark preset, and export then re-import the current appearance payload. If bounded customization still ships, make a bounded override and confirm preset ancestry survives plus reset/discard returns to the original preset cleanly. If Phase 30 resolves `SETTINGS-04` as no-ship, confirm the UI exposes no misleading customized-edit path and that broader personalization remains explicitly closed. |
| Settings navigation feels lighter and embedded utility tabs no longer restack hero shells | SETTINGS-02 | DOM structure cannot fully judge density, hierarchy, or whether utility panels still feel like nested pages | Open the Settings modal and check that tabs are compact, orientation copy appears once, and Downloads, Launcher, Storage, Accounts, Statistics, and Mirrors render as embedded panels rather than second-page hero layouts. |
| Remaining appearance controls are honest about scope and visible effect | SETTINGS-03 | Product truth here depends on visual judgment and wording clarity across the live UI | Review every kept appearance control in EN and RU. Confirm each either produces a clearly visible change or explicitly states its narrow scope, especially for motion, compact mode, and background-dependent controls. When a background subtype is inactive, its irrelevant controls should be hidden or clearly de-scoped. |
| Manual verification routes and the pre-`CUSTOM-01` gate match the shipped Phase 30 surface | SETTINGS-01, SETTINGS-03, SETTINGS-04 | Manual proof quality depends on the real route set, copy, and an explicit human gate before customization, not only testable string presence | Open the manual verification app, navigate to the appearance-related proof views, and confirm they no longer expect stale brand explainer copy, removed cards, or broader theme-builder behavior. Record that the manual truth gate is green, then either document the explicit no-ship outcome or confirm the customized-from-preset slice still feels justified and safely bounded. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or explicit Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 names every currently missing downloads, launcher, statistics, storage, utility-layout, background-control, customized-state, and manual-proof seam before closeout depends on them
- [x] No watch-mode flags
- [x] Feedback latency < 240s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-21
