# Phase 4 Research: Delivery, Cache, Accounts, And Stats Hardening

## What The Planner Needs To Know

Phase 4 is not a greenfield "add cache, skins, mirrors, and analytics" phase. FMCL already has partial implementations in all four domains, but each domain currently stops short of the release-ready behavior promised by the roadmap.

The planner should treat this as a focused completion and hardening phase with four distinct seams:

1. remote icon loading needs a real disk-backed image cache and user-visible cache management controls;
2. third-party accounts need provider-aware skin management rather than generic Yggdrasil login only;
3. mirror settings need to move from single-selection and speed tests to explicit priority and fallback behavior that is actually used by runtime downloads;
4. launcher statistics need to grow from raw counters into derived views, trends, and export without introducing a backend analytics system.

The safest phase shape is:

1. build an image-cache foundation on top of the existing cache and content-store patterns;
2. extend the account domain for supported custom-skin providers without broadening auth scope;
3. thread mirror priority and fallback through the downloader in the same slice as corruption rejection;
4. expand the local statistics model and IPC surface into a richer but still local-only statistics experience;
5. close the phase under the repo-wide release gate after all four seams land.

Do not turn this phase into a launcher-wide asset rewrite, a new telemetry backend, a generalized auth-platform rewrite, or a CDN abstraction reset. The gap is release completion inside the current Electron and React architecture.

## Requirement Fit

This phase directly covers:

- `FLOW-05`: modpack and mod imagery loads from a persistent disk cache with size management and cleanup controls;
- `ACCT-01`: supported custom accounts can manage skins from within the launcher;
- `DLVR-01`: users can configure mirror priority or preference order;
- `DLVR-02`: launcher falls back to healthy mirrors automatically;
- `DLVR-03`: corrupted or incomplete downloads are rejected instead of accepted as successful;
- `STAT-01`: users can view popular modpacks and usage trends;
- `STAT-02`: users can export local statistics data.

## Current Baseline

### Remote imagery exists, but only as renderer-side URLs and lazy loading

