---
phase: 32
slug: shell-identity-and-sidebar-cohesion
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-22
---

# Phase 32 — Validation Strategy

> Per-phase validation contract for shell/sidebar closure against the direct feedback file.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/__tests__/TitleBar.branding.test.tsx src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/ui/__tests__/ArtworkFallback.policy.test.tsx electron/window/__tests__/windowManager.macos.test.ts src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run electron/window/__tests__/windowManager.macos.test.ts src/components/__tests__/TitleBar.branding.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/ui/__tests__/ArtworkFallback.policy.test.tsx src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint electron/window/windowManager.ts electron/app/bootstrap.ts src/components/TitleBar.tsx src/components/AppLayout.tsx src/components/sidebar/SidebarHeader.tsx src/app/assets/branding.ts src/components/ui/ArtworkFallback.tsx src/components/ui/LazyImage.tsx src/components/layout/EmptyStateView.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/verification/manual/scenarios.tsx src/verification/manual/views.ts && npx tsc --noEmit` |
| **Estimated runtime** | ~240 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific verify command for the task you touched. If a task crosses renderer shell and fallback surfaces together, use the quick run command instead of partial spot checks.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Wave 1 should include sidebar, macOS shell, and fallback seams immediately because the current repo already contains regression tests with the wrong contract.
- **Before `$gsd-verify-work`:** The full suite must be green, and manual proof must exist for real macOS shell behavior, sidebar readability in expanded and collapsed modes, and non-branded missing-art/fallback behavior on live surfaces.
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 32-01-01 | 01 | 1 | SHELL-09 | sidebar header readability | `npx vitest run src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx && npx tsc --noEmit` | ✅ contract flip | ⬜ pending |
| 32-01-02 | 01 | 1 | SHELL-09 | sidebar shell lint | `npx eslint src/components/sidebar/SidebarHeader.tsx src/components/Sidebar.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 32-02-01 | 02 | 1 | SHELL-10 | main-process native shell | `npx vitest run electron/window/__tests__/windowManager.macos.test.ts && npx tsc --noEmit` | ✅ contract flip | ⬜ pending |
| 32-02-02 | 02 | 1 | SHELL-10 | renderer title-bar and safe-area contract | `npx vitest run src/components/__tests__/TitleBar.branding.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx && npx eslint electron/window/windowManager.ts electron/app/bootstrap.ts src/components/TitleBar.tsx src/components/AppLayout.tsx src/services/ipc/windowControlsIPC.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 32-03-01 | 03 | 1 | BRAND-01 | neutral fallback policy across shared and modpack surfaces | `npx vitest run src/components/ui/__tests__/ArtworkFallback.policy.test.tsx src/components/ui/__tests__/LazyImage.cache.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx && npx tsc --noEmit` | ✅ contract flip | ⬜ pending |
| 32-03-02 | 03 | 1 | BRAND-01 | empty-state and shell-facing restraint | `npx vitest run src/components/layout/__tests__/EmptyStateView.branding.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx && npx eslint src/app/assets/branding.ts src/components/ui/ArtworkFallback.tsx src/components/ui/LazyImage.tsx src/components/layout/EmptyStateView.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx && npx tsc --noEmit` | ✅ contract flip | ⬜ pending |
| 32-04-01 | 04 | 2 | SHELL-09, SHELL-10, BRAND-01 | manual proof readiness copy | `npx vitest run src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` | ✅ contract flip | ⬜ pending |
| 32-04-02 | 04 | 2 | SHELL-09, SHELL-10, BRAND-01 | manual proof harness lint | `npx eslint src/verification/manual/scenarios.tsx src/verification/manual/views.ts && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Phase 32 does not need brand-new infrastructure files, but it does need several existing proof seams to flip to the new contract before execution can be trusted:

- [ ] `src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx` must stop defending `sidebar-app-icon` presence and start proving “no redundant logo block,” readable title text, and aligned compact affordances.
- [ ] `electron/window/__tests__/windowManager.macos.test.ts` must prove the native macOS chrome and icon-resolution contract instead of only `hiddenInset` plus one icon candidate.
- [ ] `src/components/layout/__tests__/EmptyStateView.branding.test.tsx` must stop protecting the branded hero empty state and instead lock a content-first fallback posture.
- [ ] `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` must stop normalizing `app-icon` as the installed/local missing-art default if Phase 32 chooses one neutral fallback rule across surfaces.
- [ ] `src/verification/manual/__tests__/appearanceProof.test.tsx` and `src/verification/manual/__tests__/views.test.ts` must gate readiness on direct-feedback shell criteria rather than stale milestone wording.

Wave 0 ownership is explicit in the execution plans:

- `32-01` flips the sidebar test seam before sidebar cleanup can be called done.
- `32-02` tightens the main-process and renderer shell tests before macOS closeout depends on them.
- `32-03` flips fallback and empty-state tests before a calmer placeholder contract can land safely.
- `32-04` updates the manual proof harness before any later milestone audit relies on it.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sidebar header reads naturally in normal and compact modes | SHELL-09 | unit tests cannot judge readability, clipping, or visual centering under real window widths | Run FMCL at common desktop width, confirm the sidebar title is fully readable without `Friend...`, confirm there is no redundant square logo block, and confirm the compact-mode burger and mode switch look centered and visually even |
| macOS shell feels native-first in a real window | SHELL-10 | jsdom and mocked `BrowserWindow` cannot prove live traffic-light clearance, drag behavior, or icon feel | Launch FMCL on macOS, confirm traffic lights are visible and unobstructed, confirm there is no competing renderer control group, confirm top-edge notifications clear the chrome, and confirm the dock/window icon matches the canonical launcher identity |
| Missing-art and empty/fallback surfaces stay calm and content-first | BRAND-01 | DOM assertions cannot fully judge whether a placeholder still reads as loud branding | Open browser/resource-pack/shader or other missing-art surfaces plus installed/local modpack cards, detail header artwork, and an empty-state surface; confirm all missing content follows one calm placeholder rule rather than mixing neutral art with launcher icons or cube-heavy filler |
| Manual proof hub reflects the new shell contract | SHELL-09, SHELL-10, BRAND-01 | the prior milestone already showed that stale proof language can mask product regressions | Open the Phase 32 relevant manual routes and confirm their descriptions/readiness text speak about readable sidebar header, native macOS shell, and calm fallback behavior rather than old milestone brand-reset wording |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or explicit Wave 0 contract-flip ownership
- [x] Wave 0 closes every outdated proof seam before execution depends on it
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] No watch-mode flags
- [x] Feedback latency < 240s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-22
