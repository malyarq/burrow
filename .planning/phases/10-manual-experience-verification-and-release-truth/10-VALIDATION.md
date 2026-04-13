---
phase: 10
slug: manual-experience-verification-and-release-truth
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-13
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/SimplePlayDashboard.route.test.tsx src/components/onboarding/__tests__/WelcomePage.flow.test.tsx src/components/onboarding/__tests__/OnboardingTour.targets.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountSkinsPage.test.tsx src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ExportModpackPage.i18n.test.tsx src/components/modpacks/__tests__/AddModModal.i18n.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never` |
| **Estimated runtime** | ~2-4 minutes plus browser walkthrough time |

---

## Sampling Rate

- **After every task commit:** Run the owning `npx vitest run ...` slice or `git diff --check -- ...` docs check for that plan
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite plus `npm run build -- --publish never` must be green
- **Max feedback latency:** 90 seconds for automated checks, one live-browser pass per walkthrough slice

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | VER-01 | integration + route | `npx vitest run src/components/__tests__/SimplePlayDashboard.route.test.tsx src/components/onboarding/__tests__/WelcomePage.flow.test.tsx src/components/onboarding/__tests__/OnboardingTour.targets.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountSkinsPage.test.tsx src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx src/components/modpacks/__tests__/ModpackList.actions.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ExportModpackPage.i18n.test.tsx src/components/modpacks/__tests__/AddModModal.i18n.test.tsx` | ✅ | ⬜ pending |
| 10-02-01 | 02 | 2 | VER-01 | integration + accessibility | `npx vitest run src/features/share/__tests__/ShareFlows.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx` | ✅ | ⬜ pending |
| 10-03-01 | 03 | 2 | DOC-03 | docs review | `git diff --check -- README.md docs/en/roadmap.md docs/ru/roadmap.md` | ✅ | ⬜ pending |
| 10-04-01 | 04 | 3 | VER-01, DOC-03 | release gate | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ partial*

---

## Wave 0 Requirements

- No additional Wave 0 files are required for Phase 10.
- Existing Vitest seams already cover the refreshed core and secondary launcher surfaces that this phase needs to re-verify.
- The only new evidence requirement is durable walkthrough recording during execution, which belongs in plan summaries and `10-VERIFICATION.md` rather than in pre-landed spec files.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Milestone-wide core launcher walkthrough | VER-01 | The milestone promise is a real browser pass across stitched user flows, not only isolated component tests | Start the live launcher entry used in Phase 10, walk onboarding or welcome, home or play, settings or accounts continuity, and modpack browser or details or export or add flows, then capture screenshot evidence and note any fallout in the plan summary |
| Secondary-surface walkthrough with atmosphere and readability checks | VER-01 | Share, screenshots, mirrors, statistics, and content-management flows need real visual and interaction verification across the shipped launcher shell | In the same verification seam, cover share or import-share, screenshot gallery or lightbox, mirrors or statistics, and one representative content-management path, then confirm keyboard reachability, visible focus, readable copy, and stable theme behavior |
| Release-facing documentation truth check | DOC-03 | README and roadmap text can be syntactically correct while still overstating or lagging behind the shipped experience | Review README and both roadmap docs against the actual completed walkthrough evidence and ensure no stale UI promises, old checkbox drift, or language mismatch remains |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or an explicit docs-check command
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 blockers are absent for this phase
- [x] No watch-mode flags
- [x] Feedback latency stays bounded with focused slices plus one live pass per walkthrough seam
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-13
