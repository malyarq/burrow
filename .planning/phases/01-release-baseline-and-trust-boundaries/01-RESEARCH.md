# Phase 1 Research: Release Baseline And Trust Boundaries

## What The Planner Needs To Know

Phase 1 is two kinds of release work in one:

- REL-01 and REL-02 are already-failing baseline issues in active renderer flows.
- SEC-01, SEC-02, and SEC-03 require tightening Electron trust boundaries that currently accept unsafe paths, archive entries, URLs, and external navigation too early.

This should be planned as a brownfield hardening phase, not as a feature phase. The safest path is:

1. make the release baseline deterministic again;
2. remove IPC/contract ambiguity that would make hardening error-prone;
3. add reusable validation at the main-process edge and service containment points;
4. finish with security verification and release-gate checks.

Do not turn this phase into an architecture rewrite, a test-infrastructure phase, or a broad async I/O refactor. The codebase is already transitional; the plan should prefer additive guardrails and local cleanup over sweeping rewrites.

## Requirement Fit

This phase directly covers:

- `REL-01`: background, accounts, share, and storage flows stop regressing through hook ordering, stale effect, and cascading re-render problems.
- `REL-02`: release gates are clean enough to ship.
- `SEC-01`: privileged IPC handlers reject malformed and unsafe payloads before work starts.
- `SEC-02`: file and archive operations stay within allowed roots.
- `SEC-03`: renderer/window security posture is tightened around preload exposure and external URLs.

## Current Failure Hotspots

### Renderer reliability and lint blockers

- `src/components/layout/BackgroundLayer.tsx` has a conditional `useMemo` after an early return. This matches the known `react-hooks/rules-of-hooks` failure and is a real runtime hazard.
- `src/features/accounts/AccountsPage.tsx` calls `loadAccounts()` from `useEffect` before the `const loadAccounts = ...` declaration. That is not just a style issue; it is a runtime `ReferenceError` hazard.
- `src/features/share/ShareModal.tsx` performs synchronous `setState` transitions inside `useEffect`, which is already listed in `docs/KNOWN_ISSUES.md` and is likely to keep failing lint because `package.json` uses `--max-warnings 0`.
- `src/components/settings/tabs/StorageTab.tsx` creates `loadStats` inline and omits it from the effect dependency list.
- `src/features/accounts/AddAccountDialog.tsx` is adjacent to the account flow and already contains `any` plus no meaningful validation for third-party URLs, so it is a likely collateral fix while stabilizing the accounts path.
- Browser-native `confirm`, `prompt`, and `window.location.reload()` are still common in nearby flows. The phase context explicitly prefers in-app recovery UX when work touches these areas.

### Quality-gate reality

- `docs/KNOWN_ISSUES.md` says TypeScript passed at the last audit, but frontend lint still had two errors plus warnings.
- `eslint.config.js` sets several important rules to `warn`, but `package.json` runs `eslint . --max-warnings 0`, so warnings are still ship blockers.
- CI runs `npm ci`, `npm run lint`, `npx tsc -p tsconfig.json --noEmit`, `npm run contracts:check`, `npm run ipc:check`, and `npm run build -- --publish never`.
- In the current workspace, `node_modules` is absent, so `npx tsc --noEmit` and `npx eslint ...` cannot be re-run locally until dependencies are installed. That is an environment prerequisite for planning verification, not a phase deliverable.

### Main-process trust-boundary gaps

