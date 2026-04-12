# Phase 3 Research: Modpack Workflow Completion

## What The Planner Needs To Know

Phase 3 is not a greenfield "build modpack browser features" effort. The browser and installed-modpack surfaces already contain partial implementations of the roadmap items, but the current behavior does not yet meet the release bar.

The planner should treat this as a completion and hardening phase with two distinct seams:

1. installed-modpack card actions need to become visible, consistent, and metadata-safe;
2. modpack-browser history and pagination need to preserve browsing context instead of resetting on navigation or install.

The safest phase shape is:

1. establish a real browser-state contract at the router level;
2. surface duplicate and rename from card actions while fixing the backend metadata drift those actions expose;
3. harden browser history and pagination behavior on top of that state contract, including the backend alphabetical-pagination trap.

Do not turn this phase into a launcher-wide state-management rewrite, a new IPC surface, a modpack-browser redesign, or a documentation phase. The release gap is workflow completion inside the current architecture.

## Requirement Fit

This phase directly covers:

- `FLOW-01`: duplicate an instance directly from modpack list cards or card actions;
- `FLOW-02`: rename an instance directly from modpack list cards or card actions;
- `FLOW-03`: view and return to recently viewed modpacks in the browser;
- `FLOW-04`: configure page size and navigate paginated browser results without losing browsing context.

## Current Baseline

### Installed modpack actions already exist, but only partly on the right surface

- The installed-modpack grid lives in `src/components/modpacks/ModpackList.tsx`.
- The visible card buttons currently expose only select, settings, and delete.
- Rename and duplicate already exist in the list, but only via the right-click context menu in `ModpackList.tsx`.
- Duplicate also exists from the details footer in `src/components/modpacks/details/ModpackDetailsActions.tsx`, but rename does not.

This means the codebase is close to satisfying `FLOW-01` and `FLOW-02`, but the shipped interaction still depends on hidden or inconsistent surfaces instead of explicit card actions.

### Duplicate and rename already have working UI handlers

- `handleRename(...)` and `handleDuplicate(...)` in `ModpackList.tsx` already use the shared confirm dialog, toasts, `refresh()`, and a local list reload.
- The existing renderer and IPC stack for these actions is already complete:
  - `useInstanceCrudActions.ts`
  - `src/contexts/instances/services/instancesService.ts`
  - `src/services/ipc/modpacksIPC.ts`
  - `electron/preload/bridges/ModpacksBridge.ts`
  - `electron/ipc/handlers/modpacksHandlers.ts`
  - `electron/services/instances/instanceService.ts`

No new IPC channels are required for Phase 3.

### The real risk is backend metadata drift

Rename and duplicate currently operate in `electron/services/instances/instanceService.ts`, while rich modpack metadata is persisted separately in `electron/services/modpacks/storage.ts` and consumed through `modpackService.ts`.

That split creates two release-visible risks:

- rename can leave `metadata.name` stale after the directory/config rename succeeds;
- duplicate can create a new instance with only minimal metadata, losing description, icon, and source fields.

If Phase 3 exposes rename and duplicate more prominently from the list cards, these inconsistencies become harder for users to ignore. The plan should treat metadata consistency as part of the workflow requirement, not as optional cleanup.

### Browser history and page-size controls already exist, but browsing context does not survive navigation

`src/components/modpacks/ModpackBrowser.tsx` already has:

- recent-history storage in `localStorage` under `modpack-history`;
- favorites storage in `localStorage` under `modpack-favorites`;
- persisted page-size storage in `localStorage` under `modpack-items-per-page`;
- pagination UI and `offset`/`limit` calls through the existing modpacks IPC surface.

So the missing work is not "add history" or "add page size" from scratch. The missing work is making those features behave correctly as part of a browsing session.

### Browser state is local and gets discarded on navigation

- `ModpackBrowser.tsx` owns `platform`, `query`, sort, filters, `currentPage`, `itemsPerPage`, `showHistory`, results, and totals as local component state.
- `useModpackNavigation.ts` stores only `{ type: ... }` view entries and does not preserve browser-state snapshots.
- `ModpackRouter.tsx` fully unmounts `ModpackBrowser` when navigating to install, import preview, or details views.
- `InstallModpackPage.tsx` currently uses `window.location.reload()` after a successful install.

As a result:

- query, filters, current page, current results, and the history-toggle state are lost when leaving and returning to the browser;
- page size, favorites, and viewed-history survive only because they are separately persisted in `localStorage`;
- the current implementation does not satisfy the "without losing browsing context" part of `FLOW-04`.

