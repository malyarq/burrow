---
phase: 18
slug: verification-and-release-truth
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-17
---

# Phase 18 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never` |
| **Estimated runtime** | ~420 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific verification command for the surface you touched; if a task spans multiple milestone surfaces or updates shared verification seams, run the full quick run command above.
- **After every plan wave:** Run the full quick run command; after the final wave, run the full suite command including the packaging-aware build.
- **Before `$gsd-verify-work`:** The full suite must be green and browser-backed evidence must exist for `dashboard`, `modpack-details`, and `phase-17-polish`.
- **Max feedback latency:** 420 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 18-01-01 | 01 | 1 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | component matrix | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx` | ✅ | ⬜ pending |
| 18-01-02 | 01 | 1 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | component + type | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 18-02-01 | 02 | 2 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | manual seam static/type | `npx eslint src/verification/manual/ManualVerificationApp.tsx src/verification/manual/main.tsx src/verification/manual/mockEnvironment.ts src/verification/manual/scenarios.tsx src/verification/manual/views.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 18-02-02 | 02 | 2 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | manual + component | `npx vitest run src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.presets.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 18-03-01 | 03 | 3 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | docs + traceability audit | `rg -n 'manual-verification\\.html\\?view=(dashboard|modpack-details|phase-17-polish)|Phase 17|v0\\.4\\.0' README.md docs/en/roadmap.md docs/ru/roadmap.md .planning/ROADMAP.md .planning/REQUIREMENTS.md .planning/STATE.md && rg -n 'SET-01 \\| Phase 17 \\| Complete|SET-02 \\| Phase 17 \\| Complete' .planning/REQUIREMENTS.md` | ✅ | ⬜ pending |
| 18-03-02 | 03 | 3 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | workflow metadata audit | `node -e "const { execFileSync } = require('node:child_process'); const out = execFileSync('node', [process.env.HOME + '/.codex/get-shit-done/bin/gsd-tools.cjs', 'init', 'milestone-op'], { encoding: 'utf8' }); const data = JSON.parse(out); if (data.milestone_version !== 'v0.4' || data.completed_phases < 17) process.exit(1);" && npx tsc --noEmit` | ✅ | ⬜ pending |
| 18-04-01 | 04 | 4 | LAUNCH-01..04, DETAIL-01..03, CATALOG-01..03, SET-01..02 | full gate + packaging | `npm test && npm run lint && npx tsc --noEmit && npm run build -- --publish never` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Authoritative Closeout Matrix

| Requirement | Owned Seam | Proof Focus |
|-------------|------------|-------------|
| `LAUNCH-01` | `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` | Classic dashboard hero falls back to the shared launcher mark when artwork is missing |
| `LAUNCH-02` | `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` | Classic launch summary keeps the same resolved modloader label visible on the shipped surface |
| `LAUNCH-03` | `src/components/sidebar/__tests__/LaunchControls.status.test.tsx` | Shared launch CTA, progress copy, and restart affordances stay stage-aware instead of contradicting active launch state |
| `LAUNCH-04` | `src/components/sidebar/__tests__/LaunchControls.status.test.tsx` | Shared launch labels and progress detail are generated through the active translator instead of hard-coded English |
| `DETAIL-01` | `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` | Runtime-provided dependencies stay marked as satisfied on the repaired detail surface |
| `DETAIL-02` | `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` | Dependency requirements stay human-readable instead of leaking raw range syntax |
| `DETAIL-03` | `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx` | Dense detail navigation stays wrapped, keyboard-usable, and translated without horizontal-scroll defaulting |
| `CATALOG-01` | `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` and `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` | Remote and installed catalog controls stay readable at audited sidebar widths |
| `CATALOG-02` | `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` and `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` | No-art cards route through the launcher-mark fallback on both audited catalog surfaces |
| `CATALOG-03` | `src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx` | Collapsed navigation shows intentional icon-led active-state affordances instead of stray placeholder letters |
| `SET-01` | `src/components/__tests__/SettingsPage.navigation.test.tsx`, `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`, and `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx` | Settings shell, fallback labels, and touched appearance copy stay free of raw localization keys |
| `SET-02` | `src/components/settings/__tests__/AppearanceTab.presets.test.tsx` | Preset identity stays stable while exported and visible labels follow the current language policy |

---

## Wave 0 Requirements

Existing infrastructure already covers the phase. Phase 18 reuses:

- the focused Vitest suites added or hardened in Phases 15 to 17;
- the existing `manual-verification.html` application and its current `dashboard`, `modpack-details`, and `phase-17-polish` views;
- the standard repo gate of `npm test`, `npm run lint`, and `npx tsc --noEmit`;
- the packaging-aware closeout build `npm run build -- --publish never`.

No new test framework, browser automation platform, or snapshot layer is required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Launch truth remains believable on the existing `dashboard` verification view | LAUNCH-01..04 | The final proof needs a rendered surface showing fallback art, loader truth, synchronized launch feedback, and localized runtime copy together | Open `manual-verification.html?view=dashboard`, confirm the view reports `ready: true`, and review the rendered launch state for fallback art, active loader truth, localized waiting or failure copy, and visible read-only advanced settings |
| Modpack details still show satisfied runtime dependencies, readable requirement copy, and discoverable dense navigation on the shipped detail seam | DETAIL-01..03 | Phase 16 had a known headless-capture flake, so the repaired detail truth needs another real browser review | Open `manual-verification.html?view=modpack-details` in an isolated browser session, capture screenshot plus DOM or status output, and confirm the page stays ready while dependency satisfaction, readable copy, and wrapped dense navigation all remain visible |
| Catalog, compact-nav, and Russian settings proof holds on the existing Phase 17 seam with no raw keys | CATALOG-01..03, SET-01..02 | The closeout needs a rendered proof that the final polish surfaces hold together, including the negative check for raw settings keys | Open `manual-verification.html?view=phase-17-polish`, confirm the view reports `ready: true`, review constrained catalog controls, no-art fallback cards, collapsed sidebar active state, and Russian settings or appearance content, and verify no raw localization keys appear |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 420s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
