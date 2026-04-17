---
phase: 17
slug: catalog-compact-nav-and-settings-localization-polish
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-17
---

# Phase 17 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~210 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest or seam-specific static/type command for the catalog, sidebar, or settings surface you touched; if a task spans catalog responsiveness and fallback art together, use the quick run command above
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 210 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 17-01-01 | 01 | 1 | CATALOG-01, CATALOG-02 | static/type | `npx eslint src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/ui/LazyImage.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 17-01-02 | 01 | 1 | CATALOG-01, CATALOG-02 | component | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` | ❌ planned | ⬜ pending |
| 17-02-01 | 02 | 1 | CATALOG-03 | static/type | `npx eslint src/components/sidebar/SidebarHeader.tsx src/components/Sidebar.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 17-02-02 | 02 | 1 | CATALOG-03 | component | `npx vitest run src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx` | ❌ planned | ⬜ pending |
| 17-03-01 | 03 | 2 | SET-01, SET-02 | static/type + locales | `npx eslint src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/tabs/AppearanceTab.tsx src/contexts/settings/theme-presets.ts src/locales/en.json src/locales/ru.json && npx tsc --noEmit` | ✅ | ⬜ pending |
| 17-03-02 | 03 | 2 | SET-01, SET-02 | component | `npx vitest run src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx` | ✅ | ⬜ pending |
| 17-04-01 | 04 | 3 | CATALOG-01, CATALOG-02, CATALOG-03, SET-01, SET-02 | full gate + manual | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx && npm test && npm run lint && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Phase 17 can extend current Vitest and jsdom suites without adding a new framework or shared fixture layer.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Catalog filters and primary controls stay readable with the sidebar open at the audited desktop width | CATALOG-01 | Scanability, truncation, and control weight are spatial UX behaviors that are hard to judge from DOM assertions alone | Open the Phase 17 catalog verification seam in `manual-verification.html`, keep the launcher sidebar expanded, and confirm the installed and remote catalog controls remain readable without clipped primary filter meaning |
| Modpacks without artwork show a deliberate branded fallback instead of a gray or broken-looking placeholder on both catalog surfaces | CATALOG-02 | Product intent and perceived polish of empty-art states need rendered visual review | Review catalog cards with missing artwork in the manual verification app and confirm the fallback reads as intentional FMCL branding on both installed and remote browsing surfaces |
| Collapsed sidebar navigation keeps a coherent active-state affordance and does not regress to placeholder-like letter output | CATALOG-03 | Compact-state clarity depends on rendered icon balance and active emphasis, not only accessible names | Collapse the sidebar in the manual verification app, switch between classic and modpacks modes, and confirm the active destination stays obvious without any lone placeholder letters |
| Settings shell and appearance surface in Russian avoid raw localization keys and present theme presets according to the chosen naming policy | SET-01, SET-02 | Raw-key leakage and preset-name consistency are user-facing copy qualities that need whole-surface review | Open the settings verification seam in Russian, inspect tab summaries plus the appearance preset selector, and confirm no raw keys are visible and the preset names follow one deliberate RU or brand-style policy consistently |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 210s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