- `src/components/ui/LazyImage.tsx` provides Intersection Observer or native lazy loading plus fallback images.
- Many core surfaces still render remote `iconUrl` values directly or through `LazyImage`, including:
  - `src/components/modpacks/ModpackList.tsx`
  - `src/components/modpacks/ModpackBrowser.tsx`
  - `src/components/modpacks/AddModPage.tsx`
  - `src/components/modpacks/AddModModal.tsx`
  - `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- None of these flows persist remote images to disk. They rely on browser session caching at best and lose the asset once the session or cache is cleared.

### The existing cache surface is too narrow for Phase 4

- `shared/contracts/cache.ts` only exposes `clear()` and `reload()`.
- `electron/ipc/handlers/cacheHandlers.ts` currently deletes `download-cache.json` and clears Electron session cache, but it does not expose image-cache stats, size limits, cleanup, or per-cache-type management.
- `src/components/settings/tabs/LauncherTab.tsx` already has a "clear cache" button, so Phase 4 should extend an existing settings surface rather than inventing a new cache area from scratch.

### There is already a durable content-addressed store, but it is for mod files, not remote icons

- `electron/services/content/contentManager.ts` already provides:
  - content-addressed storage;
  - filesystem-level deduplication;
  - store statistics;
  - cleanup of unused content.
- `ModpackService` already uses this store for mod downloads and links cached content into instances.

This is an important brownfield clue: FMCL already knows how to maintain a local disk cache with stats and cleanup. Phase 4 should likely reuse the same design principles for images instead of adding an unrelated ad hoc cache.

### Third-party accounts exist only at the authentication layer

- `electron/services/account/accountService.ts` supports:
  - offline accounts;
  - generic third-party Yggdrasil accounts via auth server URL.
- `electron/services/account/yggdrasil.ts` only exposes authenticate, refresh, and validate.
- `shared/contracts/account.ts` and `src/services/ipc/accountIPC.ts` only expose account CRUD and selection flows.
- `src/features/accounts/AddAccountDialog.tsx` asks for auth server URL, username, and password, and `src/features/accounts/AccountsPage.tsx` only lists or selects accounts.

There is no current support for:

- Blessing Skin or LittleSkin provider detection;
- skin preview loading;
- skin upload, selection, or removal;
- typed IPC methods for account skin operations;
- renderer components dedicated to skin management.

The current account model does already have useful extension seams:

- `shared/types/account.ts` includes `avatar?: string`;
- third-party accounts already persist `authServerUrl`, tokens, and user info;
- trust-boundary work from Phase 1 already validates third-party auth endpoints.

### Mirror support exists, but it stops at single selection or auto-select

- `electron/services/mirrors/mirrorsService.ts` persists:
  - the mirror list;
  - a single `selectedMirrorId`;
  - `autoSelect`.
- `src/features/settings/mirrors/MirrorsSettings.tsx` already supports:
  - custom mirrors;
  - speed testing;
  - manual selection;
  - auto-select toggle.
- `shared/types/mirrors.ts` and `shared/contracts/mirrors.ts` do not model priority order or fallback chains.

This means the user-facing mirror UX is already close, but it does not yet satisfy `DLVR-01` because there is no explicit preference order beyond "selected" or "auto".

### Runtime downloads already contain the seeds of fallback and corruption rejection

- `electron/services/mirrors/providers.ts` already emits candidate URL lists, especially for `auto` provider and BMCL-related fallbacks.
- `electron/services/mirrors/scoring.ts` records observed success, failure, and latency scores by origin.
- `electron/services/runtime/downloadService.ts` already:
  - builds candidate lists from the active provider;
  - blacklists bad origins;
  - filters candidates through the bad-host set;
  - warms up auto mirrors and scores them.
- `electron/services/download/downloadManager.ts` already:
  - iterates candidate URLs;
  - rejects HTML challenge pages;
  - rejects empty or size-mismatched files;
  - validates zip integrity where applicable;
  - deletes corrupted files;
  - reports mirror success or failure.

So `DLVR-02` and `DLVR-03` are partly present today, but in a scattered way:

- fallback behavior is implicit in candidate arrays and host blacklisting, not explicitly driven by mirror preferences;
- corruption rejection exists in the downloader, but it is not surfaced as a first-class Phase 4 behavior with targeted tests against the mirror flow.

The missing work is not inventing fallback logic from zero. It is making the persisted mirror model and the runtime downloader agree on ordered priority and healthy fallback behavior.

### Statistics already exist, but only as counters

- `electron/services/stats/statisticsService.ts` persists a local `statistics.json` with:
  - global total play time and launches;
  - per-instance play time, launches, and last-played time.
- `electron/services/launcher/orchestrator.ts` records launch count and play time.
- `electron/ipc/handlers/statisticsHandlers.ts` only exposes `stats:get`.
- `shared/contracts/statistics.ts` only exposes `getStats()`.
- `src/features/settings/statistics/StatisticsTab.tsx` shows:
  - total play time;
  - total launches;
  - a simple per-instance list.

There is no current support for:

- derived "popular modpacks" ranking beyond raw instance launches;
- usage graphs or time-series-friendly data;
- export of local statistics;
- typed renderer IPC wrapper for statistics;
- any richer visualization than summary cards and flat lists.

Phase 4 should build on the existing local `statistics.json` model instead of introducing telemetry, remote sync, or an analytics backend.

## Brownfield-Safe Sequencing

### 1. Build cache management first, then route the main icon surfaces through it

The image-cache requirement needs a durable backend contract before the renderer starts assuming cached image URLs exist.

That likely means:

- a dedicated Electron-side image-cache service under `userData`;
- an expanded cache IPC contract for stats, limit settings, and cleanup;
- a thin renderer-side cached-image seam layered under `LazyImage` or alongside it.

The goal is not to cache every image in the launcher. The goal is to cover the release-critical modpack and mod icon surfaces with persistent disk caching and user controls.

### 2. Keep skin management as a provider-aware extension of third-party accounts

The account domain already supports generic Yggdrasil authentication. Phase 4 should extend that model with provider-aware skin operations for supported services rather than broadening into:

- Mojang or Microsoft auth changes;
- a generic plugin marketplace for skin providers;
- broad user-profile editing unrelated to skins.

Blessing Skin and LittleSkin are the concrete scope anchors from the roadmap. The planner should treat anything beyond those as future extensibility, not Phase 4 scope.

### 3. Extend mirror state and runtime downloader in the same slice

It is not enough to add priority controls to `MirrorsSettings` if runtime downloads still behave as before.

The phase slice needs:

- persisted mirror order or preference;
- candidate generation that respects that order;
- fallback semantics that skip bad or failing hosts;
- corruption rejection that never promotes a bad response to success.

Mirror configuration and runtime fallback should land together so the shipped UI does not lie about download behavior.

### 4. Expand statistics as a local derived-data product, not a telemetry system

FMCL already writes local stats. Phase 4 should keep that local-first model and add:

- derived rankings;
- lightweight trend data;
- export;
- richer settings UI presentation.

The planner should avoid introducing:

- background upload;
- remote dashboards;
- heavy charting dependencies unless they materially reduce complexity.

Simple SVG, CSS, or lightweight renderer logic is more brownfield-safe than a big visualization stack.

## Planning Risks

- If image caching is implemented only in the renderer or only via session cache, `FLOW-05` will still fail the "persistent disk cache" requirement.
- If cache management only exposes a destructive clear button, the launcher will miss the "size management and cleanup controls" part of `FLOW-05`.
- If skin support stays generic and never recognizes Blessing Skin or LittleSkin semantics, `ACCT-01` will remain vague and unshippable.
- If skin management is tied to a wide auth rewrite, the phase will bloat far beyond the release-hardening milestone.
- If mirror priority is stored in settings but not threaded into `RuntimeDownloadService` and `DownloadManager`, `DLVR-01` and `DLVR-02` will ship as cosmetic settings.
- If corrupted downloads are only tested indirectly, regressions in checksum, size, or zip rejection can silently re-open `DLVR-03`.
- If statistics UI is expanded without first extending the underlying statistics model and IPC, the renderer will end up deriving unstable logic from an underpowered API.
- If statistics visualization pulls in a heavy charting framework, the phase may introduce bundle or maintenance cost disproportionate to the feature.

## Recommended Plan Shape

The cleanest Phase 4 decomposition is five plans:

- `04-01`: establish persistent image-cache infrastructure and route core modpack/mod icon surfaces through it with visible cache controls;
- `04-02`: extend third-party accounts with provider-aware skin management for Blessing Skin and LittleSkin;
- `04-03`: promote mirrors from selected-or-auto state to explicit priority plus runtime fallback behavior, with corrupted-download protection verified in the same slice;
- `04-04`: expand local statistics into popular-modpack, trend, and export flows with typed IPC and richer settings UI;
- `04-05`: close the phase under the full repo-wide gate and fix any integration fallout across cache, accounts, mirrors, and statistics.

Recommended wave map:

- Wave 1: `04-01`, `04-02`
- Wave 2: `04-03`, `04-04`
- Wave 3: `04-05`

This keeps the four feature seams independently executable while preserving a dedicated final slice for the phase-wide gate.

## Validation Architecture

Phase 4 needs mixed validation: targeted automated tests for each service seam, plus short manual checks for provider-specific or real-network behavior.

### Layer 1: image-cache automation

The cache slice should have automated checks around:

- image cache keying and on-disk persistence;
- size accounting and cleanup;
- renderer cached-image behavior for primary and fallback sources.

### Layer 2: account skin-provider automation

The account slice should have automated checks around:

- provider detection and request formatting for Blessing Skin and LittleSkin;
- persistence of skin-related account metadata;
- renderer state for preview/update/remove flows.

### Layer 3: mirror and downloader automation

The delivery slice should have automated checks around:

- mirror ordering and fallback candidate generation;
- bad-host tracking and retry behavior;
- corruption rejection for checksum, size mismatch, empty files, or invalid archives.

### Layer 4: statistics automation

The statistics slice should have automated checks around:

- derived ranking or trend data;
- export payload shape and serialization;
- renderer presentation of new statistics sections.

### Layer 5: targeted manual smoke

Manual verification is still needed for:

- cached icons surviving restart and cleanup controls behaving sensibly;
- Blessing Skin or LittleSkin flows against a real or realistic provider endpoint;
- mirror priority and fallback under live or forced-bad mirror conditions;
- statistics export UX and graph readability.

### Layer 6: full release gate

Phase 4 should still close under the existing repo gate:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run contracts:check`
- `npm run ipc:check`
- `npm run build -- --publish never`

Phase 4 does not need new test infrastructure. It should extend the Phase 2 Vitest lane with focused service and jsdom renderer tests only where the new seams demand it.
