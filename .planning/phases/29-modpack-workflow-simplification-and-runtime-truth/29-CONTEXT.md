# Phase 29: Modpack Workflow Simplification And Runtime Truth - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 29 simplifies the current modpack browse, detail, dependency, loader, version, and add-or-create seams so they read as one coherent workflow with one authoritative runtime summary. It fixes composition, density, truthfulness, and async-action stability inside the existing modpack product surface. It does not add new content-browser capabilities, marketplace expansion, new modpack-management concepts, or resource-pack or shader browsing beyond what Phase 31 already owns.

</domain>

<decisions>
## Implementation Decisions

### Catalog controls and card density
- Installed modpacks and remote browser results should converge on one compact horizontal search-and-filter composition instead of multiple stacked summary and control blocks.
- Search is the primary control in that composition; Minecraft version, loader, and sort stay in the same row family, and reset should live beside the active controls instead of in a separate summary strip.
- Browser-specific extras such as import, history, provider status, and pagination may remain surface-specific, but they should wrap around the same shared controls shell rather than introducing a second visual system.
- Remove loud top-of-list summary panels such as `Modpacks`, `Active`, and `Results` as standalone weighty blocks; only lightweight inline feedback should remain where it directly helps scanning.
- Modpack cards should show only the minimum high-value summary needed before opening details: Minecraft version and updated timestamp. Other technical or descriptive detail belongs in details view.
- Toolbar and top-of-list actions such as `Import code`, `Create`, and `Modpack browser` must share one geometry language for height, padding, icon size, and border treatment.

### Detail layout and tab reachability
- Modpack details should let the user switch tabs and start reading tab content without first scrolling past an oversized action or summary block.
- Play remains the route-primary action on details. Update review and extra actions stay secondary and compact so they do not compete with tab access or content.
- Tab discoverability matters more than decorative summary weight. The tabs row should be visually obvious and kept close to the top content seam.
- Content tabs such as `Mods`, `Resource Packs`, `Shaders`, `Worlds`, and `Screenshots` should move toward one shared density and container language instead of feeling like unrelated screens.

### Authoritative runtime and dependency truth
- Phase 29 should establish one authoritative modpack runtime-summary source with clear precedence: effective installed config first, then persisted metadata only as fallback when config truth is unavailable.
- User-facing list, details, launch-adjacent, and settings-related surfaces should all consume normalized runtime summary values from that same source instead of formatting loader, version, and dependency state independently.
- Loader labels must be user-facing and humanized. Raw technical strings such as lowercased `forge 47.2.0` should not remain the primary visible runtime label when a normalized display label exists.
- Dependency semantics must stay conservative and trustworthy: healthy is neutral, warning is yellow, error is red. Summary badges should not read as broken when all dependencies are satisfied.
- Settings and details surfaces must not show stale or default runtime state that contradicts the actual selected pack or installed effective configuration.

### Async create and add-flow contract
- Create-modpack and add-mod flows should recover in place. They must not rely on close-and-reopen, route reload, or accidental remount as the normal recovery path.
- While a durable create or install operation is running, all escape hatches on that surface should be locked: primary footer, back actions, cancel actions, breadcrumb exits, modal dismiss via overlay/X/Escape, and similar leave-surface paths.
- Once the first durable write succeeds, the operation should be treated as committed. Later follow-up failures should surface as recoverable post-commit errors with explicit retry or finish behavior, not as fake all-or-nothing failure that risks duplicates on retry.
- Hidden selections should not keep bulk-action CTAs enabled. When selected items leave the visible result set, the visible CTA state should stay truthful.
- Reopening add-mod modal or route should start from a clean, explicit selection baseline rather than silently reviving hidden previous choices.
- Stale async responses from search or version lookup must be ignored. Later user intent wins over slower earlier requests.
- Mixed-success bulk add should stay on the current surface with an explicit added-versus-failed summary and actionable next steps; it should not auto-close or navigate away just because some items succeeded.

