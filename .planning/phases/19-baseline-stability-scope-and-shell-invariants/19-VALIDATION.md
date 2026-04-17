---
phase: 19
slug: baseline-stability-scope-and-shell-invariants
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-17
---

# Phase 19 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/AppLayout.responsive.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/__tests__/AddModModal.i18n.test.tsx src/components/ui/__tests__/Modal.a11y.test.tsx` |
| **Full suite command** | `npx vitest run src/components/__tests__/AppLayout.responsive.test.tsx src/components/__tests__/Sidebar.primary-action.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/components/ui/__tests__/Modal.a11y.test.tsx && npx tsc --noEmit && npx eslint src/` |
| **Estimated runtime** | ~180 seconds |

---

## Sampling Rate

- **After every task commit:** Run the seam-specific verify command for the task you touched; if a task changes both shared shell and route seams, run the currently executable phase suite for the completed waves, starting from the quick run command above.
- **After every plan wave:** Run the currently executable phase suite for all completed waves. Use the quick run command above during wave 1; extend it with new phase-owned tests as those seams land in waves 2-4; after the final wave, run the full suite command including `npx eslint src/`.
- **Before `$gsd-verify-work`:** The full suite must be green and manual proof must exist for shell-integrated launcher-home, modpack-details, create-wizard, add-content, `export`, `install`, `importPreview`, and add-mod modal states.
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 19-01-01 | 01 | 1 | SHELL-01 | shell structure | `npx eslint src/components/AppLayout.tsx src/components/TitleBar.tsx src/components/Sidebar.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 19-01-02 | 01 | 1 | SHELL-01 | component seam | `npx vitest run src/components/__tests__/AppLayout.responsive.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 19-02-01 | 02 | 2 | SHELL-03 | shell + route ownership | `npx eslint src/components/modpacks/ModpackRouter.tsx src/components/Sidebar.tsx src/components/sidebar/LaunchControls.tsx src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsActions.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 19-02-02 | 02 | 2 | SHELL-03 | component seam | `npx vitest run src/components/__tests__/Sidebar.primary-action.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx` | ❌ planned | ⬜ pending |
| 19-03-01 | 03 | 3 | SHELL-02 | route overflow structure | `npx eslint src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/details/ModpackDetailsActions.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 19-03-02 | 03 | 3 | SHELL-02 | route + modal flow | `npx vitest run src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/components/ui/__tests__/Modal.a11y.test.tsx && npx tsc --noEmit` | ❌ planned | ⬜ pending |
| 19-04-01 | 04 | 4 | SHELL-01, SHELL-02, SHELL-03 | manual seam static/type | `npx eslint src/verification/manual/scenarios.tsx src/verification/manual/views.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 19-04-02 | 04 | 4 | SHELL-01, SHELL-02, SHELL-03 | focused phase suite | `npx vitest run src/components/__tests__/AppLayout.responsive.test.tsx src/components/__tests__/Sidebar.primary-action.test.tsx src/components/sidebar/__tests__/LaunchControls.status.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/components/ui/__tests__/Modal.a11y.test.tsx && npx tsc --noEmit && npx eslint src/` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure already covers the phase. Phase 19 reuses:

- the existing Vitest setup in `vitest.config.ts`;
- existing shell and launch seam tests such as `AppLayout.responsive.test.tsx` and `LaunchControls.status.test.tsx`;
- the current manual verification application in `src/verification/manual/*`;
- the standard repo checks `npx tsc --noEmit` and `npx eslint src/`.

No new test framework, screenshot platform, or watch-mode tooling is required.

The new Phase 19 structural tests for CTA ownership and overflow truth are created during execution:

- `src/components/__tests__/Sidebar.primary-action.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx`
- `src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModModal.layout.test.tsx`

These files are not required for wave 1 feedback; they become part of the executable phase matrix as their owning plans land.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Major launcher surfaces clear the custom title bar inside the real shell | SHELL-01 | jsdom can assert structure, but the screenshot bug is shell-integrated and visually obvious only with the real title bar + sidebar composition | Open the Phase 19 shell-integrated proof view, confirm the top edge shows no cropped `Collapse sidebar` strip or under-title-bar content, and capture at least one screenshot in dark mode and one in light mode |
| Deep routes show exactly one dominant primary action in context | SHELL-03 | CTA hierarchy is partly visual; automation can prove DOM ownership but manual proof should catch "still looks primary" regressions | Review shell-integrated `launcher-home`, `modpack-details`, `create-wizard`, `add-content`, `export`, `install`, and `importPreview` proof views. Confirm sidebar `PLAY` is the single dominant primary only on `launcher-home`, and each deep route shows one route-owned dominant action with shell launch demoted or absent |
| Dense route endings and modal helper text remain visible without overlay-style clipping | SHELL-02 | Nested scroll and footer pressure are easier to misread than to unit test exhaustively | Scroll to the final content edge in shell-integrated `modpack-details`, `create-wizard`, `add-content`, and add-mod modal proof states; confirm helper text and final controls remain fully visible |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure dependencies
- [x] Quick-run guidance is wave-aware and executable from wave 1 onward
- [x] New Phase 19 structural tests are scheduled into later waves instead of blocking early feedback loops
- [x] No watch-mode flags
- [x] Final full matrix becomes mandatory only after wave 4 test seams land
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