- `electron/ipc/handlers/modpacksHandlers.ts` is large, duplicate-heavy, and order-dependent. It registers `modpacks:export` three times and duplicates `modpacks:getModpackInfoFromFile` and `modpacks:import`. Hardening this file before deduplication would be fragile.
- The same handler file accepts renderer-supplied `rootPath`, `filePath`, `updates`, and other inputs with almost no ingress validation.
- `electron/services/instances/paths.ts` and downstream services derive filesystem paths with plain `path.join(...)`.
- `electron/services/modpacks/importers/localInstaller.ts` uses `zip.extractAllTo(targetDir, true)` for generic ZIPs and writes manifest paths and override entries directly.
- `electron/services/instances/importer/InstanceImporterService.ts` writes MultiMC archive entries directly under the instance directory using `path.join(instanceDir, relPath)`.
- `electron/services/modpacks/modpackService.ts` already has one good pattern in `updateModpackOverrides(...)`: normalize, reject traversal, then write. That pattern is not reused elsewhere.
- `electron/ipc/handlers/settingsHandlers.ts` accepts arbitrary `targetPath` and passes it to `shell.openPath(...)`.
- `electron/ipc/handlers/worldsHandlers.ts`, `resourcePacksHandlers.ts`, `shadersHandlers.ts`, and `screenshotsHandlers.ts` all trust renderer-supplied instance paths and child names broadly.
- `electron/services/worlds/worldService.ts`, `resourcePacks/resourcePackService.ts`, and `shaders/shaderService.ts` perform deletes/copies/opens using those joined paths with no shared containment layer.
- `electron/services/sharing/shareService.ts` will `gunzipSync` any provided base64 payload and only fails after decompression/parsing, so malformed or oversized share codes are not rejected early.

### External trust and preload exposure

- `electron/window/windowManager.ts` uses `contextIsolation: true` and disables `nodeIntegration`, which is good, but both windows still run with `sandbox: false`.
- `windowManager.ts` sends every popup or unexpected navigation URL directly to `shell.openExternal(url)` without domain trust classification.
- `electron/preload.ts` exposes both the preferred `window.api` namespace and many legacy globals such as `window.launcher`, `window.modpacks`, `window.account`, `window.share`, and `window.ipcRenderer`.
- `electron/preload/bridges/IpcRendererBridge.ts` intentionally exposes a generic raw IPC bridge to the renderer, gated only by allowlisted channel names.
- UI code still relies on direct external anchors in `src/components/modpacks/details/ModsTab.tsx` and `ModpackDetailsModsTab.tsx`, which means unfamiliar external URLs currently bypass any FMCL-specific confirmation UX.

### Contract and boundary drift

- `shared/contracts/worlds.ts` says `getWorldPath(...)` returns a `string`.
- `src/services/ipc/worldsIPC.ts` actually invokes `worlds:openFolder` and returns `''`.
- `src/vite-env.d.ts` types `window.api`, `window.account`, and other globals, but preload exposure and renderer usage are still partly split between wrappers, direct globals, and raw IPC usage.
- The renderer convention says UI should prefer `src/services/ipc/*`, but accounts and mirrors still call `window.account` and `window.api.mirrors` directly.

## Brownfield-Safe Planning Implications

- Keep existing IPC channel names unless a mismatch is already objectively broken. Channel churn creates unnecessary docs and renderer fallout.
- Prefer adding a shared validation layer over rewriting service ownership or moving logic across processes.
- Use renderer-side validation only for UX. Trust decisions must still happen in main.
- Tighten the narrowest boundary that exists today. For example, improve handler ingress checks and path containment before attempting broader platform rewrites.
- If stricter rules disable existing saved accounts or mirrors, do it explicitly and visibly. The phase context already prefers safer-by-default behavior over silent grandfathering.
- Avoid mixing unrelated cleanup into security slices. This codebase has enough historical drift that large mixed changes will be hard to verify.

## Recommended Sequencing Inside The Phase

### 1. Re-establish a runnable release baseline first

Start with the known renderer hotspots and the commands needed to prove `REL-01` and `REL-02`.

- Make sure the workspace can actually run the quality gates (`npm ci` prerequisite in local dev, already present in CI).
- Capture the true lint/type baseline before security edits.
- Fix the four named REL-01 hotspots first:
  - `BackgroundLayer.tsx`
  - `AccountsPage.tsx`
  - `ShareModal.tsx`
  - `StorageTab.tsx`
- Pull adjacent account/share UI cleanup into the same slice only when it directly affects those flows, especially `AddAccountDialog.tsx`.

Why first: security work will touch Electron and preload, but the phase still needs a stable renderer baseline and clean release gates. Starting in main-process hardening while the frontend is already failing will make regression cause harder to isolate.