### Pagination correctness has one backend trap

The renderer already passes `offset` and `limit` through IPC, and handlers validate `limit` up to `200`.

The real correctness gap is in the Modrinth alphabetical-sorting path inside `electron/services/mods/platform/modPlatformService.ts`:

- it fetches only `min(limit * 10, 100)` starting from `offset = 0`;
- sorts that subset client-side;
- then slices for the requested page.

This means later pages and larger page sizes can be incomplete or incorrect once the result set exceeds the sampled subset. That is a true `FLOW-04` risk and should be planned explicitly.

## Brownfield-Safe Sequencing

### 1. Establish browser-state ownership before polishing browser behaviors

The phase needs a durable browser-state contract before it can honestly claim preserved context.

That likely means:

- extending the navigation view model to carry browser-state snapshots; or
- introducing a narrow shared browser-state store consumed by both router and browser.

The goal is not to centralize all modpack state. The goal is only to preserve the active browser session across navigation and install flows.

### 2. Land visible card actions together with metadata-safe backend behavior

It is not enough to add buttons or an overflow menu to the card if rename and duplicate still drift metadata or behave inconsistently across list vs details views.

This slice should:

- surface rename and duplicate from an explicit card action affordance;
- unify the prompt/refresh behavior between list and details where it materially overlaps;
- ensure backend rename and duplicate preserve metadata truth.

### 3. Finish browser history and pagination on top of the new state contract

Once browser state survives navigation, the remaining work can focus on workflow correctness:

- reopening history entries without dropping the current browsing session model;
- keeping page-size and page navigation aligned with the preserved state;
- fixing backend alphabetical pagination so renderer controls are trustworthy.

## Planning Risks

- If the phase only changes card UI and skips metadata synchronization, visible duplicate/rename actions will ship broken or misleading data.
- If the phase only tweaks `localStorage` behavior and leaves browser state local to `ModpackBrowser`, users will still lose context on back-navigation and install return.
- If `InstallModpackPage` keeps `window.location.reload()` as the recovery path, any in-session browser-state work will remain fragile.
- If alphabetical pagination is not fixed in `modPlatformService`, the UI may appear complete while still returning incomplete results on later pages.
- History and favorites are currently keyed only by `projectId`; if dual-provider browsing is re-enabled later, provider collisions become possible. Phase 3 should at least avoid deepening that assumption.

## Recommended Plan Shape

The cleanest Phase 3 decomposition is three plans:

- `03-01`: establish router-owned browser state and remove reload-based browser recovery;
- `03-02`: expose duplicate and rename from card actions and make those actions metadata-safe across renderer and backend flows;
- `03-03`: harden history and pagination behavior on top of the preserved browser-state contract, including the Modrinth alphabetical paging bug.

Recommended wave map:

- Wave 1: `03-01`, `03-02`
- Wave 2: `03-03`

This keeps the browser-state foundation and the installed-card action work independent enough to execute in parallel, while preserving a clear dependency from final pagination/history hardening to the new browser-state seam.

## Validation Architecture

Phase 3 needs mixed validation: targeted automated tests for the new state and service seams, plus renderer-level manual smoke for the user-visible workflows.

### Layer 1: browser-state automation

The new browser-state contract should have automated coverage around:

- navigation history entries that preserve browser state;
- back-navigation from install or details flows into the prior browser state;
- page-size or page changes surviving the route round-trip.

### Layer 2: metadata-safe duplicate and rename automation

The backend rename and duplicate logic should have automated coverage proving:

- duplicate preserves the intended metadata fields;
- rename updates the metadata-facing name;
- no new IPC surface is required to achieve that behavior.

### Layer 3: pagination correctness automation

The mod-platform service should have automated checks around:

- `offset` and `limit` propagation;
- alphabetical pagination behavior beyond the first page;
- stable totals and page calculations for the renderer contract.

### Layer 4: targeted renderer smoke

Manual verification is still required for the end-to-end UX:

- duplicate and rename from an explicit card action;
- return from install/details into the prior browser state;
- history reopening and page-size changes from the shipped browser UI.

These should be short, phase-specific smokes rather than open-ended exploratory QA.

### Layer 5: full release gate

Phase 3 should still close under the existing repo gate:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run contracts:check`
- `npm run ipc:check`
- `npm run build -- --publish never`

Phase 3 does not need new infrastructure. It should reuse the Phase 2 fast test lane and extend it only where the new seams need coverage.
