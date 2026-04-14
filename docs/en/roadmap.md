# FriendLauncher Roadmap

## Current Milestone

- Milestone: `v0.4.0`
- Theme: Launcher Truth And Product Polish
- Status: active, with Phase 15 complete
- Last updated: `2026-04-14`

## Why This Milestone Exists

FMCL already ships broad launcher coverage, but the screenshot-backed audit from `2026-04-14` exposed a smaller class of trust defects that still mattered in everyday use: contradictory launch states, stale loader summaries, broken-looking fallback art, raw localization keys, and a few remaining dense-surface navigation gaps. The `v0.4.0` milestone closes those defects without reopening the architecture or inventing new launcher scope.

## Verified Surface So Far

The active browser-backed walkthrough for this milestone currently covers the classic launch dashboard through `manual-verification.html?view=dashboard` and verifies:

- branded fallback art on the classic hero when pack artwork is missing
- truthful loader summary on the active launch configuration
- localized waiting, downloading, and failure feedback on the launch surface
- visible read-only advanced settings while launch work is in flight

## Phase Status

| Phase | Status | Outcome |
|-------|--------|---------|
| 15. Launch Truth And Shared Surface Contracts | Complete | Branded fallback art, truthful loader summary, synchronized launch stages, localized runtime copy, and read-only busy-state settings |
| 16. Modpack Detail Integrity And Discoverable Dense Navigation | Planned | Dependency truth, readable requirement copy, and dense-screen detail navigation |
| 17. Catalog, Compact Nav, And Settings Localization Polish | Planned | Catalog legibility, fallback imagery, compact-nav truth, and remaining locale cleanup |
| 18. Verification And Release Truth | Planned | Focused automation, full walkthrough evidence, release docs, and final milestone gates |

## What `v0.4.0` Delivers So Far

- Launch progress no longer falls back to misleading `0%` states when progress is still indeterminate
- Classic launch feedback now stays aligned across CTA, status card, and runtime stage transitions
- Missing hero art resolves to an intentional FMCL fallback instead of a broken image treatment
- Advanced launch settings stay visible for reference while becoming read-only during active launch work
- Runtime settings and launch-adjacent controls now respect the active launcher language on the audited classic surface

## Next Candidates

These are the next likely milestone-owned follow-ups after Phase 15:

- truthful dependency satisfaction and clearer requirement copy on modpack details
- denser detail navigation that stays discoverable without default horizontal-tab friction
- catalog polish for fallback imagery, compact navigation truth, and settings-localization stragglers
- final milestone-wide walkthrough evidence, docs refresh, and packaging-aware release gates
