---
phase: 36
slug: settings-predictability-and-shared-control-contract
status: passed
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-22
---

# Phase 36 — Validation Strategy

> Per-phase validation contract for settings predictability, shared control geometry, and direct feedback closure.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/SettingsPage.layout.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run src/components/__tests__/SettingsPage.layout.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/AppearanceTab.control-contract.test.tsx src/components/settings/__tests__/DownloadsTab.layout.test.tsx src/components/settings/__tests__/LauncherTab.layout.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/contexts/settings/__tests__/themeDocument.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/settingsTabs.ts src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/DownloadsTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/tabs/StorageTab.tsx src/components/sidebar/SidebarHeader.tsx src/components/ui/Button.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/features/settings/statistics/StatisticsTab.tsx src/components/layout/BackgroundLayer.tsx src/components/AppLayout.tsx src/components/ui/Modal.tsx src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts src/index.css src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` |
| **Estimated runtime** | ~40 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam you changed; use the quick run command as the generic smoke fallback.
- **After every plan wave:** Run the full suite command for all completed wave seams.
- **Before `$gsd-verify-work`:** Full suite must be green, and manual proof must exist for settings chrome density, preset predictability, control geometry, and visible-effect scope.
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 36-01-01 | 01 | 1 | SETTINGS-05 | settings shell copy and tab-chrome density | `npx vitest run src/components/__tests__/SettingsPage.layout.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx && npx tsc --noEmit` | ✅ created | ✅ green |
| 36-01-02 | 01 | 1 | SETTINGS-05 | shell copy dedupe and embedded statistics honesty | `npx vitest run src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx && npx eslint src/components/settings/settingsTabs.ts src/features/settings/statistics/StatisticsTab.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-02-01 | 02 | 2 | SETTINGS-06 | preset ancestry, mode, and reset predictability | `npx vitest run src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/contexts/settings/__tests__/themeDocument.test.ts && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-02-02 | 02 | 2 | SETTINGS-06, SETTINGS-08 | appearance-state implementation and locale safety | `npx eslint src/components/settings/tabs/AppearanceTab.tsx src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts src/locales/en.json src/locales/ru.json && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-03-01 | 03 | 3 | SETTINGS-07, SETTINGS-08, DESIGN-01 | shared control geometry and scoped appearance behavior across tabs, sliders, toggles, and accent pickers | `npx vitest run src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/AppearanceTab.control-contract.test.tsx src/components/settings/__tests__/DownloadsTab.layout.test.tsx src/components/settings/__tests__/LauncherTab.layout.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx && npx tsc --noEmit` | ✅ created | ✅ green |
| 36-03-02 | 03 | 3 | SETTINGS-07, SETTINGS-08, DESIGN-01 | shared CSS/control implementation lint | `npx eslint src/index.css src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/DownloadsTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/SettingsTabsHeader.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-04-01 | 04 | 4 | SETTINGS-05, SETTINGS-08, DESIGN-01 | embedded settings surfaces and utility tabs stay honest inside the shell | `npx vitest run src/components/__tests__/SettingsPage.storage.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-04-02 | 04 | 4 | SETTINGS-05, SETTINGS-06, SETTINGS-07, SETTINGS-08, DESIGN-01 | manual proof wording and settings closeout routes | `npx vitest run src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-05-01 | 05 | 5 | SETTINGS-05 | remove duplicate shell copy and embedded appearance hero/runtime chrome | `npx vitest run src/components/__tests__/SettingsPage.layout.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx && npx eslint src/components/SettingsPage.tsx src/components/settings/settingsTabs.ts src/components/settings/tabs/AppearanceTab.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-05-02 | 05 | 5 | SETTINGS-05, SETTINGS-07, DESIGN-01 | flatten first-read shell wrappers and unify launcher runtime grid | `npx vitest run src/components/settings/__tests__/LauncherTab.layout.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx && npx eslint src/index.css src/components/settings/tabs/LauncherTab.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-06-01 | 06 | 6 | SETTINGS-06, DESIGN-01 | preset-owned accent defaults replace the old always-global accent behavior | `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx && npx eslint src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-06-02 | 06 | 6 | SETTINGS-06, DESIGN-01 | dark presets visibly repaint launcher-owned shell surfaces without extra runtime chrome | `npx vitest run src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npx eslint src/components/settings/tabs/AppearanceTab.tsx src/components/SimplePlayDashboard.tsx src/components/sidebar/ModloaderSection.tsx src/components/sidebar/ModpackSection.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-07-01 | 07 | 7 | SETTINGS-07, DESIGN-01 | collapsed sidebar burger uses the shared compact geometry seam | `npx vitest run src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/AppLayout.responsive.test.tsx && npx eslint src/components/sidebar/SidebarHeader.tsx src/components/Sidebar.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-07-02 | 07 | 7 | SETTINGS-07 | utility-button labels stay readable and centered under the shared button contract | `npx vitest run src/components/settings/__tests__/LauncherTab.layout.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx && npx eslint src/components/ui/Button.tsx src/components/settings/tabs/LauncherTab.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-08-01 | 08 | 8 | SETTINGS-05, DESIGN-01 | embedded utility tabs stay flat and section-first inside the settings shell | `npx vitest run src/components/__tests__/SettingsPage.storage.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx && npx eslint src/components/settings/tabs/DownloadsTab.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/components/settings/tabs/StorageTab.tsx src/features/settings/statistics/StatisticsTab.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-08-02 | 08 | 8 | SETTINGS-08 | background effects and advanced colors use a visible application seam with honest scope copy | `npx vitest run src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/contexts/settings/__tests__/themeDocument.test.ts && npx eslint src/components/layout/BackgroundLayer.tsx src/components/AppLayout.tsx src/components/ui/Modal.tsx src/components/settings/tabs/AppearanceTab.tsx src/locales/en.json src/locales/ru.json && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-09-01 | 09 | 9 | SETTINGS-05, SETTINGS-06, SETTINGS-07, SETTINGS-08, DESIGN-01 | settings proof readiness depends on observable behavior, not static wording | `npx vitest run src/verification/manual/__tests__/appearanceProof.test.tsx && npx eslint src/verification/manual/scenarios.tsx src/verification/manual/ManualVerificationApp.tsx && npx tsc --noEmit` | ✅ partial | ✅ green |
| 36-09-02 | 09 | 9 | SETTINGS-05, SETTINGS-06, SETTINGS-07, SETTINGS-08, DESIGN-01 | proof-route copy and tests stay aligned with the real Phase 36 UAT contract | `npx vitest run src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/verification/manual/views.ts && npx tsc --noEmit` | ✅ partial | ✅ green |

*Status: ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/components/__tests__/SettingsPage.layout.test.tsx` — shell-level seam rejects duplicate summary copy and over-tall settings chrome as the default contract.
- [x] `src/components/settings/__tests__/AppearanceTab.presets.test.tsx` — preset reset semantics, preset-plus-mode switching, and visible ancestry when overrides are covered.
- [x] `src/components/settings/__tests__/AppearanceTab.control-contract.test.tsx` — custom accent chip behavior, slider geometry, and toggle containment sit under one dedicated seam.
- [x] `src/components/settings/__tests__/DownloadsTab.layout.test.tsx` — embedded downloads layout proof exists instead of relying only on route-level settings tests.
- [x] `src/components/settings/__tests__/LauncherTab.layout.test.tsx` — embedded launcher layout proof covers toggle rows, scale slider, and segmented controls at laptop widths.
- [x] `src/verification/manual/__tests__/views.test.ts` — settings proof wording now directs reviewers to duplicate-copy removal, preset predictability, and visible-effect scope.