### 2. Remove boundary ambiguity before adding validators

Deduplicate the modpacks IPC surface and fix contract mismatches before building hardening logic around them.

- Collapse duplicate registrations in `electron/ipc/handlers/modpacksHandlers.ts`.
- Fix objectively wrong contract/wrapper seams, especially the worlds mismatch.
- Align preload exposure, ambient typings, and renderer wrappers where the current surface is misleading.

Why second: validator work added to duplicated or drifting boundaries will be easy to wire incorrectly. The planner should treat “make the active boundary unambiguous” as a prerequisite for SEC-01.

### 3. Introduce a shared validation layer for privileged ingress

Add one reusable validation seam in main process, then roll it through the high-risk handlers.

Recommended first-wave handler coverage:

- `electron/ipc/handlers/modpacksHandlers.ts`
- `electron/ipc/handlers/settingsHandlers.ts`
- `electron/ipc/handlers/accountHandlers.ts`
- `electron/ipc/handlers/mirrorsHandlers.ts`
- `electron/ipc/handlers/shareHandlers.ts`
- `electron/ipc/handlers/worldsHandlers.ts`
- `electron/ipc/handlers/resourcePacksHandlers.ts`
- `electron/ipc/handlers/shadersHandlers.ts`
- `electron/ipc/handlers/screenshotsHandlers.ts`

Why third: this is the core SEC-01 deliverable. The plan should assume that new validators will accept `unknown` or raw inputs, normalize them, and reject unsafe values before calling service methods.

### 4. Add service-level containment for filesystem and archive work

Once handlers reject bad payloads, harden the actual write/delete/copy seams so a missed handler check still cannot escape the intended root.

Priority service coverage:

- `electron/services/instances/paths.ts`
- `electron/services/modpacks/importers/localInstaller.ts`
- `electron/services/instances/importer/InstanceImporterService.ts`
- `electron/services/modpacks/modpackService.ts`
- `electron/services/worlds/worldService.ts`
- `electron/services/resourcePacks/resourcePackService.ts`
- `electron/services/shaders/shaderService.ts`

Why fourth: SEC-02 cannot rely on handler checks alone. Archive traversal, child-path traversal, and arbitrary instance/root paths need service-level containment before filesystem mutation.

### 5. Harden external navigation and preload/window posture

After ingress and filesystem containment are in place, tighten the user-facing trust boundaries around URLs and renderer capabilities.

- Review `electron/window/windowManager.ts` popup/navigation behavior.
- Decide how unfamiliar URLs should be confirmed:
  - explicit renderer-driven external-link action; or
  - main-process/native confirmation as a fallback.
- Review whether `sandbox: true` is realistic in this codebase without destabilizing the app.
- Reduce or at least stop expanding the legacy preload/global surface.

Why fifth: this is still Phase 1 scope, but it is the most compatibility-sensitive part of SEC-03. Planning it after the earlier layers keeps the risk localized.

### 6. Finish with verification, not more refactoring

Close the phase by proving the release baseline and the new trust boundaries, not by continuing cleanup indefinitely.

- Re-run `npx tsc --noEmit`.
- Re-run `npx eslint src/`.
- Because this phase touches Electron, also expect `npx eslint electron/` and `npm run lint` to matter in practice even if only `REL-02` names the frontend command.
- Re-run `npm run contracts:check` and `npm run ipc:check` if preload/contracts/handlers move.
- Do targeted manual smoke runs for the repaired REL-01 flows and for unsafe-input rejection cases.

## Validation Architecture

Plan Phase 1 around a multi-layer validation model. One layer is not enough in this codebase.

### Layer 1: renderer UX validation

Purpose: give immediate inline feedback and keep the user in a recoverable state.

- Empty or obviously malformed account URLs should fail in `AddAccountDialog.tsx`.
- Empty or malformed mirror URLs should fail in `MirrorsSettings.tsx`.
- Share-code input should reject blank input and surface a useful recovery message.
- Browser-native confirm/prompt flows touched during this phase should prefer the existing `ConfirmContext`/`ConfirmDialog` pattern over ad hoc browser dialogs.

