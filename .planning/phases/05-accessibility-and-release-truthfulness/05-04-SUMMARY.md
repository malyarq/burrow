---
phase: 05-accessibility-and-release-truthfulness
plan: "04"
subsystem: release-documentation
tags: [docs, roadmap, contracts, readme, release]
requires:
  - phase: 05-accessibility-and-release-truthfulness
    provides: stabilized accessibility and release-critical UI behavior
provides:
  - README feature lists that match the shipped launcher surface
  - EN and RU roadmaps synced to completed release work and remaining accessibility gaps
  - EN and RU contract maps aligned with the live preload surface and IPC allowlist
affects: [readme, roadmap, contracts-map]
tech-stack:
  added: []
  patterns: [docs-from-live-codebase, ipc-allowlist snapshot, bilingual release parity]
key-files:
  created: []
  modified:
    - README.md
    - docs/en/roadmap.md
    - docs/ru/roadmap.md
    - docs/en/contracts-map.md
    - docs/ru/contracts-map.md
key-decisions:
  - "Rewrote the contract maps around the actual preload surface and IPC allowlist instead of trying to incrementally patch stale descriptions."
  - "Marked roadmap items complete only where the current codebase already ships the behavior, leaving broader accessibility and custom-skin goals explicitly open."
patterns-established:
  - "Release docs should be refreshed from `electron/preload.ts`, `shared/contracts/ipcChannels.ts`, and renderer wrappers in the same wave that changes the public surface."
  - "EN and RU roadmap checkboxes should move together so release status remains bilingual and trustworthy."
requirements-completed: [DOC-01, DOC-02]
duration: 10min
completed: 2026-04-12
---

# Phase 5: Accessibility And Release Truthfulness Summary

**Documentation parity and contract-map refresh for the shipped release**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-12T19:19:56Z
- **Completed:** 2026-04-12T19:29:36Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Refreshed README feature summaries in both languages so the public project description now matches the shipped launcher domains: modpack workflows, content management, accounts and skins, mirrors, statistics, and testing.
- Synchronized EN and RU roadmap checkboxes against implemented work, especially around image caching, themes and background controls, mirror fallback and priority, provider-aware skin management handoff, local statistics, and the current accessibility baseline.
- Rebuilt both contract maps around the live preload surface, renderer wrappers, and IPC allowlist so the docs now reflect `window.api.statistics`, the legacy `window.screenshots` bridge, and the full release-channel snapshot.

## Task Commits

1. **Task 1:** `0dcf4ba` (`docs(05-04): refresh release docs and contract maps`)
2. **Task 2:** `0dcf4ba` (`docs(05-04): refresh release docs and contract maps`)

## Files Created/Modified

- `README.md` - refreshed EN and RU feature and setup sections for the shipped release surface
- `docs/en/roadmap.md` - synced completed roadmap items and remaining accessibility gaps to the live codebase
- `docs/ru/roadmap.md` - synced RU roadmap checkboxes with shipped work and explicit remaining scope
- `docs/en/contracts-map.md` - rewrote the English contracts map around the current preload and IPC surface
- `docs/ru/contracts-map.md` - rewrote the Russian contracts map around the current preload and IPC surface

## Decisions Made

- Treated `electron/preload.ts`, `shared/contracts/ipcChannels.ts`, and `src/services/ipc/*` as the truth sources for the contract-map rewrite instead of preserving older narrative structure.
- Kept roadmap subitems intentionally partial where the release only ships a narrower slice, especially for accessibility completion and custom skin uploads.

## Deviations from Plan

None.

## Issues Encountered

- The previous contract-map docs had drifted enough that incremental fixes would have been harder to audit than a full rewrite.
- The English roadmap lagged the Russian roadmap on several already-shipped Phase 4 and Phase 5 items, so both documents were updated together to restore parity.

## User Setup Required

None.

## Next Phase Readiness

- `05-05` can now run the full repo-wide release gate against both the accessibility work and the refreshed public artifacts.
- Any remaining fallout in the final wave should be limited to gate failures directly caused by the current phase scope.

---
*Phase: 05-accessibility-and-release-truthfulness*
*Completed: 2026-04-12*
