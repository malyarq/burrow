# Testing Patterns and Coverage Gaps

## Scope

This note maps the current test strategy for FMCL as it exists in code and CI. It covers automated checks in `package.json` and `.github/workflows/ci.yml`, the full-installation harness under `scripts/` and `electron/app/tests/`, and the absence of unit/component tests across the React, preload, and Electron service layers.

## Documented Testing Strategy

The repo docs in `docs/en/testing.md`, `docs/ru/testing.md`, and `docs/en/development.md` describe a narrow but explicit strategy.

- The only documented runtime tests are “full installation” tests.
- Supported commands are `npm run test:full`, `npm run test:full:vanilla`, `npm run test:full:forge`, `npm run test:full:fabric`, and `npm run test:full:neoforge`.
- CI is documented as running lint, typecheck, contracts, IPC allowlist checks, and build, but not the full-installation suite.
- Repo instructions say Vitest should be used when adding tests.

## Observed Test and Verification Structure

### 1. Static quality gates

These are real automated guards even though they are not “tests” in the classic unit-test sense.

- `npm run lint` from `package.json` runs `eslint . --max-warnings 0`.
- TypeScript verification runs through `npx tsc -p tsconfig.json --noEmit` in `.github/workflows/ci.yml`.
- `npm run contracts:check` runs `scripts/check-contracts.cjs`, which validates IPC contract documentation against `shared/contracts/ipcChannels.ts`.
- `npm run ipc:check` runs `scripts/check-ipc-handlers.cjs`, which scans Electron code for IPC channels not present in the allowlist.
- CI also runs `npm run build -- --publish never`, which gives a packaging-level smoke check beyond typechecking.

### 2. Full-installation runtime harness

This is the only real end-to-end runtime test system in the repository.

- `scripts/test-full.js` writes a temporary `.test-config.json` file, then starts Vite/Electron in a special test mode.
- `electron/app/bootstrap.ts` looks for `.test-config.json` and diverts startup into `runFullInstallationTest(...)` from `electron/app/fullInstallationTest.ts`.
- The runtime suite delegates to helpers in `electron/app/tests/vanillaInstaller.ts`, `electron/app/tests/modLoaderInstaller.ts`, `electron/app/tests/versionDiscovery.ts`, `electron/app/tests/versionValidator.ts`, `electron/app/tests/testReporter.ts`, and `electron/app/tests/utils.ts`.
- The suite exercises real installation flows for vanilla, Forge, Fabric, and NeoForge, plus version discovery and reporting.
- Results are persisted as logs and JSON summaries under `app.getPath('userData')/logs/full-installation/` by the code in `electron/app/fullInstallationTest.ts` and `electron/app/tests/testReporter.ts`.

### 3. Current test file footprint

Observed practice is much narrower than a typical frontend/Electron repo.

- There are effectively no `*.test.ts`, `*.spec.ts`, or `__tests__/` suites under `src/`, `electron/services/`, or `shared/`.
- The only files that look like a “test tree” are the runtime installers and reporters under `electron/app/tests/`, and those are helpers for the full-installation harness rather than isolated unit tests.
- `package.json` does not currently list `vitest` as a dependency even though project instructions say Vitest should be used for new tests.

## What the Existing Coverage Actually Protects

The current setup is useful for a very specific risk profile.

- It verifies that the launcher can boot into a test mode and drive real installation workflows.
- It covers version discovery, download orchestration, Java/runtime prerequisites, and modloader installation paths tied to `electron/app/fullInstallationTest.ts`.
- It gives confidence that packaging still works, because CI includes a build step in `.github/workflows/ci.yml`.
- It protects contract drift at the string/API registry level through `scripts/check-contracts.cjs` and `scripts/check-ipc-handlers.cjs`.

This means the project is reasonably defended against “can we still install and package the launcher?” regressions.

## What Is Not Covered

Large parts of the repo have no fast, isolated automated coverage.

### Renderer UI and hooks

- No component tests exist for shared UI primitives like `src/components/ui/Button.tsx`, `src/components/ui/Modal.tsx`, or `src/components/ui/ErrorMessage.tsx`.
- No hook tests exist for orchestrators such as `src/features/launcher/hooks/useLauncher.ts`, `src/features/launcher/hooks/useLauncherIPC.ts`, `src/features/multiplayer/hooks/useMultiplayer.ts`, or `src/features/updater/hooks/useAppUpdater.ts`.
- No regression tests exist for context providers like `src/contexts/SettingsContext.tsx` and `src/contexts/ModpackContext.tsx`, even though they hold most application state and persistence behavior.

### Preload and IPC integration

