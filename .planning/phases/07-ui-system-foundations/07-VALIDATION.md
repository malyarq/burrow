---
phase: 7
slug: ui-system-foundations
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-13
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/ui/__tests__/Modal.a11y.test.tsx src/components/__tests__/Sidebar.keyboard.test.tsx src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.i18n.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest command for the affected seam, or the quick run command above if multiple foundation files moved
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | DSYS-01, DSYS-02 | static/type | `npx eslint src/components/ui/Button.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx src/components/ui/ConfirmDialog.tsx src/components/ui/Tooltip.tsx src/components/ui/Toast.tsx src/components/ui/ProgressBar.tsx src/components/ui/CollapsibleSection.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 07-01-02 | 01 | 1 | DSYS-01 | component/a11y | `npx vitest run src/components/ui/__tests__/Modal.a11y.test.tsx` | ✅ | ⬜ pending |
| 07-02-01 | 02 | 1 | DSYS-01 | static/type | `npx eslint src/components/Sidebar.tsx src/components/TitleBar.tsx src/components/sidebar/SidebarHeader.tsx src/components/sidebar/LaunchControls.tsx src/components/layout/EmptyStateView.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 07-02-02 | 02 | 1 | DSYS-02 | component/keyboard | `npx vitest run src/components/__tests__/Sidebar.keyboard.test.tsx` | ✅ | ⬜ pending |
| 07-03-01 | 03 | 2 | THEME-01 | static/type | `npx eslint src/contexts/settings/theme.ts src/contexts/SettingsContext.tsx src/components/settings/tabs/AppearanceTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 07-03-02 | 03 | 2 | THEME-01 | unit/component | `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/components/settings/__tests__/AppearanceTab.i18n.test.tsx` | ❌ planned | ⬜ pending |
| 07-04-01 | 04 | 3 | DSYS-01, DSYS-02, THEME-01 | full gate + manual | `npm test && npm run lint && npx tsc --noEmit` | ⚠ depends on 07-03 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shell theme payoff is visually obvious across sidebar, title bar, cards, and dialogs | THEME-01 | jsdom cannot prove real visual hierarchy or contrast payoff | Run the launcher locally, switch light/dark and accent values, and verify shell + shared surfaces visibly change together |
| Shared icon language reads consistently across shell, dialogs, confirm flows, tooltip-triggered actions, and empty states | DSYS-02 | Semantic icon consistency is partly visual judgment | Open the launcher shell and confirm sidebar, title bar, dialogs, confirm flows, tooltip-triggered actions, and empty states no longer mix icon systems, missing glyphs, or ad hoc affordances |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
