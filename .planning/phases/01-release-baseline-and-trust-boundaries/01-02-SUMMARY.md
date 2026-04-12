---
phase: 01-release-baseline-and-trust-boundaries
plan: "02"
subsystem: api
tags: [electron, ipc, contracts, modpacks, worlds]
requires: []
provides:
  - one canonical modpacks export/import/info handler path
  - truthful worlds contract and wrapper semantics for folder opening
affects: [phase-1, ipc, modpacks, worlds, boundary-hardening]
tech-stack:
  added: []
  patterns:
    - shared root-path resolution helper inside handler registration
    - contract and wrapper behavior aligned before deeper security work
key-files:
  created: []
  modified:
    - electron/ipc/handlers/modpacksHandlers.ts
    - shared/contracts/index.ts
    - shared/contracts/worlds.ts
    - src/services/ipc/worldsIPC.ts
key-decisions:
  - "Kept the existing modpacks channel names and removed duplicate handler registrations instead of renaming the surface."
  - "Changed the worlds contract to model folder opening as a Promise-returning side effect instead of a fake string return."
patterns-established:
  - "Path-root fallback is centralized inside handlers instead of repeated inline."
  - "Shared contracts must describe the renderer-visible behavior, not backend implementation details."
requirements-completed: [SEC-01]
duration: unknown
completed: 2026-04-12
---

# Phase 1 Plan 02 Summary

**Modpack handler duplication removed and the worlds IPC contract now matches the real folder-opening behavior**

## Performance

- **Duration:** unknown
- **Started:** 2026-04-12
- **Completed:** 2026-04-12
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Removed the duplicated `modpacks:export`, `modpacks:getModpackInfoFromFile`, and `modpacks:import` handler registrations so later validation lands on one real execution path.
- Centralized default root-path resolution in `registerModpacksHandlers` to reduce drift between channels.
- Replaced the misleading `getWorldPath(): string` contract with `openFolder(): Promise<void>` and aligned the wrapper/helper with the actual backend behavior.

## Task Commits

1. **Tasks 1-2: Modpacks handler canonicalization and worlds contract seam correction** - `2ae4bb7` (`fix(01-02): clean modpack and world seams`)

## Files Created/Modified

- `electron/ipc/handlers/modpacksHandlers.ts` - canonical modpack export/import/info handlers and shared root-path helper
- `shared/contracts/index.ts` - re-export of worlds contract types
- `shared/contracts/worlds.ts` - truthful folder-open API contract
- `src/services/ipc/worldsIPC.ts` - wrapper aligned to `openFolder()` semantics

## Decisions Made

- Preserved the existing user-facing channel intent and compatibility while removing duplicate handler definitions.
- Left the broader IPC allowlist and contracts-map cleanup to later phase work because the current script failures are repo-wide, not introduced by this slice.

## Deviations from Plan

### Auto-fixed Issues

**1. Local seam verification had to be separated from repo-wide IPC/doc gates**
- **Found during:** Task 2 verification
- **Issue:** `npm run ipc:check` and `npm run contracts:check` fail on many pre-existing allowlist/docs mismatches outside the `01-02` write set, so the plan's global verification commands were not isolating this seam work.
- **Fix:** Verified the touched handler/contract/wrapper files with local lint and `npx tsc --noEmit`, and recorded the broader repo-wide gate failures as a carried phase concern rather than attributing them to `01-02`.
- **Files modified:** none beyond the planned seam files
- **Verification:** `npx eslint electron/ipc/handlers/modpacksHandlers.ts shared/contracts/worlds.ts src/services/ipc/worldsIPC.ts && npx tsc --noEmit`
- **Committed in:** `2ae4bb7`

---

**Total deviations:** 1 auto-fixed
**Impact on plan:** The code seam is complete and locally verified, but the phase still has broader IPC/docs gate work to close before final release verification can pass.

## Issues Encountered

- `npm run ipc:check` currently reports many unrelated channels missing from the allowlist.
- `npm run contracts:check` currently reports many existing channels missing from `docs/ru/contracts-map.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 2 can now add ingress validation on top of a single modpacks handler path.
- Later IPC/docs hardening should absorb the repo-wide allowlist and contracts-map drift surfaced during this verification.

---
*Phase: 01-release-baseline-and-trust-boundaries*
*Completed: 2026-04-12*
