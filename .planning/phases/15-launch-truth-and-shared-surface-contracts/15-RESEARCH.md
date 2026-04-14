---
phase: 15
slug: launch-truth-and-shared-surface-contracts
status: researched
created: 2026-04-14
requirements:
  - LAUNCH-01
  - LAUNCH-02
  - LAUNCH-03
  - LAUNCH-04
---

# Phase 15 Research

## Goal Lens

Phase 15 is a launch-surface truth repair phase, not a new launcher-flow phase. The plan needs to make the main play surface, shared launch controls, and launch-adjacent advanced settings agree on one current configuration and one current runtime state while replacing broken-image failure modes with deliberate branded fallback UI.

## Requirement Anchor

- `LAUNCH-01`: deliberate branded fallback on the audited launch surface
- `LAUNCH-02`: one consistent modloader value across controls, summary, and effective launch settings
- `LAUNCH-03`: progress, CTA state, and visible status all come from the same current stage
- `LAUNCH-04`: launch and runtime copy follows the active launcher language, including launch-adjacent controls shown on the main play surface

## Audited Bug Cluster Covered Here

- `BUG-01`: broken promo art on the main play surface
- `BUG-02`: raw i18n keys on launch-adjacent controls (`general.show_advanced`, `general.rescan`, `settings.java_auto`)
- `BUG-03`: selected loader and current-settings summary disagree
- `BUG-04`: log says installation is done while progress remains `0%` and CTA still reads as busy
- `BUG-05`: runtime-status detail leaks English into Russian UI

## Key Code Seams

### Renderer launch-truth seam

- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useLauncherState.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/services/launcherService.ts`

This seam already owns the stage model (`idle`, `preparing`, `downloading`, `launching`, `waiting`, `running`, `failed`), but it still mixes authoritative structured events with log-derived guesses. `useLauncherIPC.ts` mutates visible state both from parsed logs and from progress events, while `useLauncher.ts` also sets waiting/running text around the launch call. This makes the UI vulnerable to stale or contradictory status.

### Main audited surface

- `src/components/SimplePlayDashboard.tsx`
- `src/components/sidebar/LaunchControls.tsx`

`SimplePlayDashboard.tsx` owns the launch-status card, current-settings summary, advanced-settings section, and the current launch hero treatment. `LaunchControls.tsx` owns the shared CTA label, inline status copy, and disablement rules.

### Supporting seams

- `src/services/ipc/launcherIPC.ts`
- `electron/services/runtime/taskRunner.ts`
- `src/components/settings/tabs/GameTab.tsx`
- `src/components/settings/tabs/game/RuntimeSection.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/app/assets/branding.ts`

`taskRunner.ts` emits the structured task progress used by `launcher:progress`. `RuntimeSection.tsx` is the launch-adjacent source of the raw keys seen on the audited classic screen. `LazyImage.tsx` plus `LAUNCHER_MARK_PATH` provide the reusable fallback-art ingredients.

## Current Behavior And Likely Root Causes

### 1. Broken-art fallback is not instance-aware on the main play surface

`SimplePlayDashboard.tsx` currently renders the launcher mark as a decorative logo block, not as a fallback-capable instance/pack hero. The audited broken-image state is therefore likely coming from another unresolved artwork path on the main play surface, but the phase decision is clear: the main play surface needs an intentional branded fallback treatment that can show the active pack or instance identity instead of surfacing browser-broken imagery.

Planning implication:
- treat fallback art as a reusable surface contract, not as a one-off `img onError` patch
- reuse bundled branding and existing fallback-aware image helpers instead of introducing another ad hoc image path

### 2. Loader truth is split between current launch selections and persisted modpack summary

`SimplePlayDashboard.tsx` derives the current-settings modloader from `launch.loaderType` and hard-coded `LOADER_LABELS`, while other surfaces already have dependency/runtime helpers such as `getModloaderDisplayLabel`. The context and audit point to a stale-summary problem: pending current selection can disagree with persisted config or summary rendering.

Planning implication:
- normalize one source of truth for visible launch configuration on the classic screen
- avoid parallel label logic between dashboard and sidebar/runtime-summary surfaces

### 3. Progress truth is overwritten by log heuristics

`useLauncherIPC.ts` sets stage/title/detail from both `launcher:progress` and parsed log lines. `getLaunchStatusFromLog` marks broad log families as `downloading`, `preparing`, or `running`, and `getProgressStatus` forces a percentage detail string. This means a later log line can override a more reliable structured stage, and an unhelpful percentage can keep showing even after step completion.

Planning implication:
- structured stage and progress must win; logs should only provide concise detail when they do not contradict authoritative state
- progress UI needs an indeterminate mode when real percentage is not meaningful
- post-start waiting/running visibility should be durable for a short time instead of immediately collapsing back to idle

### 4. Busy-state rules are too binary

`LaunchControls.tsx` disables the main CTA whenever `isLaunching` is true. `SimplePlayDashboard.tsx` disables the “Go to Modpacks” button on busy state, but the advanced settings section remains broadly interactive. The phase decisions require a narrower contract: only launch-affecting controls should lock, and advanced settings should stay visible but read-only.

Planning implication:
- create an explicit “launch-affecting controls” disable model shared by dashboard and sidebar
- prefer dimmed/read-only controls over hiding or collapsing sections during active work

### 5. Launch-adjacent localization has real missing keys

The audit-listed keys are not present in `src/locales/en.json` or `src/locales/ru.json`:

- `general.show_advanced`
- `general.rescan`
- `settings.java_auto`

`RuntimeSection.tsx` currently renders those keys directly through `t(...) || fallback`, which fails because the translation function returns the key string, not an empty string. This is a concrete root cause, not only a visual symptom.

Planning implication:
- add the missing keys in both locales
- convert launch-adjacent launch-screen copy to the `translateWithFallback` pattern where needed
- keep raw runtime/log detail from leaking directly into the card without localization or shortening

## Constraints

- User-facing strings must live in `src/locales/en.json` and `src/locales/ru.json`.
- Renderer code should continue going through existing IPC wrappers and launcher hooks, not `window.*`.
- The phase should not reopen unrelated modpack-detail, catalog, or settings-IA work.
- The fix should preserve the existing stage model and evolve it, not replace it with a second state machine elsewhere.
- No new test framework: use the existing Vitest + lint + TypeScript gates.

## Likely Planning Slices

### Slice A: Shared launch truth model

Scope:
- make structured launch state authoritative
- define how progress/detail/CTA derive from stage
- preserve failure and waiting states durably enough for the UI

Likely files:
- `src/features/launcher/services/launcherService.ts`
- `src/features/launcher/hooks/useLauncherState.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/hooks/useLauncher.ts`

### Slice B: Main play surface and shared controls

Scope:
- deliberate branded fallback hero/state on the audited main surface
- current-settings loader truth aligned with active launch configuration
- dedicated status card + read-only busy-state treatment on dashboard and sidebar controls

Likely files:
- `src/components/SimplePlayDashboard.tsx`
- `src/components/sidebar/LaunchControls.tsx`
- possibly shared helper seams for loader display / art fallback

### Slice C: Launch-adjacent localization and regression proof

Scope:
- add missing locale keys and route launch-adjacent copy through safe fallback translation
- add focused tests for stage rendering, CTA labeling, loader truth, and translated launch-adjacent text

Likely files:
- `src/locales/en.json`
- `src/locales/ru.json`
- `src/components/__tests__/SimplePlayDashboard.*`
- `src/components/sidebar/__tests__/LaunchControls.*`
- possibly `RuntimeSection` tests if the launch-surface copy fix is covered there

## Risks

- log parsing currently doubles as stage inference and detail extraction; tightening authority without losing useful detail needs a clear precedence rule
- the classic screen may still derive loader selection from more than one context object, so “fix the label” alone can leave stale state elsewhere
- branded fallback work can easily sprawl into catalog/detail parity; Phase 15 should only establish the shared family and land the audited launch surface
- busy-state read-only behavior may require passing disable flags deeper into game settings controls; the plan should keep this bounded to launch-affecting controls on the audited surface

## Recommended Wave Shape

- Wave 1: launch truth contract and stage precedence
- Wave 1: launch-surface fallback art and current-settings truth
- Wave 2: launch-adjacent localization cleanup, busy-state read-only pass, and focused regression coverage
- Wave 3: integrated gate and manual verification on the audited flow

Parallelism note:
- the state-contract slice and dashboard/hero slice can run in the same wave if they touch distinct files and the plan makes the state shape explicit first

## Validation Architecture

### Existing test infrastructure

- framework: `vitest`
- config: `vitest.config.ts`
- static gates already used across the repo: `npm run lint`, `npx tsc --noEmit`

### Fast feedback

- focused component tests for dashboard and launch controls
- focused lint/type runs on launcher hooks and launch-surface components

### Coverage gaps the phase should close

- authoritative stage precedence when both progress and logs arrive
- waiting/running/failed persistence on the main play surface
- loader summary truth for the current classic launch selection
- branded fallback rendering when launch artwork is missing or invalid
- missing locale keys on launch-adjacent controls shown inside the classic screen

### Manual-only checks

- confirm the launch-status card remains understandable during a real preparing/download/waiting flow
- confirm read-only busy-state treatment is clear without a full blocking overlay
- confirm the branded fallback feels intentional rather than like a technical error placeholder

## Planning Guidance

- keep plans goal-backward: truthful source of configuration, truthful source of status, truthful localization, and intentional fallback art
- avoid writing a plan that only tweaks copy; at least one plan must explicitly repair state authority
- ensure every requirement ID `LAUNCH-01` through `LAUNCH-04` appears in plan frontmatter
- keep Phase 15 scoped to launch surfaces only; detail, catalog, nav, and settings-wide cleanup belong to later phases

## Files Inspected

- `.planning/phases/15-launch-truth-and-shared-surface-contracts/15-CONTEXT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/features/launcher/services/launcherService.ts`
- `src/features/launcher/hooks/useLauncherState.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/hooks/useLauncher.ts`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/sidebar/LaunchControls.tsx`
- `src/components/settings/tabs/GameTab.tsx`
- `src/components/settings/tabs/game/RuntimeSection.tsx`
- `src/components/sidebar/ModpackDependencySummary.tsx`
- `src/services/ipc/launcherIPC.ts`
- `electron/services/runtime/taskRunner.ts`
