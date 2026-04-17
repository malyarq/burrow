# Phase 18 Verification

Completed: `2026-04-17`

## Closeout Result

Phase 18 closed on an explicit proof chain:

- focused automated regression coverage for the milestone-owned launch, detail, catalog or compact-nav, and settings or locale seams
- browser-backed evidence for `manual-verification.html?view=dashboard`, `manual-verification.html?view=modpack-details`, and `manual-verification.html?view=phase-17-polish`
- release-facing and planning-facing docs refreshed to match the recorded `v0.4.0` proof set
- a green packaging-aware repo gate after bounded release-metadata cleanup in `package.json`

## Automated Gate

Passed on the final state:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`

Observed build output on the final rerun:

- Vite client build succeeded
- Electron main and preload builds succeeded
- `electron-builder` packaging succeeded and produced the DMG artifact under `release/0.3.0/`
- the previous `package.json` warnings for missing `description` and `author` were removed by adding bounded release metadata

## Manual Evidence

Three browser-proof routes were captured through an isolated local CDP Chromium session:

| View | Screenshot | DOM | Proof |
| --- | --- | --- | --- |
| `dashboard` | `/tmp/fmcl-phase18-dashboard-cdp.png` | `/tmp/fmcl-phase18-dashboard-cdp.html` | `verification-status` reports `ready: true` with fallback art, truthful loader summary, localized launch feedback, and read-only busy-state settings |
| `modpack-details` | `/tmp/fmcl-phase18-modpack-details-cdp.png` | `/tmp/fmcl-phase18-modpack-details-cdp.html` | `verification-status` reports `ready: true` with dense navigation plus runtime-provided and incompatible dependency truth |
| `phase-17-polish` | `/tmp/fmcl-phase18-phase17-polish-cdp.png` | `/tmp/fmcl-phase18-phase17-polish-cdp.html` | `verification-status` reports `ready: true` with constrained catalog cards, launcher-mark fallback art, compact-nav active state, and Russian preset naming |

Explicit negative proof:

- `if rg -n 'launcherSettings\\.|settings\\.tabs\\.|appearance\\.presets\\.' /tmp/fmcl-phase18-phase17-polish-cdp.html; then exit 1; else echo 'no raw settings keys found'; fi`
- Result: `no raw settings keys found`

## Docs Truth

Release-facing and planning-facing truth now aligns with the recorded proof:

- `README.md` describes the current `v0.4.0` release candidate and the three verification views instead of the older `v0.3.0` walkthrough
- `docs/en/roadmap.md` and `docs/ru/roadmap.md` show Phases 16 and 17 as complete and narrow the remaining work to the final closeout gate
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, and `.planning/STATE.md` reflect `15/16` plans complete before the final gate and resolve the active milestone metadata for `gsd-tools init milestone-op`

## Residual Warnings

One non-blocking warning remains intentionally carried:

- Vite still reports that the main renderer chunk exceeds `500 kB` after minification. This phase did not reopen performance scope or chunking strategy because the build remained green and the warning is not a closure blocker for `v0.4.0`.

## Supporting Commits

- `0acc0ea` — align the `v0.4.0` closeout matrix
- `7494ac6` — verify the authoritative `v0.4.0` suite
- `fa5d3e9` — stabilize manual proof capture
- `0da4f5f` — refresh `v0.4.0` release truth
