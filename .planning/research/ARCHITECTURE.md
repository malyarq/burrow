# Architecture Research

**Domain:** FMCL brownfield stabilization and completion
**Researched:** 2026-04-12
**Confidence:** HIGH

## Decision Frame

FMCL is already an Electron monolith with a typed IPC facade:

- Electron main process owns privileged work, persistent state, downloads, launching, accounts, mirrors, statistics, sharing, and modpack storage.
- Preload bridges expose `window.api.*` plus legacy globals.
- The React renderer owns UI state, flows, and settings, mostly through contexts and `src/services/ipc/*`.
- Shared contracts in `shared/contracts/*` already define the safest extension seam.

The remaining work is not a rewrite problem. It is a stabilization problem:

- finish missing UX on top of existing modpack/account/settings flows
- harden IPC and filesystem boundaries
- add test coverage around current service seams
- extend existing persistence for mirrors, stats, caches, and skins
- do accessibility after the UI surface is stable enough to audit once

Low-risk delivery means extending current domains instead of introducing a new architecture style.

## Recommended System Shape

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Renderer (React + Context + feature components)                     │
│                                                                      │
│ Modpack UI  Accounts UI  Settings UI  Accessibility behaviors        │
│ List/Details  Avatars/Skins  Mirrors/Stats/Storage  keyboard/focus   │
└───────────────┬──────────────────────────────────────────────────────┘
                │ use existing wrappers first
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Renderer IPC Wrappers (`src/services/ipc/*`)                         │
│                                                                      │
│ modpacksIPC  accountIPC  mirrorsIPC  statisticsIPC  assets/cache IPC │
└───────────────┬──────────────────────────────────────────────────────┘
                │ typed contract boundary
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Preload + Shared Contracts                                           │
│                                                                      │
│ `electron/preload/bridges/*` + `shared/contracts/*`                  │
│ Preferred namespace: `window.api.*`                                  │
└───────────────┬──────────────────────────────────────────────────────┘
                │ thin invoke/subscribe bridge
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Main Process Handlers                                                │
│                                                                      │
│ Thin adapters + input validation + path/url normalization            │
└───────────────┬──────────────────────────────────────────────────────┘
                │ delegate only
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Main Process Domain Services                                         │
│                                                                      │
│ LauncherManager + RuntimeDownloadService + DownloadManager           │
│ ModpackService + InstanceService + ContentManager                    │
│ AccountService (+ skin helpers)                                      │
│ MirrorsService (+ provider ordering/fallback)                        │
│ StatisticsService (+ aggregation/export)                             │
└───────────────┬──────────────────────────────────────────────────────┘
                │ owns persistence
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Filesystem / Electron userData                                       │
│                                                                      │
│ modpack configs/index/metadata, content-store, download-cache.json,  │
│ accounts.json + account asset cache, mirrors.json, statistics.json   │
└──────────────────────────────────────────────────────────────────────┘
```

## Guardrails For Remaining Work

1. Keep privileged logic in the main process.
2. Add or extend shared IPC contracts before adding renderer behavior.
3. Use `src/services/ipc/*` wrappers for new renderer calls. Do not add fresh direct `window.*` usage.
4. Prefer extending existing services over adding sibling systems:
   - `ModpackService` for modpack UX/data gaps
   - `AccountService` for skins/account assets
   - `MirrorsService` and provider/scoring code for fallback/priority
   - `StatisticsService` for aggregates/export
   - download/content stack for cache and remote asset storage
5. Do validation at the handler/service edge, not only in React forms.
6. Do not attempt a full Electron sandbox migration in this milestone. `sandbox: false` is currently part of the runtime shape, and changing it is higher risk than the requested hardening pass.

## Component Boundaries For Remaining Work

| Workstream | Renderer owner | Contract / wrapper | Main-process owner | Persistence / notes |
|---|---|---|---|---|
| Instance rename / duplicate from list | `src/components/modpacks/ModpackList.tsx`, `ModpackContext` | existing `modpacksIPC.rename/duplicate` | existing `ModpackService` / `InstanceService` | UI-only completion; replace `window.prompt` with app modal, no new backend |
| Modpack version history | modpack details/update UI | extend `shared/contracts/modpacks.ts` | extend `ModpackService` metadata storage | store in existing modpack metadata, not a new database |
| Configurable pagination in browsers | modpack browser pages/hooks | existing search APIs already carry `offset/limit/total` | existing marketplace search methods | renderer state first; keep API shape aligned with current contracts |
| Image disk cache | `LazyImage` consumers use wrapper-returned URLs | extend `assets` or `cache` contract, keep `cache` admin actions separate | add remote image cache helper near download/content stack | disk-backed cache under `userData`; renderer should not own network fetch policy |
| Cache controls / size / cleanup | storage/settings tabs | extend `cacheIPC` for stats/settings/clear | cache service + existing `ContentManager` / `ETagCache` | keep clear operations centralized in main process |
| Skins / avatar management | accounts page/dialogs | extend account contracts first | `AccountService` with small skin helper module | keep account selection and skin management in one domain; avoid separate “profile service” |
| Mirror fallback / priority | mirrors settings | extend mirrors contract with priority/fallback config | `MirrorsService` + provider ordering + runtime download service | reuse current provider/scoring stack instead of adding download logic to UI |
| Statistics / charts / export | statistics tab and dashboard widgets | extend statistics contract | `StatisticsService` | derive aggregates on read; export should serialize current JSON state, not add telemetry infra |
| Accessibility | shared UI primitives, layouts, feature pages | no new privileged contract except persisted prefs | mostly renderer-only | reduced-motion / contrast prefs can remain in renderer settings unless launcher runtime needs them |
| Security hardening | form validation and safe rendering | shared contracts + handler validators | handlers + services + window config | authoritative checks stay in main process |
| Tests | renderer unit tests + hook tests | wrapper mocks at service edge | service tests around real temp dirs and pure helpers | start from service seams already present; do not lead with end-to-end UI tests |

## Recommended Extension Structure

This is an extension map, not a refactor plan:

```text
electron/
├── ipc/
│   ├── handlers/              # extend current handlers, keep thin
│   └── validators/            # new: shared IPC input/path/url validation helpers
├── services/
│   ├── account/
│   │   ├── accountService.ts
│   │   └── skins/             # optional helper folder, only if skin logic grows
│   ├── cache/                 # new: remote image/cache helpers if needed
│   ├── content/
│   ├── download/
│   ├── mirrors/
│   ├── modpacks/
│   └── stats/
src/
├── components/ui/             # accessibility-first primitives, dialogs, focus states
├── components/modpacks/       # finish list/details UX on existing flows
├── features/accounts/         # accounts + skin management UI
├── features/settings/
│   ├── mirrors/
│   ├── statistics/
│   ├── accessibility/         # optional, only if settings page grows
│   └── storage/
└── services/ipc/              # preferred renderer entrypoint for all privileged work
shared/
├── contracts/                 # extend first
└── types/                     # widen only where persisted/domain data changes
```

## Data Flow Recommendations

### 1. Missing launcher UX on existing modpacks

```text
User action in ModpackList / Details
  ↓
ModpackContext action or page-local hook
  ↓
`modpacksIPC`
  ↓
preload bridge + `shared/contracts/modpacks.ts`
  ↓
`modpacksHandlers`
  ↓
`ModpackService` / `InstanceService`
  ↓
config/index/metadata files
  ↓
updated list/config returned to renderer
```

Recommended rule:

- if the operation already exists in `ModpackContext` or `modpacksIPC`, finish the UI around it before touching main-process architecture
- modpack history should be treated as metadata enrichment on the same storage path already used by `ModpackService`

### 2. Remote image caching

```text
Renderer requests preview/icon URL
  ↓
assets/cache wrapper resolves cached local URL
  ↓
IPC handler validates remote URL and cache key
  ↓
main-process cache helper downloads or reuses disk copy
  ↓
ETag/download/content helpers manage freshness and storage
  ↓
renderer receives local/file URL or safe app-managed path
```

Recommended rule:

- keep caching policy in the main process
- do not let `LazyImage` become a second downloader/cache manager
- keep cache admin actions (`clear`, `size`, `cleanup`) separate from asset lookup calls

### 3. Skins and account assets

```text
Accounts UI / skin upload or refresh
  ↓
account wrapper + contract
  ↓
account handler validates account id, file path, mime/extension
  ↓
`AccountService`
  ↓
skin helper downloads/copies asset into account-owned cache
  ↓
`accounts.json` metadata + account asset directory
  ↓
avatar/skin descriptor returned to UI
```

Recommended rule:

- keep skins inside the account domain because account selection/auth/session state already lives there
- only extract a helper module if file handling grows; do not create a top-level service unless reuse actually appears

### 4. Mirrors, fallback, and priority

```text
Mirrors settings UI
  ↓
mirrors wrapper + contract
  ↓
`MirrorsService` state mutation
  ↓
provider selection / ordered candidates
  ↓
`RuntimeDownloadService` and `DownloadManager`
  ↓
mirror scoring success/failure feedback
  ↓
updated rankings and persisted settings
```

Recommended rule:

- UI should edit preference state only
- fallback and priority behavior belongs in provider ordering and download candidate selection
- current `providers.ts`, `scoring.ts`, and `RuntimeDownloadService` are already the correct seam

### 5. Statistics and export

```text
Launch session / dashboard request / export action
  ↓
`LauncherManager` records usage
  ↓
`StatisticsService`
  ↓
statistics.json
  ↓
derived aggregates / export serializer
  ↓
statistics wrapper + UI
```

Recommended rule:

- keep raw event persistence simple
- add aggregation and export as read-side behavior inside `StatisticsService`
- do not introduce telemetry infrastructure or a background analytics pipeline for this milestone

### 6. Accessibility and reduced motion

```text
Settings preference or keyboard interaction
  ↓
renderer settings/context
  ↓
shared UI primitives and page components
  ↓
focus handling, ARIA, labels, contrast, motion toggles
```

Recommended rule:

- accessibility is mostly a renderer concern
- start at shared primitives and list/dialog/navigation patterns
- do page-level audits after feature flows stop moving

### 7. Security hardening

```text
Renderer input
  ↓
UI validation for fast feedback
  ↓
shared contract typing
  ↓
IPC handler validation and normalization
  ↓
service-level filesystem/network guards
  ↓
persist / launch / download
```

Recommended rule:

- renderer validation is helpful UX, not a trust boundary
- normalize paths, URLs, ids, and output destinations in main-process handlers or shared validator helpers
- keep BrowserWindow posture strict; avoid expanding web capabilities during this milestone

## Brownfield Build Order

### Stage 1: Stabilize the edges first

Goals:

- remove current lint/runtime hazards from known issues
- stop adding new direct `window.*`, `prompt`, and browser `confirm` usage
- add handler-side validation helpers for ids, file paths, URLs, and optional output locations
- establish test scaffolding at the service/wrapper level

Why first:

- this reduces regression risk for every later change
- it prevents new UX work from deepening existing architectural drift
- it gives the team a safe baseline before touching caches, skins, or mirrors

### Stage 2: Finish low-risk UX already backed by existing services

Do next:

- rename and duplicate from list cards using existing modpack actions
- configurable pagination in search/browse flows using current offset/limit contract fields
- replace temporary browser dialogs with existing app modal/confirm patterns

Why second:

- these are mostly renderer changes over stable operations
- they deliver visible product value without expanding persistence or security surface area much

### Stage 3: Extend existing persisted domains

Do next:

- modpack version history in metadata
- statistics aggregation/export in `StatisticsService`
- mirror priority/fallback in `MirrorsService` + provider ordering
- skin management in `AccountService`
- disk-backed image cache beside download/content services

Why third:

- these changes widen contracts and storage formats
- doing them after baseline hardening makes contract evolution safer
- they are easier to test once service-level scaffolding exists

### Stage 4: Accessibility pass on stabilized UI

Do next:

- focus order, keyboard navigation, ARIA, labels, contrast, reduced-motion support
- start from shared UI primitives and then audit pages

Why fourth:

- accessibility on moving UI is expensive rework
- shared primitive fixes become cheaper after list/dialog/settings flows settle

### Stage 5: Final hardening and documentation sync

Do last:

- security review of all new/changed handlers and file flows
- contract map update
- EN/RU roadmap sync
- release gate checks and smoke verification

Why last:

- documentation should describe the final contract shape, not intermediate states
- final security review is more effective after all new handlers and flows exist

## Testing Architecture For This Milestone

### Priority test seams

1. Main-process services with temp directories:
   - `ModpackService`
   - `InstanceService`
   - `ContentManager`
   - `ShareService`
   - `StatisticsService`
   - `MirrorsService`
2. Pure helper modules:
   - mirror scoring/order
   - path/url validators
   - formatting and metadata helpers
3. Renderer wrappers and hooks:
   - `src/services/ipc/*`
   - context hooks that coordinate selection/config flows
4. Existing install smoke harness remains useful for launcher/runtime coverage, but it should not be the first test layer added for stabilization work.

### Practical test split

- service tests prove persistence and side effects
- renderer tests prove state orchestration and accessibility behavior
- smoke/full-install tests prove launcher runtime paths

This is the fastest path to confidence without building a new end-to-end stack first.

## Anti-Patterns To Avoid

### 1. Building new renderer-side mini backends

What it looks like:

- fetching/caching remote images directly in React
- storing mirror or stats business state in local component trees
- treating browser dialogs as permanent workflow UI

Do this instead:

- keep business rules and persistence in main-process services
- use IPC wrappers for renderer access

### 2. Fixing security only in forms

What it looks like:

- validating names, URLs, or file paths only in React inputs

Do this instead:

- duplicate critical validation in the IPC handler/service boundary

### 3. Creating parallel state stores

What it looks like:

- adding a new global state system just for remaining launcher UX

Do this instead:

- extend `ModpackContext`, settings context, and focused hooks already in use

### 4. Large brownfield refactors during stabilization

What it looks like:

- renaming `instances`/`modpacks` everywhere
- removing legacy globals in one pass
- switching Electron security model wholesale

Do this instead:

- tolerate transitional naming
- put new code on the preferred path (`window.api.*` through wrappers)
- keep compatibility shims until after release stabilization

## Architecture Recommendation

For the remaining FMCL work, the safest architecture is:

- preserve the current Electron main + preload + React renderer split
- extend shared IPC contracts first, wrappers second, handlers third, services last
- keep new persistence inside the domains that already own it
- use the existing download/content stack as the foundation for cache and mirror behavior
- keep skins inside the account domain and statistics inside the statistics domain
- treat accessibility as a renderer-wide quality pass, not a new subsystem

This approach is intentionally conservative. It optimizes for shipping a stable release from the current codebase, not for achieving a cleaner theoretical architecture.

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STACK.md`
- `docs/ru/roadmap.md`
- `docs/KNOWN_ISSUES.md`
- Current extension points in:
  - `electron/ipc/ipcManager.ts`
  - `electron/preload.ts`
  - `electron/services/modpacks/modpackService.ts`
  - `electron/services/content/contentManager.ts`
  - `electron/services/mirrors/*`
  - `electron/services/stats/statisticsService.ts`
  - `electron/services/account/accountService.ts`
  - `src/contexts/ModpackContext.tsx`
  - `src/services/ipc/*`

---
*Architecture research for FMCL stabilization milestone*
