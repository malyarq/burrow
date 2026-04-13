---
phase: 12
slug: theme-truth-and-settings-ia-simplification
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-13
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~150 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest command for the affected seam, or the quick run command above if multiple theme/settings files changed
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 150 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | THEME-01 | static/type | `npx eslint src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts src/components/settings/tabs/AppearanceTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 12-01-02 | 01 | 1 | THEME-01 | component | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx` | ❌ planned | ⬜ pending |
| 12-02-01 | 02 | 2 | THEME-02 | static/type | `npx eslint src/index.css src/components/ui/Textarea.tsx src/components/ui/LoadingSpinner.tsx src/components/ui/Breadcrumbs.tsx src/components/ui/SkeletonLoader.tsx src/components/settings/tabs/GameTab.tsx src/components/settings/tabs/game/ArgsSection.tsx src/components/settings/tabs/game/RuntimeSection.tsx src/components/settings/tabs/game/ModpackSection.tsx src/components/settings/tabs/game/AutoConnectSection.tsx src/components/settings/tabs/game/ResolutionSection.tsx src/components/settings/tabs/game/MinecraftPathSection.tsx src/components/UpdateModal.tsx src/components/MultiplayerPage.tsx src/components/modpacks/ImportModpackPreviewModal.tsx src/components/modpacks/ImportModpackPreviewPage.tsx src/components/modpacks/InstallModpackModal.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 12-02-02 | 02 | 2 | THEME-02 | component | `npx vitest run src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx` | ❌ planned | ⬜ pending |
| 12-03-01 | 03 | 2 | NAV-01 | static/type | `npx eslint src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/settingsTabs.ts src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/tabs/DownloadsTab.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/components/settings/tabs/StorageTab.tsx src/features/accounts/AccountsPage.tsx src/features/settings/statistics/StatisticsTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 12-03-02 | 03 | 2 | NAV-01 | component | `npx vitest run src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx` | ❌ planned | ⬜ pending |
| 12-04-01 | 04 | 3 | THEME-01, THEME-02, NAV-01 | full gate + manual | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx && npm test && npm run lint && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shipped presets apply immediately in both light and dark mode without partial leftovers | THEME-01 | jsdom can prove document state, but not the full perceived launcher update across live surfaces | Open the launcher, apply at least one dark preset and one light preset, then toggle base mode where the new contract allows; confirm cards, overlays, and shell surfaces repaint immediately without requiring extra clicks or mode resets |
| Text, helpers, cards, and overlays remain readable in the highest-risk preset-sensitive surfaces | THEME-02 | Real contrast and white-on-white failures are visual/browser concerns | Inspect settings or game panels, the update surface, and at least one modpack import or install surface under a light preset and a dark preset; confirm no white text on white panels or low-contrast helper copy |
| Common settings tasks are reachable without drilling into stacked collapsibles or utility panels | NAV-01 | IA success depends on perceived task reachability, not only DOM structure | Open settings and verify that theme or preset controls, launcher behavior, downloads or mirrors, accounts, and lower-traffic utilities are reachable through the simplified structure without hunting through multiple nested groups |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 150s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
