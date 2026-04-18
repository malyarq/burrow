# Phase 23: Fallback, Error, And Placeholder Productization - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 23 productizes FMCL's degraded states on already-shipped surfaces. It replaces raw placeholders, unresolved bindings, ambiguous empty or zero-result screens, misleading degraded-data copy, and the current raw React crash dump with one consistent fallback language. It does not add diagnostics tooling, new routes, or broader feature scope beyond making existing degraded states truthful, calm, and usable.

</domain>

<decisions>
## Implementation Decisions

### Optional and unavailable content copy
- When optional content is unavailable or not loaded yet, FMCL should keep the section visible and replace raw placeholders with calm inline product copy.
- FMCL should distinguish between "not provided", "still loading", and "failed to load" when that difference is user-meaningful; these states should not collapse into one vague placeholder.
- Raw template strings, unresolved bindings, mixed-language placeholder text, and developer-style fallback text must never leak into shipped UI.
- Phase 23 should prefer quiet truthful copy over louder unavailable-state cards for optional content unless the absence blocks user understanding of the whole surface.

### Empty and zero-result states
- Empty and zero-result states should be short, explicit, and paired with one contextual next step rather than being passive informational blanks.
- The next step should adapt to the cause of emptiness where possible: for example clear filters for zero-result search, browse or create for no modpacks, or add content for genuinely empty content tabs.
- Empty states should not become decorative branded hero moments; stronger branding or illustration is explicitly not the direction for this phase.
- Empty and missing-data screens should feel intentional and low-drama, not like the app fell back to a default marketing tile.

### Fatal error recovery surface
- The fatal crash surface should optimize for recovery first, not diagnostics first.
- The primary recovery action should be restarting the launcher, because Phase 23 should not leave the user in a half-broken session after a root crash.
- Technical details may exist only as a secondary reveal or copy action; they must not be the main thing the user sees on crash.
- Raw React internals, localhost URLs, node_modules paths, and duplicated exception text should not be shown directly on the default crash screen.

### Dependency and degraded-data truth
- When dependency or availability truth is incomplete, FMCL should bias toward conservative explicit states rather than optimistic silence.
- If compatibility, availability, or dependency satisfaction is not proven, the UI should say so with calm explicit product copy such as unavailable, incompatible, or unknown instead of implying success or hiding the ambiguity.
- Summary surfaces should stay calm, but they must not contradict deeper detail states; a quieter summary is acceptable only if it remains truthful to the explicit degraded state.
- Phase 23 should repair misleading degraded-data logic such as unresolved runtime placeholders, contradictory dependency statuses, or UI that interprets partial data as confirmed truth.

### Claude's Discretion
- Exact localized wording and visual density of the calm inline unavailable states, as long as they stay brief, productized, and EN/RU aligned.
- Which empty states and degraded-state screens should consolidate onto one shared empty-state component first versus staying route-local during the phase.
- Whether fatal-error technical details are revealed behind a disclosure, copy button, or similar secondary affordance, as long as recovery-first remains the default posture.

</decisions>

<specifics>
## Specific Ideas

- The user explicitly wants FMCL to stop degrading into irritating default states; the anti-reference is aggressive launcher branding or weird logo spam in fallbacks and empties.
- Missing content and degraded states should feel intentional and calm, not like a broken browser image, a debug panel, or a leftover placeholder from development.
- Zero-result and empty states should help the user recover immediately with one clear next step instead of making them infer what to do from context.
- The screenshot audit examples that matter most for this phase are the raw `${file.jarVersion}` leak, misleading dependency messaging around Minecraft or loader truth, partially broken placeholder copy like `Changelog будет загружен...`, and the raw React crash screen with duplicated error text and stack output.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/LazyImage.tsx`: existing shared seam for image loading, fallback switching, and placeholder behavior on artwork-bearing surfaces.
- `src/components/ui/ArtworkFallback.tsx`: current product-owned fallback-art primitive that already distinguishes `content-artwork`, `product-mark`, and `app-icon`.
- `src/components/ErrorBoundary.tsx` and `src/components/ErrorBoundaryWrapper.tsx`: current app-wide fatal-error seam where Phase 23 crash productization should integrate.
- `src/components/layout/EmptyStateView.tsx`: existing empty-state shell, but it currently hardwires a strong brand-mark treatment that may need to be softened or repurposed for Phase 23.
- Existing localized empty-state strings already cover many surfaces in `src/locales/en.json` and `src/locales/ru.json`, including modpacks, screenshots, datapacks, resource packs, shaders, worlds, and statistics.

### Established Patterns
- Phase 15 already locked the direction that degraded states should feel calm, intentional, and non-technical rather than noisy or diagnostic-first.
- Phase 20 already locked neutral media fallback as the product policy for missing artwork; Phase 23 should preserve that instead of reintroducing launcher-mark fallbacks on content surfaces.
- Phase 22 already locked shared theme, accent, and locale truth, so degraded states must work in dark or light themes and in both EN and RU without becoming visually or linguistically inconsistent.
- Earlier phases consistently preferred truthful conservative state handling over optimistic but misleading UI, especially in launch and modpack runtime surfaces.

### Integration Points
- `src/main.tsx` and `src/App.tsx` mount the app-wide error boundary and are the narrowest seams for replacing the current raw crash dump with a recovery-first surface.
- `src/features/launcher/hooks/useLauncher.ts`, `src/features/share/ShareModal.tsx`, and renderer IPC wrappers in `src/services/ipc/*` are current sources of developer-facing or mixed-quality error text that can leak into user-visible states.
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx` is the key dependency-truth seam for explicit `missing`, `incompatible`, and runtime-provided states.
- `src/components/modpacks/ModpackBrowser.tsx`, `src/components/modpacks/ModpackList.tsx`, `src/components/modpacks/ModpackUpdateModal.tsx`, `src/components/modpacks/details/ResourcePacksTab.tsx`, `src/components/modpacks/details/ShadersTab.tsx`, `src/components/modpacks/details/WorldsTab.tsx`, `src/components/modpacks/details/WorldDatapacksModal.tsx`, `src/features/screenshots/components/ScreenshotsTab.tsx`, and `src/features/settings/statistics/StatisticsTab.tsx` are representative empty or zero-result seams already in scope.
- `src/verification/manual/scenarios.tsx` and `src/verification/manual/views.ts` remain the existing proof seam that later planning can extend for degraded-state verification in Phase 24.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 23 scope.

</deferred>

---

*Phase: 23-fallback-error-and-placeholder-productization*
*Context gathered: 2026-04-19*
