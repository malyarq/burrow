---
phase: 31
slug: guided-content-browsers-and-capability-expansion
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-20
---

# Phase 31 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Rapid seam command** | `npx vitest run src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts` |
| **Rapid seam runtime** | `~20-25 seconds` |
| **Wave-gate policy** | Longer contract, lint, and full-suite commands are reserved for the numbered Wave 1-8 gates below, not for common iteration loops. |

---

## Wave Gate Commands

| Gate | Command | Expected Use |
|------|---------|--------------|
| **Wave 1 gate** | `npm run contracts:check && npm run ipc:check && npx tsc --noEmit` | Run after `31-01` completes to lock the shared IPC outcome surface before later plans consume it. |
| **Wave 2 gate** | `npx vitest run src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/features/modpacks/__tests__/contentManifestTruth.test.ts && npx tsc --noEmit` | Run after `31-02` completes to prove the guided finalize seam no longer pollutes `manifest.files` and that shader-runtime groundwork lands without reopening IPC ownership. |
| **Wave 3 gate** | `npx vitest run src/components/modpacks/__tests__/GuidedContentEntry.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx && npx tsc --noEmit` | Run after `31-03` completes to prove canonical guided entry before fallback affordances land. |
| **Wave 4 gate** | `npx vitest run src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx && npx tsc --noEmit` | Run after `31-04` completes to prove explicit local fallback inside the guided route. |
| **Wave 5 gate** | `npx vitest run src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx && npx tsc --noEmit` | Run after `31-05` completes to prove honest shader capability guidance across the guided browser and installed-state surfaces. |
| **Wave 6 gate** | `npx vitest run src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx && npx tsc --noEmit` | Run after `31-06` completes to prove actionable recovery and non-mod copy truth. |
| **Wave 7 gate** | `npx vitest run src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` | Run after `31-07` completes to prove the refreshed manual harness before the final lock. |
| **Wave 8 gate** | `npx vitest run src/components/modpacks/__tests__/GuidedContentEntry.test.tsx src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/features/modpacks/__tests__/contentManifestTruth.test.ts src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npm run contracts:check && npm run ipc:check && npx eslint src/ && npx eslint electron/ && npx tsc --noEmit` | Run after `31-08` completes as the final bounded-scope regression and copy lock. |

---

## Sampling Rate

