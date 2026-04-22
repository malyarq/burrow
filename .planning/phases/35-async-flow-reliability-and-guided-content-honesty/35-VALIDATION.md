---
phase: 35
slug: async-flow-reliability-and-guided-content-honesty
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-22
---

# Phase 35 — Validation Strategy

> Per-phase validation contract for async-flow trust, guided-content honesty, and active-modpack continuity against the direct feedback file.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/modpacks/__tests__/CreateModpackFlow.explainability.test.tsx src/components/modpacks/__tests__/AddModModal.async-recovery.test.tsx && npx tsc --noEmit` |
| **Full suite command** | `npx vitest run src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx src/components/modpacks/__tests__/CreateModpackFlow.explainability.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModModal.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/components/modpacks/__tests__/GuidedContentEntry.test.tsx src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx src/features/modpacks/__tests__/modpackNavigationState.test.tsx src/contexts/__tests__/ModpackContext.selection-stability.test.ts src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/components/modpacks/ModpackCreationWizard.tsx src/components/modpacks/AddModPage.tsx src/components/modpacks/AddModModal.tsx src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/ShadersTab.tsx src/contexts/ModpackContext.tsx src/contexts/instances/hooks/useInstanceCrudActions.ts src/features/modpacks/hooks/useModpackRuntimeSummary.ts src/services/ipc/modsIPC.ts src/services/ipc/modpacksIPC.ts src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` |
| **Estimated runtime** | ~35 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific verify command for the seam you touched; use the quick run command only as the generic smoke fallback.
- **After every plan wave:** Run the full suite command for all completed wave seams.
- **Before `$gsd-verify-work`:** Full suite must be green, and manual proof must exist for fixed CTA rails, actionable create/add failures, guided runtime clarity, and active-modpack continuity.
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 35-01-01 | 01 | 1 | MODPACK-13, MODPACK-14 | create wizard fixed action rail and explainable failure states | `npx vitest run src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx src/components/modpacks/__tests__/CreateModpackFlow.explainability.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 35-01-02 | 01 | 1 | MODPACK-13, MODPACK-14 | create wizard implementation lint and locale safety | `npx eslint src/components/modpacks/ModpackCreationWizard.tsx src/components/sidebar/modpackRuntimeDependencies.ts src/components/sidebar/ModpackDependencySummary.tsx src/locales/en.json src/locales/ru.json && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 35-02-01 | 02 | 2 | MODPACK-13, MODPACK-14 | add page and modal action-rail stability under streaming results | `npx vitest run src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModModal.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 35-02-02 | 02 | 2 | MODPACK-13, MODPACK-14 | add page and modal recovery copy plus implementation lint | `npx eslint src/components/modpacks/AddModPage.tsx src/components/modpacks/AddModModal.tsx src/services/ipc/modsIPC.ts src/services/ipc/modpacksIPC.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 35-03-01 | 03 | 3 | CONTENT-08, CONTENT-09 | guided resource-pack and shader runtime guidance plus live recovery | `npx vitest run src/components/modpacks/__tests__/GuidedContentEntry.test.tsx src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx && npx tsc --noEmit` | ✅ partial | ⬜ pending |
| 35-03-02 | 03 | 3 | CONTENT-08, CONTENT-09 | guided content implementation lint and runtime-summary alignment | `npx eslint src/components/modpacks/AddModPage.tsx src/components/modpacks/details/ResourcePacksTab.tsx src/components/modpacks/details/ShadersTab.tsx src/features/modpacks/hooks/useModpackRuntimeSummary.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 35-04-01 | 04 | 4 | MODPACK-14, CONTENT-09 | active-modpack selection continuity and navigation stability | `npx vitest run src/features/modpacks/__tests__/modpackNavigationState.test.tsx src/contexts/__tests__/ModpackContext.selection-stability.test.ts && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 35-04-02 | 04 | 4 | MODPACK-13, MODPACK-14, CONTENT-08, CONTENT-09 | manual proof route descriptions and guided proof refresh | `npx vitest run src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx eslint src/verification/manual/views.ts src/verification/manual/scenarios.tsx && npx tsc --noEmit` | ✅ partial | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/modpacks/__tests__/CreateModpackFlow.explainability.test.tsx` — add a create-flow seam that proves FMCL keeps the primary action reachable and explains pre-commit runtime/dependency causes separately from post-commit recovery.
- [ ] `src/components/modpacks/__tests__/AddModPage.layout.test.tsx` and `src/components/modpacks/__tests__/AddModModal.layout.test.tsx` — rewrite the current layout proof so it rejects action rails living inside the streaming results scroller.
- [ ] `src/components/modpacks/__tests__/AddModModal.async-recovery.test.tsx` — add a modal-specific async recovery seam because create step 3 and modpack-details mod management still depend on the overlay flow, not only on the route page.
- [ ] `src/contexts/__tests__/ModpackContext.selection-stability.test.ts` — add a provider-level seam that proves active-modpack selection reaches the final config without route-visible churn or blank-state fallback.
- [ ] `src/verification/manual/__tests__/views.test.ts` — tighten route descriptions so create, add, modal, and guided-content proof routes mention fixed CTA rails, actionable failures, and active-runtime honesty.

Wave 0 ownership should be explicit in the plans:

- `35-01` owns the new create-flow explainability seam before create failure claims are considered done.
- `35-02` owns the rewritten add-page and add-modal action-rail proof plus the new modal async seam before “fixed CTA” claims are considered done.
- `35-04` owns the new selection-continuity seam and the manual-proof wording refresh before later audits rely on them.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Create and add confirmation actions stay reachable while content grows | MODPACK-13 | DOM tests cannot fully judge whether the action still feels pinned and trustworthy | Open create wizard step 3, add-mod route, and add-mod modal with long result lists; confirm the primary CTA remains visible or obviously reachable without fighting the result stream |
| Create and add failures read as next-action explanations | MODPACK-14 | tests can prove copy branches, but not whether the message actually answers “what should I do now?” | Trigger a create-flow runtime warning path and a mixed-success add path; confirm the UI names the issue and points to the corrective next step |
| Guided resource-pack and shader flows answer compatibility questions honestly | CONTENT-08 | a human still needs to judge whether low-claim honesty is clear instead of vague | Open guided resource-pack and shader routes from the real shell, compare supported / needs-setup / unsupported / unverified states, and confirm the copy makes FMCL’s certainty boundary obvious |
| Active-modpack switching no longer visibly flickers | MODPACK-14 | automated tests can only approximate churn | Switch active modpacks repeatedly from list and details, then launch from details; confirm there is no obvious blank frame, duplicate transition, or final-state bounce |
| Manual proof routes describe the real Phase 35 contract | MODPACK-13, MODPACK-14, CONTENT-08, CONTENT-09 | stale proof copy can still let closeout review the wrong behavior | Open `modpack-create`, `modpack-add`, `modpack-add-modal`, `guided-resourcepacks`, `guided-shaders`, and recovery variants; confirm they instruct reviewers to check fixed CTA rails, actionable failure copy, and runtime honesty |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit Wave 0 ownership
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 identifies the missing proof seams before execution depends on them
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-22
