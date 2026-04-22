# FriendLauncher Roadmap

## Latest Release

- Release: `v0.6.0`
- Theme: Feedback-Driven Stabilization And Expansion
- Status: shipped on `2026-04-21`
- Current planning state: active milestone `v0.7.0` — Direct Feedback Closure And Interface Cohesion

## Next Planned Release

- Planned release: `v0.7.0`
- Theme: Direct Feedback Closure And Interface Cohesion
- Source of truth: the current direct user-feedback audit for the launcher
- Goal: close the still-open direct feedback gaps around shell/sidebar drift, catalog and detail density, guided content reliability, settings predictability, and the lack of one shared control contract across the launcher
- Current progress: Phases `32-35` are complete, covering sidebar readability, native macOS shell truth, calmer fallback surfaces, truthful classic runtime labels, compact catalog shells, minimal card facts, above-the-fold details tabs, first-read runtime truth, one shared details content workspace, fixed create/add action rails, actionable async recovery, and honest guided content runtime boundaries. Next planning step: Phase `36`.

## Why v0.6.0 Shipped

`v0.6.0` was a feedback-driven stabilization release. FMCL already had the broad launcher shape it needed, but the shipped product still felt noisy or untruthful in several critical places: shell behavior, modpack workflows, settings ownership, and content-management boundaries. This release removed that weirdness first and only then allowed one bounded capability expansion.

## What Landed

- The launcher shell now behaves more like a native desktop surface and stops competing with platform chrome or loud fallback branding.
- Modpack browsing, details, dependency state, and create/add flows are grounded in one smaller, more truthful runtime story.
- Settings now use one explicit appearance-state contract, one lighter shell hierarchy, and controls that explain their real scope instead of overclaiming broad personalization.
- Resource-pack and shader entry now route into the same in-app guided browser, that route carries its own explicit local `.zip` fallback, shader surfaces distinguish supported, needs-setup, unsupported, and unverified runtime states without overclaiming compatibility, and guided failures stay on-surface with named recovery paths.

## Phase Outcomes

| Phase | Status | Outcome |
|-------|--------|---------|
| 28. Product Restraint And Native Shell Truth | Shipped | Native shell behavior, restrained identity, scoped update signals, and truthful reopen-state recovery |
| 29. Modpack Workflow Simplification And Runtime Truth | Shipped | Compact catalog controls, cleaner details hierarchy, config-first runtime truth, and stable async create/add recovery |
| 30. Settings Truth And Honest Personalization | Shipped | Deterministic preset runtime, compact settings shell, honest control placement, and bounded preset-adjacent customization |
| 31. Guided Content Browsers And Capability Expansion | Shipped | Canonical guided entry, explicit in-route local `.zip` fallback, honest shader capability guidance, named recoverable failure states, and bounded-scope closeout proof |
| 35. Async Flow Reliability And Guided Content Honesty | Complete | Fixed create/add action rails, actionable mixed-success recovery, honest guided resource-pack and shader runtime guidance, and refreshed proof routes tied to the live async contract |

## Residual Notes

- The milestone audit passed with all scoped requirements satisfied.
- Browser-based manual walkthroughs were not rerun during this archive closeout, so real-shell sampling remains release-signoff debt rather than an implementation gap.
