# Phase 2 Research: Automated Release Verification

## What The Planner Needs To Know

Phase 2 is not a general "add testing everywhere" initiative. It is a brownfield safety-net phase with two narrow outcomes:

- `TEST-01`: maintainers can run `npm test` locally and in CI.
- `TEST-02`: regressions in `modpackService`, `contentManager`, `shareService`, and formatting helpers fail that automated suite before release.

The safest path is:

1. install a minimal Vitest foundation that fits the current Vite + Electron + TypeScript setup;
2. cover the cheapest pure and low-dependency targets first;
3. add temp-directory and mocked-integration tests for the two filesystem-heavy services;
4. wire `npm test` into CI without disturbing the existing full-install harness.

Do not turn this phase into coverage-reporting work, Playwright setup, renderer-component test migration, or a rewrite of Electron services for dependency injection purity. The app needs a fast release gate, not a new testing architecture.

## Requirement Fit

This phase directly covers:

- `TEST-01`: `package.json` gains a stable `test` script and CI runs it.
- `TEST-02`: automated tests cover the release-critical code paths named in the roadmap and user request.

## Current Baseline

### There is no fast unit-test runner yet

- `package.json` has `test:full` scripts only; there is no `test` script.
- `vitest`, `jsdom`, and `@testing-library/react` are not installed.
- CI runs `npm ci`, `npm run lint`, `npx tsc -p tsconfig.json --noEmit`, `npm run contracts:check`, `npm run ipc:check`, and `npm run build -- --publish never`, but no fast automated test suite.
- Docs already say Vitest should be used when adding tests, so the new framework choice is aligned with repo instructions rather than introducing a new convention.

### The repo already has a slow runtime harness

- `scripts/test-full.js` and `electron/app/fullInstallationTest.ts` drive the existing installation smoke tests.
- These should remain separate from the new `npm test` gate.
- Phase 2 should not rename or replace the full-install scripts; it should add a fast middle layer that complements them.

### Tooling constraints matter

- The project is ESM (`"type": "module"`) and uses Vite with a manual `@shared` alias in `vite.config.ts`.
- TypeScript is `strict`, so test helpers need typed mocks rather than `any` sprawl.
- Electron-facing services import Node and Electron modules directly. Tests will need `vi.mock('electron', ...)` and temp-directory fixtures rather than browser-style mounting.
- Renderer-oriented libraries can still be installed in Wave 0, but most Phase 2 targets should run in a Node environment, not `jsdom`.

## Target-Specific Planning Notes

### `src/utils/format.ts`

This is the cheapest win and should be covered first.

- `formatSize(...)` has clear boundary cases: `undefined`, `0`, small bytes, unit transitions, and large values.
- `formatDate(...)` needs deterministic assertions; use a fixed timestamp and stub locale-sensitive formatting only if necessary.
- These tests should prove the Vitest foundation works before moving into filesystem-heavy services.

### `electron/services/sharing/shareService.ts`

This service is highly testable with targeted stubbing.

- `generateShareCode(...)` only needs a stubbed `modpackService` and a temp `instance-manifest.json`.
- `resolveShareCode(...)` is pure after base64 input is provided and is ideal for malformed-input coverage.
- Highest-value assertions:
  - generated code round-trips back into a usable manifest;
  - invalid prefixes, corrupted base64, bad gzip payloads, and unsupported versions fail with the public error message;
  - modloader metadata is preserved across encode/decode.

The current class instantiates `InstanceManifestManager` internally, so tests should prefer real temp files over invasive refactors unless a seam is already needed for reliability.

### `electron/services/content/contentManager.ts`

This is a good temp-directory integration target.

- Use real files under a temporary root.
- Cover hash calculation, import behavior, deduplication, link-or-copy behavior, stats, and cleanup.
- Avoid brittle assertions on exact inode behavior except where the implementation explicitly depends on `nlink`; CI runs on Ubuntu, but tests should still assert outcomes more than platform details.

This plan should keep tests inside the service boundary rather than mocking `fs`.

### `electron/services/modpacks/modpackService.ts`

This is the highest-risk and highest-complexity target in the phase.

