---
phase: 20
slug: brand-system-shared-tokens-and-surface-migration
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-17
---

# Phase 20 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx` |
| **Full suite command** | `npx vitest run src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/__tests__/TitleBar.branding.test.tsx src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/ui/__tests__/ArtworkFallback.policy.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx && npx tsc --noEmit && npx eslint src/` |
| **Estimated runtime** | ~210 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the touched seam. If a task changes both brand primitives and fallback consumers, run the currently executable phase suite for completed waves, starting from the quick run command above.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Use the quick run command above during wave 1; extend it with new phase-owned tests as branding and fallback seams land in later waves; after the final wave, run the full suite command including `npx eslint src/`.
- **Before `$gsd-verify-work`:** The full suite must be green and manual proof must exist for launcher-home, appearance settings, modpack list or browser, one deep media route, and one empty or fallback-art representative rendered inside the real shell.
- **Max feedback latency:** 210 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 20-01-01 | 01 | 1 | BRAND-01, BRAND-02 | token + asset structure | `npx eslint src/app/assets/branding.ts src/app/hooks/useAppIcon.ts src/components/branding/BrandMark.tsx src/components/branding/BrandWordmark.tsx src/components/branding/BrandLockup.tsx src/index.css src/contexts/settings/theme.ts src/contexts/settings/accent.ts src/contexts/settings/theme-presets.ts src/contexts/settings/types.ts && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 20-01-02 | 01 | 1 | BRAND-01, BRAND-02 | brand primitive seam | `npx vitest run src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/TitleBar.branding.test.tsx` | ❌ planned | ⬜ pending |
| 20-02-01 | 02 | 2 | BRAND-01, BRAND-02 | shell + settings migration | `npx eslint src/components/TitleBar.tsx src/components/sidebar/SidebarHeader.tsx src/components/SimplePlayDashboard.tsx src/components/SimplePlayHome.tsx src/components/onboarding/WelcomePage.tsx src/components/layout/EmptyStateView.tsx src/components/settings/tabs/AppearanceTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 20-02-02 | 02 | 2 | BRAND-01, BRAND-02 | shell brand truth | `npx vitest run src/components/__tests__/TitleBar.branding.test.tsx src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx` | ❌ planned | ⬜ pending |
| 20-03-01 | 03 | 3 | BRAND-03 | fallback policy structure | `npx eslint src/components/ui/LazyImage.tsx src/components/ui/ArtworkFallback.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/WorldDatapacksModal.tsx src/components/modpacks/InstallModpackPage.tsx src/components/modpacks/AddModPage.tsx src/components/modpacks/AddModModal.tsx src/components/sidebar/ModpackSection.tsx src/features/accounts/AccountSkinPanel.tsx && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 20-03-02 | 03 | 3 | BRAND-03 | artwork fallback seam | `npx vitest run src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/ui/__tests__/ArtworkFallback.policy.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` | ❌ planned | ⬜ pending |
| 20-04-01 | 04 | 4 | BRAND-01, BRAND-02, BRAND-03 | manual proof seam static/type | `npx eslint src/verification/manual/scenarios.tsx src/verification/manual/views.ts src/verification/manual/mockEnvironment.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 20-04-02 | 04 | 4 | BRAND-01, BRAND-02, BRAND-03 | focused phase suite | `npx vitest run src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/__tests__/TitleBar.branding.test.tsx src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/ui/__tests__/ArtworkFallback.policy.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx && npx tsc --noEmit && npx eslint src/` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure already covers the phase. Phase 20 reuses:

- the existing Vitest setup in `vitest.config.ts`;
- current branding-adjacent tests such as `SimplePlayDashboard.launch-state.test.tsx`, `SimplePlayHome.visualTruth.test.tsx`, `LazyImage.cache.test.tsx`, `ModpackList.ergonomics.test.tsx`, and `ModpackBrowser.ergonomics.test.tsx`;
- the shared manual verification application in `src/verification/manual/*`;
- the standard repo checks `npx tsc --noEmit` and `npx eslint src/`.

No new test framework, screenshot runner, or watch-mode tooling is required.

The new Phase 20 structural tests for canonical brand usage and artwork fallback policy are created during execution:

- `src/components/__tests__/TitleBar.branding.test.tsx`
- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx`
- `src/components/ui/__tests__/ArtworkFallback.policy.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx`

These files are not required for wave 1 feedback; they become part of the executable phase matrix as their owning plans land.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shell-owned FMCL surfaces present one deliberate mark/wordmark system | BRAND-01, BRAND-02 | Typography, mark scale, and logo repetition are partly visual and easy to miss in DOM-only tests | Open shell-integrated launcher-home, onboarding or empty-state proof, and appearance settings. Confirm the same mark/wordmark pairing, typography tone, and surface language read consistently without duplicate or competing brand treatments |
| Missing artwork uses the product fallback policy instead of arbitrary launcher branding | BRAND-03 | Screenshot trust depends on whether fallback imagery feels neutral, intentional, and appropriate for content | Review shell-integrated modpack list or browser plus one deep media route such as details, resource packs, world-datapacks, install, add-content, or account skin. Confirm missing artwork follows the new policy and does not fall back to raw `/icon.png` or an overbearing launcher-logo placeholder |
| Brand migration preserves real-shell composition across routed surfaces | BRAND-01 | Token and chrome changes can look coherent in isolated tests while drifting inside the live shell | Open the Phase 20 shell-integrated proof views and capture at least one dark-theme and one light-theme screenshot showing launcher-home, a content-heavy route, and appearance settings using the same brand language |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure dependencies
- [x] Quick-run guidance is wave-aware and executable from wave 1 onward
- [x] New Phase 20 structural tests are scheduled into later waves instead of blocking early feedback loops
- [x] No watch-mode flags
- [x] Final full matrix becomes mandatory only after wave 4 test seams land
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