Wave 0 ownership should be explicit in the plans:

- `36-01` owns the shell-level layout seam before “settings chrome is fixed” can be called done.
- `36-02` owns the preset predictability seam before preset-truth claims are trusted.
- `36-03` owns the dedicated control-contract seams for appearance, downloads, and launcher.
- `36-04` owns the manual-proof wording refresh before closeout relies on the settings routes.
- `36-05` owns shell flattening and launcher-grid recovery before deeper utility/background fixes can be called stable.
- `36-06` owns visible preset differentiation and readable preset ancestry before settings can claim predictability again.
- `36-07` owns the compact-control and label-fit regressions the UAT session still caught.
- `36-08` owns the remaining settings-owned embedded utility and visible-effect seams without reopening modpack requirements.
- `36-09` owns honest proof-route gating only after `36-05` through `36-08` land.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Settings no longer feel top-heavy before the real controls begin | SETTINGS-05 | DOM tests cannot fully judge perceived chrome weight | Open the settings modal on a laptop-width viewport and verify tabs plus shell copy no longer dominate the first screen before controls |
| Preset selection and mode changes feel predictable | SETTINGS-06 | tests can prove branches but not the product readability of the state | Switch between presets, change light/dark mode, add a bounded override, and verify the UI still makes the active preset, mode, and customized state obvious |
| Accent chips, sliders, toggles, and tabs feel like one control family | SETTINGS-07, DESIGN-01 | visual alignment and perceived cohesion still require human judgment | Compare settings tabs, accent selection, zoom slider, and launcher toggles in one session and confirm they share a consistent visual and interaction contract |
| Every appearance control has either a visible effect or a scoped explanation | SETTINGS-08 | automated tests cannot confirm whether the explanation is actually sufficient | Open Appearance and Launcher, toggle advanced/background controls, and verify each control either changes a visible surface or clearly states its scope |
| Manual proof routes describe the real Phase 36 contract | SETTINGS-05, SETTINGS-06, SETTINGS-07, SETTINGS-08, DESIGN-01 | stale proof copy can still let closeout review the wrong behaviors | Open `settings-appearance` and adjacent settings proof routes and confirm they instruct reviewers to check predictability, duplicate-copy removal, control cohesion, and visible-effect scope |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit Wave 0 ownership
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 identifies the missing settings seams before execution depends on them
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-22
