---
phase: 24
slug: verification-locale-and-release-truth
status: in_progress
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-19
---

# Phase 24 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + playwright |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/utils/__tests__/format.test.ts src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx` |
| **Visual lane command** | `npm run test:visual:closeout` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never && npm run test:visual:closeout` |
| **Browser provisioning** | Prefer committed system Chromium fallback from `playwright.config.ts`; use `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to override, or `npx playwright install chromium` only when CDN access is available. |
| **Estimated runtime** | ~480 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific command for the surface touched. For Waves 1-2, the maximum phase-wide task gate is the Vitest-only quick run above. Once Plan `24-03` lands the Playwright lane, task commits touching the closeout registry or screenshot contract must also run `npm run test:visual:closeout`.
- **After every plan wave:** After Waves 1-2, run the Vitest-only quick run command. After Wave 3 and after the final wave, run the full quick run command plus `npm run test:visual:closeout`; after the final wave, also run the full suite command including build.
- **Before `$gsd-verify-work`:** The full suite must be green and the closeout registry must publish `ready: true` for every owned Phase 24 proof view.
- **Max feedback latency:** 480 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 24-01-01 | 01 | 1 | VER-01 | manual seam static/type | `npx eslint src/verification/manual/ManualVerificationApp.tsx src/verification/manual/views.ts src/verification/manual/scenarios.tsx src/verification/manual/mockEnvironment.ts && npx tsc --noEmit` | ✅ | ✅ green |
| 24-01-02 | 01 | 1 | VER-01, VER-03 | deterministic proof smoke | `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/utils/__tests__/format.test.ts src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx && npx tsc --noEmit` | ✅ | ✅ green |
| 24-02-01 | 02 | 2 | VER-01, VER-03 | degraded-state route proof | `npx vitest run src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx && npx tsc --noEmit` | ✅ | ✅ green |
| 24-02-02 | 02 | 2 | VER-01, VER-03 | manual seam + locale/theme audit | `npx eslint src/verification/manual/ManualVerificationApp.tsx src/verification/manual/views.ts src/verification/manual/scenarios.tsx src/verification/manual/mockEnvironment.ts && npx tsc --noEmit` | ✅ | ✅ green |
| 24-03-01 | 03 | 3 | VER-02 | visual regression lane | `npx playwright test tests/visual/manual-closeout.spec.ts --project=chromium --update-snapshots && npm run test:visual:closeout` | ✅ | ✅ green |
| 24-03-02 | 03 | 3 | VER-01, VER-02, VER-03 | closeout matrix | `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/utils/__tests__/format.test.ts src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx && npm run test:visual:closeout && npx tsc --noEmit` | ✅ | ✅ green |
| 24-04-01 | 04 | 4 | VER-04 | docs truth audit | `rg -n 'v0\\.5\\.0|manual-verification\\.html\\?view=phase-24-|Phase 24|closeout' README.md docs/en/roadmap.md docs/ru/roadmap.md .planning/ROADMAP.md .planning/REQUIREMENTS.md .planning/STATE.md` | ✅ | ⬜ pending |
| 24-04-02 | 04 | 4 | VER-01, VER-02, VER-03, VER-04 | full gate | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never && npm run test:visual:closeout` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Authoritative Closeout Matrix

| Requirement | Owned Seam | Proof Focus |
|-------------|------------|-------------|
| `VER-01` | `src/verification/manual/views.ts`, `src/verification/manual/scenarios.tsx`, `src/verification/manual/mockEnvironment.ts` | Named shell-integrated Phase 24 closeout views cover redesigned core surfaces and representative degraded states with deterministic `ready: true` status. |
| `VER-02` | `tests/visual/manual-closeout.spec.ts`, `playwright.config.ts` | Chromium screenshot baselines fail on visible drift for the curated milestone-owned closeout views only. |
| `VER-03` | `src/verification/manual/views.ts`, `src/verification/manual/scenarios.tsx`, `src/utils/format.ts`, `src/contexts/SettingsContext.tsx` | The closeout matrix exposes explicit dark/light and EN/RU pairs with visible translated copy, dates, counts, and stable theme-state presentation. |
| `VER-04` | `README.md`, `docs/en/roadmap.md`, `docs/ru/roadmap.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, `.planning/phases/24-verification-locale-and-release-truth/24-VERIFICATION.md` | Release-facing and planning truth are rolled forward from the proven closeout view set and final gate results, with any bounded residuals named explicitly. |

---

## Wave 0 Requirements

- [x] `playwright.config.ts` — Chromium-only screenshot configuration for manual closeout views with system-browser fallback
- [x] `tests/visual/manual-closeout.spec.ts` — visual regression runner bound to the Phase 24 closeout registry
- [x] `tests/visual/manual-closeout.spec.ts-snapshots/` — committed baseline screenshots for the owned Phase 24 closeout views
- [x] `npm install -D @playwright/test` — landed in `package.json`
- [x] System Chromium executable resolved through `playwright.config.ts` (`PLAYWRIGHT_CHROMIUM_EXECUTABLE` override supported when needed)
- [x] `npx playwright test tests/visual/manual-closeout.spec.ts --project=chromium --update-snapshots` — seeded the committed closeout baselines once the registry was deterministic

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Final `v0.5.0` closeout views read as one coherent shipped-product story instead of leftover phase routes | VER-01 | Reviewers need to judge shell composition, hierarchy, and narrative quality, not just DOM readiness | Open each `phase-24-*` proof view in `manual-verification.html`, confirm `ready: true`, and review that the set feels like one closeout matrix rather than mixed historical artifacts. |
| Dark/light and EN/RU comparisons are visually obvious and not only technically present | VER-03 | The milestone requires direct review of theme and locale truth beyond automated formatting assertions | Compare the paired theme views and paired locale views side by side or sequentially; confirm the differences are explicit, legible, and tied to real content with dates, counts, and translated copy. |
| Bounded residuals, if any, are honestly classified as non-blocking in release truth | VER-04 | This is a release-judgment call tied to the closeout narrative, not only a testable string presence check | Review README, EN/RU roadmap docs, and `24-VERIFICATION.md`; confirm any residual debt is small, named, and clearly marked as non-blocking rather than omitted or overstated. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 480s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