This layer improves UX only. It must not be the trust boundary.

### Layer 2: IPC ingress validation in main

Purpose: satisfy `SEC-01`.

Each privileged handler should validate and normalize payloads before calling services:

- string presence and max length
- known enum values
- object shape for `unknown` payloads
- URL scheme and host policy
- path-like inputs, including optional `rootPath`, `instancePath`, and child names
- share-code version/encoding sanity before decompression

Recommended pattern: central helper module(s) under Electron main code, for example an `electron/ipc/validation/` or `electron/security/` area, so handlers can share the same rules.

### Layer 3: canonical path and URL capability helpers

Purpose: make path and URL checks consistent across handlers and services.

The planner should assume dedicated helpers for:

- resolving canonical root paths
- checking that a target stays inside an allowed base directory
- validating relative child names (`folderName`, `fileName`, override paths, archive entry paths)
- classifying endpoint URLs:
  - remote URLs should be HTTPS-only
  - local override exceptions may allow `http://localhost`, `127.0.0.1`, or `[::1]`
  - reject `javascript:`, `data:`, `file:`, and unknown schemes
- classifying external browser URLs:
  - trusted known domains can open directly
  - unfamiliar domains should confirm or reject before delegating to the OS

Important gotcha: string-prefix checks are not enough on their own. Planning should account for normalization and, where applicable, canonical/real-path checks so Windows separators, absolute paths, and symlink tricks do not bypass containment.

### Layer 4: service invariants before mutation

Purpose: satisfy `SEC-02` even if a handler misses something.

Before delete/copy/write/open operations, the target service should still assert:

- destination is inside the allowed root
- archive entry extraction path is still inside the target directory
- file name arguments are relative names, not paths escaping the content folder
- shell-open targets are from approved directories only

`modpackService.updateModpackOverrides(...)` is the best existing local pattern. The planner should treat it as the seed for a shared invariant, not as an isolated one-off.

### Layer 5: verification harness

Purpose: prove the new boundaries work without expanding Phase 1 into Phase 2.

Use a validation matrix rather than broad test infrastructure:

- `tsc`, frontend lint, Electron lint if touched
- contract scripts for preload/IPC consistency
- manual abuse cases for:
  - `../` and absolute-path archive entries
  - bad `rootPath` / `instancePath`
  - unsafe `targetPath` for `shell.openPath`
  - unsafe account and mirror URLs
  - malformed or oversized share codes
  - unexpected external URLs from renderer links

Optional but reasonable: small focused tests for pure validator helpers if they can be added cheaply without derailing the phase. Do not let this grow into a full test-program effort; Phase 2 owns that broader safety net.

## Concrete Files And Seams To Touch

These are the most likely planning anchors.

### Release-baseline seams

- `src/components/layout/BackgroundLayer.tsx`
- `src/features/accounts/AccountsPage.tsx`
- `src/features/accounts/AddAccountDialog.tsx`
- `src/features/share/ShareModal.tsx`
- `src/features/share/ImportShareModal.tsx`
- `src/components/settings/tabs/StorageTab.tsx`
- `src/contexts/ConfirmContext.tsx` and `src/components/ui/ConfirmDialog.tsx` as existing UI confirmation primitives

### Renderer IPC boundary seams

- `src/services/ipc/worldsIPC.ts`
- any new or cleaned wrappers for accounts, mirrors, or share if the phase moves those flows off direct `window.*`
- `src/vite-env.d.ts`

### Shared contract seams

- `shared/contracts/windowApi.ts`
- `shared/contracts/modpacks.ts`
- `shared/contracts/worlds.ts`
- `shared/contracts/account.ts`
- `shared/contracts/mirrors.ts`
- `shared/contracts/share.ts`

### Preload seams

- `electron/preload.ts`
- `electron/preload/bridges/IpcRendererBridge.ts`
- `electron/preload/bridges/ModpacksBridge.ts`
- `electron/preload/bridges/AccountBridge.ts`
- `electron/preload/bridges/MirrorsBridge.ts`
- `electron/preload/bridges/ShareBridge.ts`