### Claude's Discretion
- Exact extraction boundary for the shared catalog-controls composition, as long as installed list and remote browser clearly reuse one presentational shell.
- Exact geometry of the compact details header and tab seam, provided tabs become discoverable and content starts above the fold.
- Exact shape of the normalized runtime-summary hook or module, as long as precedence and output truth stay consistent across all consuming surfaces.
- Whether create draft recovery survives full app reload or remains bounded to in-session continuity only, provided the user no longer depends on reload-style recovery for normal error handling.
- Exact copy and UI shape for post-commit recoverable failures and mixed-success summaries, as long as the user understands what succeeded, what failed, and what to do next.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/sidebar/modpackRuntimeDependencies.ts` and `src/components/sidebar/ModpackDependencySummary.tsx` are the strongest existing seed for authoritative runtime and dependency truth. They already power details settings, create flow dependency summary, and part of simple play.
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts` already resolves installed effective configuration and is the narrowest current seam for config-first runtime truth on detail surfaces.
- `src/features/modpacks/hooks/useModpackNavigation.ts` and `src/components/modpacks/ModpackRouter.tsx` already preserve remote browser route state and should remain the state seam for browser-specific composition.
- Existing tests already lock a large part of the surface contract:
  - `ModpackList.ergonomics.test.tsx`
  - `ModpackBrowser.ergonomics.test.tsx`
  - `ModpackCatalog.density.test.tsx`
  - `ModpackDetails.layout.test.tsx`
  - `ModpackDetails.density.test.tsx`
  - `ModpackDetailsSettings.summary.test.tsx`
  - `CreateModpackDependencies.test.tsx`
  - `AddModPage.layout.test.tsx`
  - `AddModModal.layout.test.tsx`

### Established Patterns
- Phase 16 already locked the rule that runtime dependency truth should come from effective pack configuration rather than loose metadata guesses.
- Phase 19 already locked route-level primary-action ownership: deep routes own the primary CTA, while shell-level actions are secondary.
- Phase 28 already removed global shell noise and update urgency, so Phase 29 should keep modpack complexity local to modpack surfaces instead of reintroducing shell-level clutter.
- User-facing strings remain EN/RU-localized, and new visible behavior should land with focused regression seams rather than broad unbounded rewrites.

### Integration Points
- `src/components/modpacks/ModpackList.tsx` and `src/components/modpacks/ModpackBrowser.tsx` currently duplicate search/filter composition, filter chips, loader formatting, and reset behavior. These are the primary compact-controls refactor seam.
- `src/components/modpacks/ModpackDetails.tsx`, `details/ModpackDetailsHeader.tsx`, `details/ModpackDetailsSettingsTab.tsx`, and `details/ModpackDetailsModsTab.tsx` currently split runtime truth and tab composition across separate merge policies.
- `src/components/SimplePlayDashboard.tsx` is a launch-adjacent runtime consumer that should stay aligned with whatever authoritative runtime-summary source Phase 29 establishes.
- `src/components/modpacks/ModpackCreationWizard.tsx`, `AddModPage.tsx`, and `AddModModal.tsx` are the primary async-action seams for busy-state locking, stale-response ordering, and recoverable failure UX.
- `electron/services/modpacks/modpackService.ts` is the durable write seam for create/add commit semantics and duplicate/idempotency behavior.

</code_context>

<specifics>
## Specific Ideas

- The user feedback for this milestone explicitly prefers search and filters in one horizontal composition instead of separate vertical blocks, and wants modpack cards reduced to only Minecraft version plus updated timestamp.
- The user explicitly reads the current details layout as wrong because top actions push tab content below the fold and make tabs feel undiscoverable.
- The user explicitly distrusts the current runtime and modloader display, especially when settings or details show stale or false runtime state.
- The user explicitly wants silent failures replaced with explainable, product-level recovery rather than retry-by-reload or unexplained UI drift.

</specifics>

<deferred>
## Deferred Ideas

- In-app resource-pack and shader browsers, compatibility guidance, and local-file fallback redesign belong to Phase 31.
- Any broader content marketplace or discovery expansion beyond bounded modpack workflow cleanup belongs to future phases, not Phase 29.
- Broader settings geometry, preset-theme truth, and appearance-control cleanup belong to Phase 30 unless directly required by a Phase 29 seam.

</deferred>

---

*Phase: 29-modpack-workflow-simplification-and-runtime-truth*
*Context gathered: 2026-04-20*