- **After every task commit:** Run the task-local verify command. Use the rapid seam command only for common iteration loops touching route shell, tab state, or runtime-summary surfaces where sub-30s feedback matters more than broad coverage.
- **After Wave 1 (`31-01`):** Run the Wave 1 gate before `31-02` consumes the shared IPC outcome surface.
- **After Wave 2 (`31-02`):** Run the Wave 2 gate before any canonical guided-entry work starts; the guided finalize seam must already stop non-mod manifest writes, and no shared contract, preload, or renderer IPC ownership should leak past this checkpoint.
- **After Wave 3 (`31-03`):** Run the Wave 3 gate to prove canonical guided entry before fallback affordances land.
- **After Wave 4 (`31-04`):** Run the Wave 4 gate to prove explicit local fallback before shader-capability messaging expands.
- **After Wave 5 (`31-05`):** Run the Wave 5 gate to prove honest shader guidance before recovery UX expands, including the guided-browser route shell that surfaces the compatibility copy.
- **After Wave 6 (`31-06`):** Run the Wave 6 gate to prove actionable recovery before manual-proof closeout begins.
- **After Wave 7 (`31-07`):** Run the Wave 7 gate before the final regression and copy lock starts.
- **After Wave 8 (`31-08`) and before `$gsd-verify-work`:** Run the Wave 8 gate and complete the manual guided-browser walkthrough for resource packs, shaders, compatibility guidance, fallback import, recoverable failure states, and bounded scope.
- **Max feedback latency:** rapid seam loops under 30 seconds; wave gates may run longer because they are reserved checkpoints.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 31-01-01 | 01 | 1 | CONTENT-03 | shared contract + IPC outcome typing | `npm run contracts:check && npm run ipc:check && npx tsc --noEmit` | ⬜ pending |
| 31-02-01 | 02 | 2 | CONTENT-02, CONTENT-05 | non-mod manifest truth + shader-runtime groundwork | `npx vitest run src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/features/modpacks/__tests__/contentManifestTruth.test.ts && npx tsc --noEmit` | ⬜ pending |
| 31-03-01 | 03 | 3 | CONTENT-01, CONTENT-05 | canonical guided entry from dashboard and details | `npx vitest run src/components/modpacks/__tests__/GuidedContentEntry.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx && npx tsc --noEmit` | ⬜ pending |
| 31-04-01 | 04 | 4 | CONTENT-01, CONTENT-04 | explicit local-file fallback inside guided browser | `npx vitest run src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx && npx tsc --noEmit` | ⬜ pending |
| 31-05-01 | 05 | 5 | CONTENT-02 | shader capability guidance tied to active runtime | `npx vitest run src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx && npx tsc --noEmit` | ⬜ pending |
| 31-06-01 | 06 | 6 | CONTENT-03 | actionable acquisition or import recovery | `npx vitest run src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx && npx tsc --noEmit` | ⬜ pending |
| 31-07-01 | 07 | 7 | CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04 | manual-proof harness refresh | `npx vitest run src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npx tsc --noEmit` | ⬜ pending |
| 31-08-01 | 08 | 8 | CONTENT-05 | final bounded-scope regression and copy lock | `npx vitest run src/components/modpacks/__tests__/GuidedContentEntry.test.tsx src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/features/modpacks/__tests__/contentManifestTruth.test.ts src/verification/manual/__tests__/guidedContentProof.test.tsx src/verification/manual/__tests__/views.test.ts && npm run contracts:check && npm run ipc:check && npx eslint src/ && npx eslint electron/ && npx tsc --noEmit` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/modpacks/__tests__/GuidedContentEntry.test.tsx` — dashboard and details both route resource-pack and shader add actions into the same in-app browser instead of invoking OS file pickers as primary paths
- [ ] `src/components/modpacks/__tests__/GuidedContentFallback.test.tsx` — guided browser exposes explicit local `.zip` fallback actions for resource packs and shaders
- [ ] `src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx` — resource-pack installed-state UI remains truthful while the guided browser becomes canonical
- [ ] `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx` — shader capability guidance covers supported, needs setup, unsupported, and unverified states
- [ ] `src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx` — import and download failures surface actionable recovery instead of generic counts
- [ ] `src/features/modpacks/__tests__/contentManifestTruth.test.ts` — non-mod content does not silently pollute `manifest.files`
- [ ] `src/verification/manual/__tests__/guidedContentProof.test.tsx` — manual proof route registry and stale-assumption guards for guided resource-pack and shader browsers

Existing infrastructure still anchors the common Phase 31 seams:

- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx`
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts`
- `src/verification/manual/__tests__/views.test.ts`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Guided resource-pack browser is the default path from both dashboard and modpack details | CONTENT-01, CONTENT-04 | The requirement is about user journey and IA, not just route wiring | Open both entry points and confirm add-resource-pack opens the same in-app browser flow. Verify local file import is available there as an explicit fallback action, not as the primary CTA on the parent surface. |
| Guided shader browser shows honest compatibility guidance | CONTENT-02 | Runtime support messaging still needs human judgment about clarity and overclaiming | Open shader acquisition from both launcher surfaces. Confirm the UI distinguishes supported, needs setup, unsupported, and unverified states without implying guaranteed compatibility. |
| Resource-pack and shader acquisition failures are recoverable and actionable | CONTENT-03 | Human review is needed to judge whether failure copy actually helps the user recover | Trigger one failed resource-pack acquisition or import and one failed shader acquisition or import. Confirm the UI names the failure clearly, keeps the user on-surface, and offers a next step instead of only a toast or generic count. |
| Phase remains bounded and does not read like a broad marketplace | CONTENT-05 | Scope discipline is a product judgment, not only a DOM assertion | Review the guided browser surfaces and confirm they feel like focused add-to-instance workflows. There should be no top-level marketplace hub, wishlist or store framing, or unrelated provider expansion beyond the bounded acquisition path. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or explicit Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Rapid seam command is sub-30s and reserved for common iteration loops only
- [x] Longer commands are reserved for Wave 1-8 gates
- [x] Wave 0 names the missing guided-entry, fallback, compatibility, manifest-truth, failure-recovery, and manual-proof seams
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-21