### Main-process validation and handler seams

- `electron/ipc/ipcManager.ts`
- `electron/ipc/handlers/modpacksHandlers.ts`
- `electron/ipc/handlers/settingsHandlers.ts`
- `electron/ipc/handlers/accountHandlers.ts`
- `electron/ipc/handlers/mirrorsHandlers.ts`
- `electron/ipc/handlers/shareHandlers.ts`
- `electron/ipc/handlers/worldsHandlers.ts`
- `electron/ipc/handlers/resourcePacksHandlers.ts`
- `electron/ipc/handlers/shadersHandlers.ts`
- `electron/ipc/handlers/screenshotsHandlers.ts`

### Filesystem and import containment seams

- `electron/services/instances/paths.ts`
- `electron/services/modpacks/importers/localInstaller.ts`
- `electron/services/instances/importer/InstanceImporterService.ts`
- `electron/services/modpacks/modpackService.ts`
- `electron/services/worlds/worldService.ts`
- `electron/services/resourcePacks/resourcePackService.ts`
- `electron/services/shaders/shaderService.ts`

### URL trust and account/mirror seams

- `electron/window/windowManager.ts`
- `electron/services/account/accountService.ts`
- `electron/services/account/yggdrasil.ts`
- `electron/services/mirrors/mirrorsService.ts`
- `src/components/modpacks/details/ModsTab.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`

### Documentation and structural verification seams

- `docs/en/contracts-map.md`
- `docs/ru/contracts-map.md`
- `scripts/check-contracts.cjs`
- `scripts/check-ipc-handlers.cjs`

Docs only need updating if IPC/preload surface or channel behavior changes. The planner should avoid unnecessary contract churn.

## Risks And Gotchas

- `modpacksHandlers.ts` has duplicate registrations. Plan for a cleanup pass before trusting any line-by-line hardening in that file.
- `rootPath` is deeply embedded in contracts, preload, and renderer wrappers. Removing it outright is broader than this phase; validating and constraining it is the brownfield-safe move.
- `instancePath` and child-name validation have the same problem in worlds/resource packs/shaders/screenshots. If the phase introduces a shared validator, the planner should budget for applying it consistently rather than only in one domain.
- `shell.openPath(...)` and `shell.openExternal(...)` are privilege boundaries. Treat them like filesystem/network operations, not UI conveniences.
- `sandbox: true` may be desirable, but flipping it late in the phase without a compatibility plan could destabilize the launcher. This should be a deliberate decision point, not an incidental cleanup.
- Existing saved custom auth servers or mirrors may become invalid under the new trust policy. The phase context already prefers disabling unsafe configurations over grandfathering them, so planner slices should include visible recovery UX.
- `package.json` does not currently include `vitest`, and local validation in this workspace is blocked until `npm ci`. Do not assume tests or lint can be run from a cold checkout without install.
- CI lint is broader than the phase requirement wording. Even if `REL-02` names `npx eslint src/`, Electron hardening changes still need to keep repo-wide lint green enough for CI.
- `scripts/check-contracts.cjs` and `scripts/check-ipc-handlers.cjs` only validate channel registration and docs consistency. They do not validate payload semantics or security posture, so they are necessary but insufficient.
- Many main-process services use synchronous filesystem and ZIP work. Avoid turning this phase into a large async/performance rewrite unless a touched security fix forces a local change.

## Suggested Phase Slice Shape

If the phase is split into plans, the lowest-risk shape is:

1. Renderer release-baseline fixes and clean frontend quality gates.
2. IPC/preload/contract cleanup for ambiguous or duplicated boundaries.
3. Shared validator layer plus handler ingress hardening.
4. Filesystem/archive containment plus URL trust/external navigation hardening.
5. Final verification and any docs/contract map updates required by the actual boundary changes.

That ordering matches the real failure graph in the codebase and keeps the most compatibility-sensitive security work from being mixed with already-broken renderer behavior.
