---
phase: 15
slug: launch-truth-and-shared-surface-contracts
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~180 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest or static/type command for the seam you touched; if a task spans both launcher state and dashboard rendering, use the quick run command above
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | LAUNCH-02, LAUNCH-03 | static/type | `npx eslint src/features/launcher/services/launcherService.ts src/features/launcher/hooks/useLauncherState.ts src/features/launcher/hooks/useLauncherIPC.ts src/features/launcher/hooks/useLauncher.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 15-01-02 | 01 | 1 | LAUNCH-02, LAUNCH-03 | service+component | `npx vitest run src/features/launcher/services/__tests__/launcherService.test.ts src/components/sidebar/__tests__/LaunchControls.status.test.tsx` | ❌ planned | ⬜ pending |
| 15-02-01 | 02 | 1 | LAUNCH-01, LAUNCH-02 | static/type | `npx eslint src/components/SimplePlayDashboard.tsx src/components/sidebar/LaunchControls.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 15-02-02 | 02 | 1 | LAUNCH-01, LAUNCH-02 | component | `npx vitest run src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx` | ✅ | ⬜ pending |
| 15-03-01 | 03 | 2 | LAUNCH-04 | static/type + locales | `npx eslint src/components/settings/tabs/GameTab.tsx src/components/settings/tabs/game/RuntimeSection.tsx src/locales/en.json src/locales/ru.json && npx tsc --noEmit` | ✅ | ⬜ pending |
| 15-03-02 | 03 | 2 | LAUNCH-04 | component | `npx vitest run src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx` | ✅ | ⬜ pending |
| 15-04-01 | 04 | 3 | LAUNCH-01, LAUNCH-02, LAUNCH-03, LAUNCH-04 | full gate + manual | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npm test && npm run lint && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Main play surface shows a deliberate fallback instead of a broken image when active launch art is missing | LAUNCH-01 | Visual intent and product feel are not captured fully by DOM assertions alone | Open the audited classic screen with missing or invalid artwork and confirm the fallback looks intentional, branded, and still preserves the active pack or instance identity |
| Launch status remains believable through preparing, downloading, launching, waiting, success, and failure on the real flow | LAUNCH-03, LAUNCH-04 | Real sequencing and pacing between IPC progress and log detail are experiential | Trigger the audited launch flow, confirm the dedicated status card stays synchronized with CTA state, and verify Russian UI does not leak English or raw technical copy |
| Busy state leaves launch-affecting controls read-only while advanced settings remain visible for reference | LAUNCH-02, LAUNCH-03 | Read-only affordance quality and readability require rendered interaction review | Start launch preparation, verify launch-affecting controls dim or lock, and confirm advanced settings remain visible but are not editable until work finishes |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
