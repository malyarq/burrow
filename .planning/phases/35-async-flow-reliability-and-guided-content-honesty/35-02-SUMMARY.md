---
phase: 35-async-flow-reliability-and-guided-content-honesty
plan: "02"
subsystem: ui
tags: [react, typescript, vitest, async, recovery]
requirements:
  - MODPACK-13
  - MODPACK-14
completed: 2026-04-22
---

# Phase 35 Plan 02 Summary

## Outcome

The add-mod page and modal now keep their primary action rails outside the scrolling result viewport, and mixed-success installs stay on-surface with retry-ready explanations that name the blocked items instead of only reporting counts.

## What Changed

- Split the add page and add modal into dedicated results scrollers plus fixed bottom action rails so streaming search results can no longer bury the confirmation CTA.
- Kept selection truth tied to the currently visible results while preserving retained selections after failed installs or manifest writes.
- Replaced count-only mixed-success notices with itemized recovery copy that distinguishes install failures from manifest-write failures on both add surfaces.
- Updated the page and modal layout tests plus async recovery coverage so the older “actions live inside the big scroll flow” contract and generic recovery notices now fail regression checks.

## Verification

- `npx vitest run src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModModal.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/__tests__/AddModModal.layout.test.tsx src/components/modpacks/__tests__/AddModModal.i18n.test.tsx`
- `npx eslint src/components/modpacks/AddModPage.tsx src/components/modpacks/AddModModal.tsx src/services/ipc/modsIPC.ts src/services/ipc/modpacksIPC.ts`
- `npx tsc --noEmit`

## Notes

- No task commit was created because the executor stalled before closeout and the owned seams remained on a shared dirty baseline.
- The manual add-flow walkthrough was not rerun in a live window during this plan.
