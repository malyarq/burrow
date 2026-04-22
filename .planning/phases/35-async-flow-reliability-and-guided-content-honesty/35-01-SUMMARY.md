---
phase: 35-async-flow-reliability-and-guided-content-honesty
plan: "01"
subsystem: ui
tags: [react, typescript, vitest, layout, explainability]
requirements:
  - MODPACK-13
  - MODPACK-14
completed: 2026-04-22
---

# Phase 35 Plan 01 Summary

## Outcome

The create-modpack wizard now keeps its action rail pinned below a dedicated scroll region, and create failures no longer collapse into one generic error when the current runtime summary already exposes a truthful cause and next step.

## What Changed

- Kept the wizard CTA rail outside the growing step content so step-two dependency warnings, step-three mod lists, and recovery notices cannot push the primary action below the fold.
- Reused the runtime dependency seam to turn OptiFine and modloader incompatibility warnings into actionable create-flow error copy instead of a generic create failure.
- Preserved the explicit post-commit recovery branch so metadata or follow-up setup failures stay on the same surface without pretending the committed modpack vanished.
- Added layout and explainability coverage that rejects the older “actions live inside the scroll flow” contract and the older generic-error fallback when a specific runtime cause is available.

## Verification

- `npx vitest run src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx src/components/modpacks/__tests__/CreateModpackFlow.explainability.test.tsx src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx`
- `npx eslint src/components/modpacks/ModpackCreationWizard.tsx src/components/sidebar/modpackRuntimeDependencies.ts src/components/sidebar/ModpackDependencySummary.tsx`
- `npx tsc --noEmit`

## Notes

- Task 1 landed as `de9f9bf` (`fix(35-01): keep create wizard action rail reachable`); the remaining explainability changes stayed uncommitted on the shared dirty baseline.
- The manual create-flow walkthrough was not rerun in a live window during this plan.
