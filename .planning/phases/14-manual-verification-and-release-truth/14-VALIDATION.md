---
phase: 14
slug: manual-verification-and-release-truth
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run tests/smoke/vitest.smoke.test.ts src/components/__tests__/AppLayout.responsive.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~240 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest or static/type command for the affected walkthrough seam, or the quick run command above if a change spans several milestone-owned surfaces
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before final phase closeout:** Run `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never`
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | VER-01 | smoke + responsive | `npx vitest run tests/smoke/vitest.smoke.test.ts src/components/__tests__/AppLayout.responsive.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 14-02-01 | 02 | 2 | VER-01 | secondary surface | `npx vitest run src/features/share/__tests__/ShareFlows.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 14-03-01 | 03 | 2 | DOC-01 | docs integrity | `git diff --check -- README.md docs/en/roadmap.md docs/ru/roadmap.md` | ✅ | ⬜ pending |
| 14-04-01 | 04 | 3 | VER-01, DOC-01 | final gate | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Core milestone-owned flows remain understandable and usable at first-launch default bounds and at a narrower resized desktop width | VER-01 | Adaptive UX quality depends on layout crowding, visual hierarchy, and action clarity in the real browser, not only DOM assertions | Run the milestone walkthrough entry for welcome/onboarding, dashboard, settings/accounts continuity, create-modpack, modpack list, and modpack browser at both sizes; capture and review screenshots for each pass |
| Secondary and advanced surfaces remain coherent under the same adaptive pressure without reopening blocker UX debt | VER-01 | Share, screenshots, utilities, and content-management flows rely on visual scan speed and layered interactions that are hard to prove only in jsdom | Walk share, screenshots, mirrors/statistics, modpack details/export/add-mod, and representative content-management views at the same browser sizes; capture evidence and record only blocker fallout |
| Future parity opportunities are separated from current milestone blockers instead of being silently pulled into scope | VER-01 | This is a product judgment call from live evidence, not a code-level assertion | For every notable friction found during the walkthrough, decide whether it blocks truthful milestone closure or belongs in a bounded follow-up list; record only non-blockers as future opportunities |
| README and both public roadmap docs describe the verified `v0.3.0` launcher and remaining follow-up scope truthfully | DOC-01 | Documentation truth is semantic and release-facing, not merely syntactic | Compare README and EN/RU roadmap wording against the recorded walkthrough evidence and the final opportunity list; remove stale `v0.2.0` framing and keep both languages aligned |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 240s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
