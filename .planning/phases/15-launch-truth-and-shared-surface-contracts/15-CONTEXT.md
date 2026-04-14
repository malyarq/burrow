# Phase 15: Launch Truth And Shared Surface Contracts - Context

**Gathered:** 2026-04-14  
**Status:** Ready for planning

<domain>
## Phase Boundary

Repair the shipped main play surface so launch state stops contradicting itself and missing-art states stop looking broken. This phase covers launch fallback art, visible launch-state presentation, truth synchronization between status cues, and busy-state behavior on the current launch surface. It does not add new launcher capabilities, redesign other routes, or expand into modpack-detail or catalog work.

</domain>

<decisions>
## Implementation Decisions

### Launch fallback behavior
- Missing or broken launch artwork should resolve to a calm branded fallback, not a technical placeholder or noisy illustration.
- The fallback should preserve pack or instance identity by showing the relevant name alongside FMCL branding.
- The fallback should not explicitly announce that artwork is missing on the main play surface; it should feel intentional rather than error-first.
- The fallback should belong to a shared visual family that can be reused on other missing-art surfaces later, with size-specific variants if needed.

### Launch status presentation
- Keep a dedicated launch-status card on the main play surface rather than collapsing status into a tiny inline hint or making it dominate the whole page.
- The current stage should be the primary signal; percentage is secondary and should support the stage rather than replace it.
- The main surface should show one short human-readable detail line under the stage title; raw or verbose runtime text belongs elsewhere.
- Once Minecraft starts, a calm waiting or running state should stay visible briefly so success is obvious before the UI settles back.

### Truth synchronization policy
- The main play surface should reflect the currently selected launch configuration; pending launch choices should win over stale saved summaries.
- Structured launch stage or progress state is the authoritative source for the visible status UI; parsed logs are supporting detail only.
- If meaningful percentage is not available yet, the UI should show an indeterminate working state instead of a fake `0%` or a stale old percentage.
- When signals are almost but not fully conclusive, the UI should behave conservatively and remain in a working or waiting state until a reliable success signal arrives.

### Busy-state behavior
- While launch preparation or download work is active, lock launch-affecting controls only; the rest of the surface can remain readable.
- Locked controls should stay visible and look read-only or dimmed rather than disappearing behind a full blocking overlay.
- Advanced settings should remain visible for reference while busy, but they should become read-only until the current launch work finishes.
- After a launch failure, controls should unlock immediately, but the failure state should stay visible until the user takes another action.

### Claude's Discretion
- Exact composition, spacing, and icon or illustration treatment inside the branded fallback.
- Exact timing and visual transition for how long the waiting or running state remains visible after process start.
- Exact localized wording of the short status-detail line, as long as it stays concise and human-readable.

</decisions>

<specifics>
## Specific Ideas

- The fallback should feel intentional, quiet, and branded rather than like a broken browser image or a diagnostic card.
- The launch-status card should remain above the current-settings area and act as the clear “what is happening right now” anchor.
- Structured state should win over logs, and the UI should avoid fake numerical certainty when it does not have real percentage data.
- Busy state should make the current configuration understandable at a glance instead of hiding the page behind a heavy blocker.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/assets/branding.ts` (`LAUNCHER_MARK_PATH`): bundled launcher branding that can anchor the shared fallback-art treatment.
- `src/components/ui/LazyImage.tsx`: existing fallback-aware image component with bundled-asset detection and cache support.
- `src/components/SimplePlayDashboard.tsx`: already owns the main launch hero, launch-status card, and current-settings summary that this phase must make truthful.
- `src/features/launcher/hooks/useLauncher.ts`, `useLauncherIPC.ts`, and `src/features/launcher/services/launcherService.ts`: current renderer seam for launch stages, visible status text, and progress interpretation.
- `src/components/sidebar/LaunchControls.tsx`: existing launch CTA and inline status treatment that must stay consistent with the main play surface.

### Established Patterns
- Phase 13 already decided to use an explicit launch-stage model shared by launcher hooks, dashboard, and shared launch controls rather than a generic loading spinner.
- Earlier recovery work preferred bundled fallback art reused across shipped surfaces instead of introducing separate image paths or duplicate fallback systems.
- User-facing strings are expected to live in `src/locales/en.json` and `src/locales/ru.json`; raw keys or inline one-off copy would violate established project rules.
- The milestone already has a reusable manual verification seam; Phase 15 should prepare truthful launch behavior that later closeout can verify rather than inventing a new proof path.

### Integration Points
- `src/components/SimplePlayDashboard.tsx`: launch hero art, launch-status card, current-settings summary, and advanced-settings visibility.
- `src/components/sidebar/LaunchControls.tsx`: CTA label, busy-state disablement, failure persistence, and running or waiting affordances.
- `src/features/launcher/hooks/useLauncher.ts`: initial stage setup, failure recovery state, and user-facing status detail defaults.
- `src/features/launcher/hooks/useLauncherIPC.ts`: current mixing point for structured progress events and parsed log messages.
- `src/features/launcher/services/launcherService.ts`: current stage titles, progress-label mapping, and log-to-status heuristics.
- `electron/services/runtime/taskRunner.ts`: upstream task progress and completion logging that currently influences user-visible state downstream.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 15 scope.

</deferred>

---

*Phase: 15-launch-truth-and-shared-surface-contracts*  
*Context gathered: 2026-04-14*
