---
phase: 8
slug: core-route-rollout-and-ui-correctness
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-13
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountSkinsPage.test.tsx src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest command for the affected route seam, or the quick run command above if multiple Phase 8 owners moved
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 150 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | DSYS-03, UX-01 | static/type | `npx eslint src/App.tsx src/components/AppLayout.tsx src/components/Sidebar.tsx src/components/SimplePlayDashboard.tsx src/components/onboarding/WelcomePage.tsx src/components/onboarding/OnboardingTour.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 08-01-02 | 01 | 1 | LOCL-01, UX-01 | component/route | `npx vitest run src/components/__tests__/SimplePlayDashboard.route.test.tsx src/components/onboarding/__tests__/WelcomePage.flow.test.tsx src/components/onboarding/__tests__/OnboardingTour.targets.test.tsx` | ❌ planned | ⬜ pending |
| 08-02-01 | 02 | 1 | DSYS-03, UX-03 | static/type | `npx eslint src/components/SettingsPage.tsx src/features/accounts/AccountsPage.tsx src/features/accounts/AddAccountDialog.tsx src/features/accounts/AccountSkinPanel.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 08-02-02 | 02 | 1 | LOCL-01, UX-03 | component/a11y | `npx vitest run src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountSkinsPage.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx` | ⚠ partly exists | ⬜ pending |
| 08-03-01 | 03 | 2 | DSYS-03, UX-02 | static/type | `npx eslint src/components/modpacks/ModpackRouter.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/details/ModpackDetailsActions.tsx src/components/modpacks/InstallModpackPage.tsx src/components/modpacks/ExportModpackPage.tsx src/components/modpacks/AddModModal.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 08-03-02 | 03 | 2 | LOCL-01, UX-02 | component/keyboard | `npx vitest run src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ExportModpackPage.i18n.test.tsx src/components/modpacks/__tests__/AddModModal.i18n.test.tsx` | ⚠ partly exists | ⬜ pending |
| 08-04-01 | 04 | 3 | DSYS-03, LOCL-01, UX-01, UX-02, UX-03 | full gate + manual | `npm test && npm run lint && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| First-run entry and onboarding guidance match the real default launcher flow | UX-01, LOCL-01 | jsdom cannot judge route hierarchy or whether the welcome guidance feels truthful in context | Launch the app, confirm the default mode, open onboarding, and verify welcome plus tour guidance match the actual first-use path, visible controls, and stable highlighted targets |
| Home/play dashboard hierarchy feels clearer at a glance after the rollout | UX-01 | “clearer” depends on visible hierarchy and action emphasis, not only DOM assertions | In a live browser run, inspect the home/play route and confirm primary status, major actions, and support actions are visually prioritized without legacy banner or emoji drift |
| Settings/accounts and modpack routes read as one product instead of mixed modules | DSYS-03, UX-02, UX-03 | Visual continuity across route owners is not fully provable in jsdom | In a live browser run, open settings/accounts and the modpack list/browser/details/install/export/add-mod sequence, and verify headers, buttons, spacing, dialogs, feedback states, and icons feel shared and not stitched together |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 150s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
