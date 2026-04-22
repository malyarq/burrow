---
status: investigating
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Modpack content tabs and their search/filter bars should share one coherent layout contract instead of mismatched widths, narrow empty states, and column-broken search surfaces."
created: 2026-04-22T00:00:00Z
updated: 2026-04-22T19:27:00Z
---

## Current Focus

hypothesis: Confirm whether the secondary modpack content area lacks a real shared layout/search-state contract and instead mounts independently styled tab/search surfaces.
test: Compare the route host, installed tabs, add/search pages, and degraded-state wrapper for divergent width and control-row composition.
expecting: A missing shared workspace primitive will show up as direct mounting of unrelated components plus per-screen grid/flex layouts and capped empty-state cards.
next_action: Report the confirmed root cause back into the Phase 36 gap.

## Symptoms

expected: Modpack content tabs and their search/filter bars share one coherent layout contract, with search on one row and filters on a second row, and empty states matching installed-content width.
actual: Worlds, screenshots, shaders, resource packs, and mods look inconsistent, empty states are too narrow, and search/filter surfaces break into awkward columns.
errors: none
reproduction: Open a modpack and switch across Worlds, Screenshots, Shaders, Resource Packs, and Mods; compare empty states and search/filter layout at desktop width.
started: Reported during Phase 36 UAT on 2026-04-22.

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:19:00Z
  checked: src/components/modpacks/ModpackDetails.tsx
  found: The `modpack-details-content-host` only switches between `space-y-4` and `surface-panel`, then mounts `ModpackDetailsModsTab`, `ResourcePacksTab`, `ShadersTab`, `WorldsTab`, and `ScreenshotsTab` directly with no shared secondary-content workspace or shared search/filter wrapper.
  implication: Each tab owns its own layout contract, so alignment and width can drift by component instead of being enforced by the route.

- timestamp: 2026-04-22T19:22:00Z
  checked: src/components/modpacks/details/ModpackDetailsModsTab.tsx, src/components/modpacks/details/WorldDatapacksModal.tsx, src/components/modpacks/AddModPage.tsx, src/components/modpacks/ModpackCatalogControls.tsx
  found: Search/filter UI is hand-built three different ways: mods uses `lg:grid-cols-[1fr_15rem]`, world datapacks uses `lg:grid-cols-[1fr_15rem_auto]`, and AddModPage hard-caps the body at `max-w-4xl` with filters on one row and search on a separate row; meanwhile the only reusable controls contract (`ModpackCatalogControls`) is used by the main browser/list screens, not these modpack content flows.
  implication: The “one search row + one filter row” contract was never centralized for secondary content, so the search surfaces break into inconsistent columns and orderings.

- timestamp: 2026-04-22T19:25:00Z
  checked: src/components/layout/DegradedStateView.tsx plus tabs that call it
  found: `DegradedStateView` defaults to centered card layout with `max-w-2xl`, and modpack secondary tabs/add pages call it without `layout=\"inline\"`, including worlds, screenshots, shaders, resource packs, datapack search, and AddModPage.
  implication: Empty, zero-results, and degraded states collapse to a much narrower card than the surrounding content workspace, producing the visibly narrow empty-state panels reported in UAT.

## Resolution

root_cause: The modpack secondary-content area never received a shared workspace/search-state layout primitive. `ModpackDetails` mounts unrelated tab components directly, those components hand-roll different grid/flex search surfaces, and they all fall back to a generic `DegradedStateView` card capped at `max-w-2xl`. That combination creates the mismatched widths, narrow empty states, and column-broken search/filter layouts seen across worlds, screenshots, shaders, resource packs, mods, and world datapack search.
fix:
verification:
files_changed: []
