---
phase: 11
slug: adaptive-layout-and-interaction-foundations
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-13
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/Sidebar.keyboard.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest command for the affected seam, or the quick run command above if multiple foundation files changed
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | ADPT-01, ADPT-02 | static/type | `npx eslint src/components/AppLayout.tsx src/components/Sidebar.tsx src/components/SimplePlayDashboard.tsx src/components/SimplePlayHome.tsx src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/ui/Button.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 11-01-02 | 01 | 1 | ADPT-01 | component/keyboard | `npx vitest run src/components/__tests__/Sidebar.keyboard.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/__tests__/AppLayout.responsive.test.tsx` | ❌ planned | ⬜ pending |
| 11-02-01 | 02 | 1 | ADPT-03 | static/type | `npx eslint src/components/ui/AnchoredOverlay.tsx src/components/ui/Tooltip.tsx src/components/onboarding/OnboardingTour.tsx src/components/modpacks/ModpackList.tsx && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 11-02-02 | 02 | 1 | ADPT-03 | component | `npx vitest run src/components/ui/__tests__/AnchoredOverlay.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx` | ❌ planned | ⬜ pending |
| 11-03-01 | 03 | 2 | VIS-01 | static/type | `npx eslint src/components/SimplePlayDashboard.tsx src/components/SimplePlayHome.tsx src/components/TitleBar.tsx src/components/layout/EmptyStateView.tsx src/app/hooks/useAppIcon.ts src/components/ui/LazyImage.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 11-03-02 | 03 | 2 | VIS-01 | component | `npx vitest run src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx` | ❌ planned | ⬜ pending |
| 11-04-01 | 04 | 3 | ADPT-01, ADPT-02, ADPT-03, VIS-01 | full gate + manual | `npx vitest run src/components/__tests__/AppLayout.responsive.test.tsx src/components/__tests__/Sidebar.keyboard.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/ui/__tests__/AnchoredOverlay.test.tsx src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx && npm test && npm run lint && npx tsc --noEmit` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shell remains usable and visually coherent at multiple window sizes | ADPT-01, ADPT-02 | jsdom cannot prove real resize behavior, clipping, or density quality | Run the launcher or verification harness at at least three window sizes covering narrow, default, and wide desktop bounds; confirm sidebar, main content, and classic dashboard controls remain visible and orderly |
| Action menus stay inside the window and visually anchor to the trigger | ADPT-03 | Real overlay overflow and viewport edges are visual/browser concerns | Open installed-modpack actions near the right and bottom edges of the window and verify the menu repositions without detaching from the trigger or overflowing off-screen |
| Classic and easter-egg surfaces no longer show placeholder or broken fallback assets | VIS-01 | Visual trust issue depends on real rendering | Open classic mode, trigger the logo/easter-egg path, and confirm shipped fallback/logo assets render intentionally with no placeholder text or missing image behavior |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
