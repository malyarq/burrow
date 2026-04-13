---
phase: 9
slug: secondary-surface-alignment-and-ux-polish
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-13
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/features/share/__tests__/ShareFlows.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run the owning `npx vitest run ...` slice for that plan
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | UX-04 | component | `npx vitest run src/features/share/__tests__/ShareFlows.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx` | ❌ W0 | ⬜ pending |
| 09-02-01 | 02 | 1 | UX-04 | component | `npx vitest run src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx` | ⚠️ partial | ⬜ pending |
| 09-03-01 | 03 | 2 | UX-04 | component | `npx vitest run src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` | ❌ W0 | ⬜ pending |
| 09-04-01 | 04 | 2 | A11Y-04 | accessibility | `npx vitest run src/components/layout/__tests__/BackgroundLayer.motion.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` | ❌ W0 | ⬜ pending |
| 09-05-01 | 05 | 3 | A11Y-04, UX-04 | integration | `npm test && npm run lint && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ partial*

---

## Wave 0 Requirements

- [ ] `src/features/share/__tests__/ShareFlows.test.tsx` — focused share or import-share seam coverage
- [ ] `src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx` — screenshots gallery or lightbox interaction coverage
- [ ] `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx` — secondary settings utility route coverage
- [ ] `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` — content-management tab coverage
- [ ] `src/components/layout/__tests__/BackgroundLayer.motion.test.tsx` — reduced-motion or backdrop-readability seam coverage

*Existing infrastructure already covers the framework and repo gate; Wave 0 is only about landing the missing Phase 9 spec files in their owning slices.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Screenshot overlay readability and toolbar clarity | A11Y-04 | Visual contrast and real overlay readability are hard to prove from jsdom alone | Open screenshots tab, launch lightbox, verify readable title or controls, visible focus, and understandable destructive actions in both themes |
| Secondary-surface atmosphere versus content readability | A11Y-04 | Backdrop, blur, and gradient balance need real visual inspection | Check mirrors/statistics/settings utilities and one content-management tab in light and dark themes, with reduced motion enabled and disabled, and confirm content remains readable |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-13
