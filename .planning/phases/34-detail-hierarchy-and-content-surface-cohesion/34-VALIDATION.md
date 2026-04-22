---
phase: 34
slug: detail-hierarchy-and-content-surface-cohesion
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-22
---

# Phase 34 — Validation Strategy

> Per-phase validation contract for detail hierarchy, runtime truth, and content-surface cohesion against the direct feedback file.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.runtime-truth.test.tsx && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/ModpackDetails.runtime-truth.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/details/ModpackDetailsActions.tsx src/components/modpacks/details/ModpackDetailsInfoTab.tsx src/components/modpacks/details/ModpackDetailsSettingsTab.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/ShadersTab.tsx src/components/modpacks/details/WorldsTab.tsx src/components/sidebar/ModpackDependencySummary.tsx src/features/modpacks/hooks/useModpackRuntimeSummary.ts src/features/screenshots/components/ScreenshotsTab.tsx src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam you touched; use the quick run command only as the generic smoke fallback.
- **After every plan wave:** Run the full suite command for all completed wave seams.
- **Before `$gsd-verify-work`:** Full suite must be green, and manual proof must exist for tab reachability, first-read runtime/dependency authority, and shared content workspace language.
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 34-01-01 | 01 | 1 | MODPACK-11 | route-top hierarchy and tab reachability | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 34-01-02 | 01 | 1 | MODPACK-11 | details host composition lint | `npx eslint src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/details/ModpackDetailsActions.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 34-02-01 | 02 | 2 | MODPACK-12 | default details runtime truth and source transition | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.runtime-truth.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 34-02-02 | 02 | 2 | MODPACK-12 | route-owned summary semantics and alignment | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.runtime-truth.test.tsx src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts && npx eslint src/components/modpacks/details/ModpackDetailsInfoTab.tsx src/components/modpacks/details/ModpackDetailsSettingsTab.tsx src/components/sidebar/ModpackDependencySummary.tsx src/features/modpacks/hooks/useModpackRuntimeSummary.ts && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 34-03-01 | 03 | 3 | CONTENT-07, MODPACK-12 | shared content workspace contract and tab language | `npx vitest run src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetails.density.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 34-03-02 | 03 | 3 | CONTENT-07, MODPACK-12 | content-tab implementation lint and semantics | `npx eslint src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/ShadersTab.tsx src/components/modpacks/details/WorldsTab.tsx src/features/screenshots/components/ScreenshotsTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 34-04-01 | 04 | 4 | MODPACK-11, MODPACK-12, CONTENT-07 | manual proof route descriptions | `npx vitest run src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 34-04-02 | 04 | 4 | MODPACK-11, MODPACK-12, CONTENT-07 | manual proof harness lint | `npx eslint src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/modpacks/__tests__/ModpackDetails.runtime-truth.test.tsx` — add a route-level seam that proves the default details surface shows one authoritative runtime/dependency summary and that metadata-to-config transition does not silently overclaim truth.
- [ ] `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` — expand cross-tab coverage so it asserts one shared details-workspace contract, including worlds and screenshots fit inside the same host surface.
- [ ] `src/verification/manual/__tests__/views.test.ts` — tighten route descriptions so `modpack-details` and the retained legacy density views describe the Phase 34 contract instead of the older density-only story.

Wave 0 ownership should be explicit in the plans:

- `34-02` owns the new route-level runtime truth seam before authoritative-summary claims are considered done.
- `34-03` owns the stronger cross-tab workspace proof before shared content language claims are considered done.
- `34-04` owns the proof-harness wording refresh before later audits rely on those routes.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Details tabs feel readable immediately after a switch at common desktop widths | MODPACK-11 | DOM assertions cannot fully judge whether content really feels above the fold | Open `modpack-details`, switch through tabs at desktop width, and confirm useful content starts without scrolling past another oversized mini-hero |
| First-read runtime and dependency summary feels authoritative | MODPACK-12 | tests can prove data source and copy, but not whether the surface reads as confirmed truth | Open details on a modpack with non-vanilla runtime, confirm the default tab shows the authoritative summary, and verify healthy state reads neutral, warning reads cautionary, and broken state reads red |
| Mods, Resource Packs, Shaders, Worlds, and Screenshots feel like one workspace | CONTENT-07 | feature-local tests cannot fully judge cohesion across tabs | Compare the top shell, action grammar, empty/degraded treatment, and outer container across all content tabs in one session; confirm screenshots no longer feels like a foreign surface |
| Manual proof routes describe the real Phase 34 contract | MODPACK-11, MODPACK-12, CONTENT-07 | stale proof copy can let future closeout work review the wrong behaviors | Open `modpack-details`, `phase-21-details-density`, and `phase-21-secondary-density` in the proof hub and confirm they instruct reviewers to check tab reachability, authoritative runtime truth, and one shared content language |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit Wave 0 ownership
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 identifies the missing proof seams before execution depends on them
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-22