- The file is large and mixes metadata, backup, manifest imports, content-store integration, and download orchestration.
- Brownfield-safe coverage should focus on release-relevant seams rather than trying to cover every method.
- Best initial candidates:
  - `updateModpackOverrides(...)` for override writing and manifest mutation;
  - `createFromManifest(...)` for manifest-driven local modpack creation;
  - `getContentStats()` / `cleanupContent()` passthrough behavior when `contentManager` is present or absent;
  - selected `installModsFromManifest(...)` branches using mocked platform clients, mocked `downloadQueue`, and mocked `DownloadManager`.

Important constraint: `modpackService.ts` imports Electron `app`, the global `downloadQueue`, and static download helpers. Tests should mock those seams explicitly rather than trying to instantiate the full app runtime.

## Brownfield-Safe Sequencing

### 1. Add the test foundation first

The first executable slice should install and wire:

- `vitest`
- `@testing-library/react`
- `jsdom`
- optional matcher/setup support if needed by the chosen test layout

It should also add:

- `npm test`
- `vitest.config.ts`
- test setup file(s)
- CI invocation of `npm test`
- release-workflow coverage if the repo publishes without first running the fast test lane

This slice satisfies the infrastructure side of `TEST-01` and gives later plans a stable command surface.

### 2. Add deterministic module coverage in one slice

After the harness exists, the next coverage slice should target:

- `src/utils/format.ts`
- `electron/services/sharing/shareService.ts`
- `electron/services/content/contentManager.ts`

Why first:

- they are fast;
- they cover malformed-input and round-trip behavior directly mentioned in the roadmap;
- they validate the Node-based Vitest setup before the heaviest service coverage begins.

`contentManager` is filesystem-heavy, but it is still deterministic enough to live in the same slice as long as it uses temp directories and avoids broad helper churn.

### 3. Finish with focused `modpackService` coverage

This should come after the simpler coverage slice.

- It is the largest target.
- It will likely need the most mocking and fixture helpers.
- It should reuse the stable Vitest foundation from Wave 0 and any shared temp-fixture helpers created earlier, but it should not depend on broad refactors.

## Planning Risks

- If Wave 0 tries to solve Node tests, jsdom tests, coverage thresholds, and reporter polish all at once, it will become a stalled setup project.
- If `modpackService` coverage is defined too broadly, execution will either expand into refactoring or land shallow tests with little value.
- Locale-sensitive date formatting can make pure helper tests flaky if assertions are too specific.
- File-link behavior can differ across environments; assertions should focus on externally observable behavior unless the implementation contract explicitly depends on inode counts.

## Recommended Plan Shape

The cleanest Phase 2 decomposition is three plans:

- `02-01`: Vitest foundation, `npm test`, CI or release-lane wiring, and the minimal smoke proof that the fast lane actually runs.
- `02-02`: deterministic coverage for formatting helpers, `shareService`, and `contentManager`.
- `02-03`: focused `modpackService` manifest/content/download-path coverage.

Recommended wave map:

- Wave 1: `02-01`
- Wave 2: `02-02`, `02-03`

This keeps setup isolated, minimizes planning overhead, and reserves the heaviest service for the final slice without turning the phase into a many-plan test migration.

## Validation Architecture

Phase 2 should use an automated-validation-first model. Manual verification should be minimal because the phase goal is to create a repeatable release gate.

### Layer 1: framework and command validation

Wave 0 must prove:

- `npm test` exists and runs non-interactively;
- Vitest resolves the repo's TypeScript and `@shared` alias setup;
- CI executes the same command instead of a separate one-off script.

### Layer 2: fast pure-function sampling

Every execution wave after setup should include fast, deterministic tests for:

- formatting helpers;
- share-code encode/decode logic;
- malformed input paths that fail before touching the filesystem.

These should be the quickest feedback path in the phase.

### Layer 3: temp-directory filesystem sampling

Service tests for `contentManager` and selected `modpackService` methods should use temporary directories and real files.

This is the right middle ground:

- more realistic than mocking `fs`;
- much faster and more local than Electron runtime tests;
- sufficient for file-write, cleanup, and deduplication regressions.

### Layer 4: mocked service-orchestration sampling

Where the code touches static collaborators, tests should mock only the outer seam:

- `electron.app.getPath(...)`
- `downloadQueue.add(...)`
- `DownloadManager.downloadSingle(...)`
- platform-service clients used by `modpackService`

Do not pull real network or Electron runtime into the suite.

### Layer 5: phase-close gate

Before Phase 2 is considered complete, the repo should prove:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

CI should run the same `npm test` command so the release gate is identical locally and remotely.
