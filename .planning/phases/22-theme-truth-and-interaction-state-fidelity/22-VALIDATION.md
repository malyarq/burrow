---
phase: 22
slug: theme-truth-and-interaction-state-fidelity
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-18
---

# Phase 22 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

Retrospective closure note: this validation artifact is complete as a retrospective, backfilled record recovered from shipped evidence and final gates captured in the Phase 22 summaries. The task map below remains the historical execution contract; Phase 26 does not claim a fresh rerun of Phase 22 implementation or manual proof.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx src/utils/__tests__/format.test.ts` |
| **Full suite command** | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx src/components/modpacks/__tests__/ModpackThemeState.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx src/utils/__tests__/format.test.ts && npx tsc --noEmit && npx eslint src/` |
| **Estimated runtime** | ~230 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam touched by that task. If a task introduces a new state-fidelity or locale-formatting test, add it to the currently executable phase matrix immediately instead of waiting for closeout.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Start from the quick run command above during wave 1; expand it with new settings-state, route-state, and locale tests as later waves land; after the final wave, run the full suite command including `npx eslint src/`.
- **Before `$gsd-verify-work`:** The full suite must be green and manual proof must exist for settings appearance, one shared control matrix, one modpack primary route, one secondary-content surface, and one EN/RU locale-sensitive comparison in the real shell.
- **Max feedback latency:** 230 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 22-01-01 | 01 | 1 | THEME-02, THEME-03, THEME-04 | theme/accent/preset/locale structure | `git diff --check -- src/index.css && npx eslint src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/accent.ts src/contexts/settings/theme-presets.ts src/contexts/settings/persistence.ts src/contexts/settings/i18n.ts src/utils/format.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 22-01-02 | 01 | 1 | THEME-02, THEME-03, THEME-04 | truth-layer contract tests | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/utils/__tests__/format.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 22-02-01 | 02 | 2 | THEME-01, THEME-02 | shared control and settings-state structure | `npx eslint src/components/ui/Button.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx src/components/ui/Textarea.tsx src/components/ui/CollapsibleSection.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/DownloadsTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 22-02-02 | 02 | 2 | THEME-01, THEME-02, THEME-03 | settings state-fidelity regression | `npx vitest run src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 22-03-01 | 03 | 3 | THEME-01, THEME-02, THEME-04 | route adoption structure | `npx eslint src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/AddModModal.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/components/modpacks/details/WorldDatapacksModal.tsx src/components/modpacks/details/WorldsTab.tsx src/components/modpacks/ImportModpackPreviewPage.tsx src/features/settings/statistics/StatisticsTab.tsx src/features/screenshots/components/ScreenshotsTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 22-03-02 | 03 | 3 | THEME-01, THEME-02, THEME-04 | route state and locale regression | `npx vitest run src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackThemeState.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx src/utils/__tests__/format.test.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 22-04-01 | 04 | 4 | THEME-01, THEME-02, THEME-03, THEME-04 | manual proof harness | `npx eslint src/verification/manual/scenarios.tsx src/verification/manual/views.ts src/verification/manual/mockEnvironment.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 22-04-02 | 04 | 4 | THEME-01, THEME-02, THEME-03, THEME-04 | focused phase closeout matrix | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx src/components/modpacks/__tests__/ModpackThemeState.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx src/utils/__tests__/format.test.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure already covers the phase. Phase 22 reuses:

- the existing Vitest setup in `vitest.config.ts`;
- current theme and locale seams such as `themeDocument.test.ts`, `AppearanceTab.presets.test.tsx`, `AppearanceTab.i18n.test.tsx`, `ThemeSurfaceContrast.test.tsx`, and `format.test.ts`;
- current route and secondary-content seams such as `ImportModpackPreview.theme.test.tsx`, `ModpackDetailsHeader.i18n.test.tsx`, and `SecondaryContentTabs.test.tsx`;
- the shared manual verification harness in `src/verification/manual/*`;
- the standard repo checks `npx tsc --noEmit` and `npx eslint src/`.

No new test framework, screenshot runner, or watch-mode tooling is required.

The new Phase 22 structural tests should be created during execution where coverage gaps currently exist:

- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts` for preset identity, accent propagation, and locale-source truth;
- `src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx` for settings segmented controls, accent chips, and disabled-state readability;
- `src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx` for selected/hover/focus tab state contrast;
- `src/components/modpacks/__tests__/ModpackThemeState.test.tsx` for route-level selected/active/disabled/accent truth on milestone-owned surfaces;
- `src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx` if that seam does not already exist and locale formatting coverage is missing.

These files are not required for wave 1 feedback; they become part of the executable phase matrix as their owning plans land.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shared controls read immediately in dark and light themes | THEME-01, THEME-02 | Selected/hover/focus/disabled contrast is partly visual and can still feel weak even when semantics are present in DOM tests | Open the shell-integrated settings appearance proof in both dark and light modes. Check segmented controls, accent chips, slider/thumb states, and disabled actions. Confirm selected state is immediate, disabled state remains readable, and focus or hover does not disappear against the surface |
| Preset and custom accent variants behave like intentional launcher appearances | THEME-02, THEME-03 | Preset identity and custom accent drift are easiest to spot in live side-by-side composition | Review a proof state that compares at least one shipped preset against a custom accent. Confirm the launcher still reads as the same intentional preset family and that accent-driven controls use the chosen accent consistently rather than falling back to unrelated colors |
| Milestone-owned modpack surfaces reuse the same state truth | THEME-01, THEME-02 | Route-level selected cards, active tabs, history/favorite toggles, and menu states are visually sensitive to live composition | Open a modpack list or browser proof plus one details or secondary-content route. Confirm selected and active states remain clear, disabled states are still legible, and accent propagation matches the current theme choice |
| Dates, numbers, and translated copy follow the active locale | THEME-04 | A human must confirm that copy and metadata change together rather than only translating labels | Review EN and RU proof states for settings or content surfaces with visible dates and counts. Confirm translated copy, date order, month names, and number separators follow the active app language rather than the host environment locale |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure dependencies
- [x] Quick-run guidance is wave-aware and executable from wave 1 onward
- [x] New Phase 22 structural tests are scheduled into later waves instead of blocking early feedback loops
- [x] No watch-mode flags
- [x] Final full matrix becomes mandatory only after wave 4 test seams land
- [x] `nyquist_compliant: true` set in frontmatter
- [x] Retrospective sign-off is backfilled and recovered from shipped evidence plus the recorded Phase 22 final gates

**Approval:** complete
