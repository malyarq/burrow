---
status: diagnosed
trigger: "Diagnose one UAT gap for Phase 36: Create-modpack flow should not surface partial-success error copy after the modpack is already created without a calmer recovery story."
created: 2026-04-22T19:18:05Z
updated: 2026-04-22T19:26:18Z
---

## Current Focus

hypothesis: Confirmed. The wizard intentionally converts post-create metadata/config persistence failures into a user-facing partial-success recovery state after `createLocal` has already committed the modpack.
test: Completed by tracing the create flow, localization key, and Phase 35 tests/proof artifacts.
expecting: Root cause documented in Resolution.
next_action: Return diagnosis for the Phase 36 UAT gap.

## Symptoms

expected: Create-modpack should complete with a calmer recovery path after the modpack exists, instead of surfacing a partial-success error message as a major problem.
actual: User sees the message "Модпак уже создан, но следующий шаг настройки завершился ошибкой. Можно завершить сейчас и поправить сборку позже."
errors: Partial-success create-modpack recovery copy is shown after the modpack has already been created.
reproduction: Trigger create-modpack flow where the modpack is created successfully but the next setup step fails.
started: Reported during Phase 36 UAT test 3 on 2026-04-22.

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:20:44Z
  checked: src/components/modpacks/ModpackCreationWizard.tsx
  found: `createModpackForStep3` and `handleCreate` call `modpacksIPC.createLocal(...)`, then run `updateMetadata(...)` for the optional description and `persistCreatedGameSettings(...)` for OptiFine in separate follow-up steps.
  implication: Modpack creation is committed before description/config persistence finishes, so later failures are post-create, not creation failures.

- timestamp: 2026-04-22T19:21:32Z
  checked: src/components/modpacks/ModpackCreationWizard.tsx and src/locales/ru.json
  found: Both wizard paths store `committedId` after `createLocal`; if a later step throws, the catch branch keeps the created id, advances to step 3, and sets `postCommitNotice` to `modpacks.create_post_commit_recovery`, which matches the reported Russian copy exactly.
  implication: The reported message is emitted by an explicit recovery branch, not by a generic IPC error or random fallback.

- timestamp: 2026-04-22T19:24:18Z
  checked: src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx and src/verification/manual/views.ts
  found: The async-state test asserts that metadata failure after create must show recovery instead of rollback, and the manual proof route description explicitly advertises "explicit post-commit recovery on the same surface."
  implication: The partial-success recovery story was intentionally designed and locked in during Phase 35, so Phase 36 inherits it by design.

## Resolution

root_cause: `ModpackCreationWizard` treats description save and OptiFine config persistence as secondary post-create steps outside `createLocal`, and any failure after `committedId` is assigned is deliberately translated into `postCommitNotice` with the `modpacks.create_post_commit_recovery` copy. Because that recovery branch is covered by tests and manual proof, the flow intentionally surfaces the partial-success message instead of degrading quietly once the modpack already exists.
fix:
verification:
files_changed: []
