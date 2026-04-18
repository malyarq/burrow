---
phase: 23-fallback-error-and-placeholder-productization
slug: fallback-error-and-placeholder-productization
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-19
---

# Phase 23 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx` |
| **Full suite command** | `npx vitest run src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/layout/__tests__/DegradedStateView.test.tsx src/utils/__tests__/displayError.test.ts src/components/modpacks/__tests__/ModpackBrowser.degraded-state.test.tsx src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.degraded-state.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/features/launcher/hooks/__tests__/useLauncher.status-copy.test.ts && npx tsc --noEmit && npx eslint src/` |
| **Estimated runtime** | ~250 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam touched by that task. When a new degraded-state regression file lands, add it to the currently executable phase matrix immediately instead of waiting for closeout.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Start from the quick run command during wave 1, expand it with the new degraded-state and crash tests as later waves land, and require the full suite command only after wave 3 closes.
- **Before `$gsd-verify-work`:** The full suite must be green. Phase 23 should use targeted visual spot-checks on existing milestone views where helpful, but dedicated degraded-state proof routes remain Phase 24 scope.
- **Max feedback latency:** 250 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 23-01-01 | 01 | 1 | FALL-01, FALL-02, FALL-03 | degraded-state structure | `git diff --check -- src/components/layout/DegradedStateView.tsx src/components/error/FatalErrorView.tsx src/utils/displayError.ts src/utils/safeUiText.ts src/contexts/settings/i18n.ts src/locales/en.json src/locales/ru.json && npx eslint src/components/layout/DegradedStateView.tsx src/components/error/FatalErrorView.tsx src/utils/displayError.ts src/utils/safeUiText.ts src/contexts/settings/i18n.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 23-01-02 | 01 | 1 | FALL-01, FALL-02, FALL-03 | shared degraded-state regression | `npx vitest run src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/layout/__tests__/DegradedStateView.test.tsx src/utils/__tests__/displayError.test.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 23-02-01 | 02 | 2 | FALL-02, FALL-04 | route async-state structure | `npx eslint src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/ModpackList.tsx src/features/screenshots/components/ScreenshotsTab.tsx src/features/settings/statistics/StatisticsTab.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/ShadersTab.tsx src/components/modpacks/details/WorldsTab.tsx src/components/modpacks/details/WorldDatapacksModal.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 23-02-02 | 02 | 2 | FALL-02, FALL-04 | route degraded-state regression | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.degraded-state.test.tsx src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 23-03-01 | 03 | 2 | FALL-03, FALL-01 | crash-surface structure | `npx eslint src/components/ErrorBoundary.tsx src/components/ErrorBoundaryWrapper.tsx src/main.tsx src/App.tsx src/components/error/FatalErrorView.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 23-03-02 | 03 | 2 | FALL-03, FALL-01 | crash recovery regression | `npx vitest run src/components/__tests__/ErrorBoundary.recovery.test.tsx src/utils/__tests__/displayError.test.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 23-04-01 | 04 | 3 | FALL-01, FALL-04 | high-risk flow truth structure | `git diff --check -- src/locales/en.json src/locales/ru.json && npx eslint src/components/modpacks/details/ModpackDetailsModsTab.tsx src/components/sidebar/modpackRuntimeDependencies.ts src/components/sidebar/ModpackDependencySummary.tsx src/components/modpacks/ModpackUpdateModal.tsx src/components/modpacks/AddModModal.tsx src/components/modpacks/AddModPage.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/components/modpacks/ImportModpackPreviewPage.tsx src/features/launcher/hooks/useLauncher.ts src/features/launcher/hooks/useLauncherIPC.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 23-04-02 | 04 | 3 | FALL-01, FALL-02, FALL-03, FALL-04 | focused phase closeout matrix | `npx vitest run src/components/layout/__tests__/DegradedStateView.test.tsx src/utils/__tests__/displayError.test.ts src/components/modpacks/__tests__/ModpackBrowser.degraded-state.test.tsx src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/modpacks/__tests__/ImportModpackPreview.degraded-state.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/features/launcher/hooks/__tests__/useLauncher.status-copy.test.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure already covers the phase. Phase 23 reuses:

- the existing Vitest setup in `vitest.config.ts`;
- current degraded-state-adjacent seams such as `ScreenshotsExperience.test.tsx`, `StatisticsTab.test.tsx`, `ShareFlows.test.tsx`, `SecondaryContentTabs.test.tsx`, `CreateModpackDependencies.test.tsx`, and `ModpackDetailsSettings.summary.test.tsx`;
- the existing manual verification harness in `src/verification/manual/*`;
- the standard repo checks `npx tsc --noEmit` and `npx eslint src/`.

No new framework, watch mode, or screenshot runner is required.

The new Phase 23 structural tests should be created during execution where coverage gaps currently exist:

- `src/components/layout/__tests__/DegradedStateView.test.tsx` for the calm degraded-state component contract;
- `src/utils/__tests__/displayError.test.ts` for technical-error and suspicious-placeholder sanitization;
- `src/components/modpacks/__tests__/ModpackBrowser.degraded-state.test.tsx` and `src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx` for failed-load versus empty state truth;
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx` and `src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx` for the secondary-content routes that are otherwise unprotected by the current matrix;
- `src/components/__tests__/ErrorBoundary.recovery.test.tsx` for recovery-first fatal error handling;
- `src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx`, `src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx`, `src/components/modpacks/__tests__/ImportModpackPreview.degraded-state.test.tsx`, and `src/features/launcher/hooks/__tests__/useLauncher.status-copy.test.ts` for the high-risk placeholder and degraded-copy seams.

These files are not required for wave 1 feedback; they become part of the executable phase matrix as their owning plans land.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Failed-load states remain distinct from normal empty or zero-result states | FALL-02, FALL-04 | Existing tests cannot fully judge whether the user can visually distinguish "nothing here yet" from "could not load" in a dense shell composition | Use the existing `modpack-browser`, `screenshots`, or `content` manual views after seeding degraded fixtures. Confirm failed-load states use explicit unavailable or error copy, while genuine empty or zero-result states still show their own contextual next step |
| High-risk placeholder and wrapper errors are sanitized | FALL-01 | Suspicious placeholder text and technical wrapper strings can still look wrong even when tests assert a mapped fallback | Spot-check one add-mod or update flow and one share or import flow in the running app. Confirm `${...}` values, `[namespace] method failed`, or mixed-language fallback copy do not appear directly in visible UI |
| Conservative dependency truth stays aligned with summary surfaces | FALL-04 | Summary-to-detail contradictions are easiest to catch when a human can compare cards, tabs, and action states together | Compare a modpack details dependency state against its summary surface in the running app with an unavailable or unverified dependency fixture. Confirm the summary stays calm but does not imply success when detail-level truth is missing, incompatible, or unknown |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure dependencies
- [x] Quick-run guidance is wave-aware and executable from wave 1 onward
- [x] New Phase 23 structural tests are scheduled into later waves instead of blocking early feedback loops
- [x] No watch-mode flags
- [x] Final full matrix becomes mandatory only after wave 3 test seams land
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