- There are no targeted tests for `electron/preload.ts` or the individual bridge files in `electron/preload/bridges/*`.
- There are no handler-level tests for modules like `electron/ipc/handlers/modpacksHandlers.ts`, `electron/ipc/handlers/accountHandlers.ts`, or `electron/ipc/handlers/windowHandlers.ts`.
- The repo validates channel names, but it does not validate payload shapes or request/response semantics at runtime in automated tests.

### Electron services and persistence

- Core services such as `electron/services/account/accountService.ts`, `electron/services/stats/statisticsService.ts`, `electron/services/sharing/shareService.ts`, and `electron/services/modpacks/modpackService.ts` have no unit-level coverage.
- Filesystem-heavy logic in `electron/services/instances/*`, `electron/services/download/*`, and `electron/services/launcher/*` is mostly protected only indirectly by the full-installation flow.
- Error and recovery behavior is largely untested, especially for malformed JSON, missing files, unavailable preload APIs, and partial install failures.

### Shared types and pure helpers

- Small pure helpers like `src/features/launch/services/launchValidation.ts`, `src/features/launcher/services/launcherService.ts`, `src/contexts/settings/persistence.ts`, and `src/utils/cn.ts` have no direct tests even though they are cheap to cover and easy to regress.
- Shared contracts in `shared/contracts/*` are type-checked, but there is no runtime contract test suite.

## Documented Rules vs Observed Practice

There are several important mismatches.

- The docs say Vitest is the framework to use when adding tests, but `package.json` does not currently install it and the repo contains no Vitest suites.
- The docs present the test strategy as “full installation tests plus CI checks”; observed reality matches that, but it also means there is no middle layer of unit or component tests.
- The docs frame lint/typecheck as routine commands; in practice, the repo quality bar also depends heavily on bespoke structural validators in `scripts/check-contracts.cjs` and `scripts/check-ipc-handlers.cjs`.
- `docs/KNOWN_ISSUES.md` explicitly lists existing ESLint violations, which is effectively acting as a manual debt ledger instead of a fully green automated baseline.

## Risk Profile of the Current Strategy

The current strategy is backend-installation heavy and UI-light.

- It is strong on “does the launcher still install Minecraft and modloaders?”.
- It is weak on “does the renderer still behave correctly after refactors?”.
- It is weak on “do preload, IPC handlers, and renderer wrappers still agree on payload behavior?”.
- It is weak on error handling, fallback paths, and persistence corruption scenarios.
- It provides almost no signal about test coverage because there is no coverage collection or reporting pipeline.

## Highest-Value Coverage Gaps

If the team adds tests incrementally, the most valuable first targets are clear.

### Fast pure-function coverage

These are cheap wins and should use Vitest once added.

- `src/features/launch/services/launchValidation.ts`
- `src/features/launcher/services/launcherService.ts`
- `src/contexts/settings/persistence.ts`
- `src/utils/cn.ts`

### Context and hook behavior

These would catch a large share of renderer regressions.

- `src/contexts/SettingsContext.tsx` for localStorage persistence, theme side effects, and translator switching.
- `src/contexts/ModpackContext.tsx` for bootstrap, selection, and classic-vs-modpack mode behavior.
- `src/features/launcher/hooks/useLauncher.ts` and `src/features/launcher/hooks/useLauncherIPC.ts` for status transitions and subscription cleanup.
- `src/features/multiplayer/hooks/useMultiplayer.ts` for persistence, status text, and room/join behavior around mocked IPC.

### Bridge and IPC contract tests

These are the most important missing integration layer.

- `electron/preload.ts` plus selected bridge files in `electron/preload/bridges/*` should be tested to ensure the exposed API matches `shared/contracts/windowApi.ts`.
- Representative handlers such as `electron/ipc/handlers/modpacksHandlers.ts`, `electron/ipc/handlers/accountHandlers.ts`, and `electron/ipc/handlers/shareHandlers.ts` should be exercised with mocked services.
- Renderer wrappers in `src/services/ipc/*` should be tested for capability detection, fallback behavior, and `toIpcError` normalization.

### Service-level filesystem tests

These matter because the app is stateful and file-driven.

- `electron/services/account/accountService.ts`
- `electron/services/stats/statisticsService.ts`
- `electron/services/sharing/shareService.ts`
- `electron/services/modpacks/modpackService.ts`

These modules are good candidates for temp-directory based integration tests rather than pure mocks.

## Practical Takeaway

FMCL currently relies on three quality layers:

- static correctness checks in `eslint.config.js`, `tsconfig.json`, and CI;
- contract registry checks in `scripts/check-contracts.cjs` and `scripts/check-ipc-handlers.cjs`;
- slow, real-environment installation tests driven by `scripts/test-full.js` and `electron/app/fullInstallationTest.ts`.

What it does not have yet is a fast feedback layer for renderer logic, preload contracts, and service behavior. That missing middle layer is the main testing gap in the repository today.
