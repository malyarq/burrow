# Project Research: Features

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.5.0 Experience Reinvention And Brand Reset`  
**Researched:** 2026-04-17  
**Confidence:** HIGH

## Research Question

What do FMCL users now need from `v0.5.0` if the goal is not more launcher surface area, but a deeper redesign that removes low-trust behavior, resets the product's visual identity, and makes existing desktop flows feel deliberate instead of patched together?

## Milestone Read

`v0.5.0` should be treated as a redesign-quality milestone for the shipped launcher, not as a new capability milestone.

The evidence is consistent across `.planning/PROJECT.md`, `docs/KNOWN_ISSUES.md`, and `new_screens/BUG_REPORT_2026-04-17.md`:

- core desktop screens still clip under the custom title bar, hide content behind sticky footers, and waste usable width
- primary actions and summaries contradict each other, especially around play state, modloader choice, and dependency status
- fallback behavior is low-trust: broken visual states leak through as raw placeholders, meaningless counts, generic empty blocks, and even React runtime errors
- appearance controls promise customization, but selected states, accent usage, preset identity, and locale behavior are inconsistent
- the app reads like multiple local fixes rather than one product with a clear point of view

The feature goal for `v0.5.0` is therefore:

1. make the launcher feel structurally correct on desktop
2. make every visible state believable
3. give FMCL a recognizable, intentional brand and interaction language
4. stop shipping fallback and error behavior that looks like unfinished development output

## Feature Landscape

### Table Stakes (Users Now Expect These)

| Feature | Why users need it now | Complexity | User Value | In scope for `v0.5.0` | Explicitly deferred |
| --- | --- | --- | --- | --- | --- |
| Window-safe shell and action layout discipline | The current app visibly clips content under the title bar (`R1`), hides content under fixed footers (`R2`), and lets sticky headers cover cards (`S18`). Users read this as a broken desktop app before they judge any deeper redesign. | HIGH | HIGH | Define one shell contract for top chrome, safe-area padding, sticky regions, scroll containers, and reserved footer space across classic, browser, modpack details, settings, wizard, and modal surfaces. | Full window-management rewrite, native-title-bar experiments, or route-level layout forks. |
| Single source of truth for primary actions and runtime state | Users cannot trust the product when `PLAY` appears twice (`R4`), modloader values disagree (`S01`, `S15`), or dependency summaries say something controls do not show. | HIGH | HIGH | Unify CTA hierarchy and visible state models so each screen answers one clear question: what item is active, what action is primary, and what will happen next. | New launcher orchestration features, new install pipelines, or new pack-management flows. |
| Graceful fallbacks and user-safe failure handling | Missing art, raw placeholders like `${file.jarVersion}`, unlabeled `0` values, and a React stack-trace crash screen (`S20`) destroy trust faster than ordinary bugs. | MEDIUM | HIGH | Replace broken-image, missing-data, empty, zero-result, and fatal-error states with shared FMCL fallbacks, product copy, and bounded recovery actions. | Telemetry dashboards, power-user diagnostics centers, or deep crash-reporting features. |
| Readable dense desktop navigation and controls | Tabs wrapping badly (`R3`), wrapped buttons (`S02`), orphaned filters (`S03`), and helpers hidden behind modal footers (`S16`) make the launcher feel cramped despite having desktop space. | MEDIUM | HIGH | Rework tabs, filters, button sizing, card headers, helper placement, and truncation policy so dense screens scan cleanly at shipped window sizes. | New IA, new routes, or a broad responsive redesign for unrelated form factors. |
| Cohesive contrast, selection, and locale behavior | Users cannot confidently operate themes or setup flows when active states are ambiguous (`R7`), accents only half-apply (`R6`), disabled actions are too faint (`S14`), and English UI still shows Russian-formatted metadata (`S03`). | MEDIUM | HIGH | Ship reliable selected, active, hover, disabled, and accent rules; make theme controls truthful; align dates, numbers, and strings with the chosen locale on redesigned surfaces. | New languages, advanced accessibility settings, or a generalized internationalization expansion project. |

### Differentiators (What Makes This Milestone Worth Doing)

| Feature | Value proposition | Complexity | User Value | In scope for `v0.5.0` | Explicitly deferred |
| --- | --- | --- | --- | --- | --- |
| FMCL brand reset across core surfaces | FMCL should stop looking like a generic launcher with random patches. A recognizable visual language across welcome, sidebar, browser, modpack detail, settings, modal, and error states makes the product feel authored. | HIGH | HIGH | Replace the current mixed styling with a coherent art direction: logo/wordmark usage, surface rhythm, hierarchy, fallback art, and tone of voice that all read as one launcher. | Marketing-site work, brand guidelines outside the app, or a broad asset-production pipeline. |
| Modpack-first confidence surfaces | FMCL's strongest product identity is still modpack-heavy desktop use. The app should make pack context, loader context, dependency health, and local actions immediately legible instead of scattered. | MEDIUM/HIGH | HIGH | Redesign classic/home, modpack list, browser, pack details, and creation flow around clearer pack identity, clearer summaries, and calmer action grouping. | New social/community features, publishing flows, or broader content ecosystems. |
| Authored theme system instead of loose visual knobs | The current preset system suggests customization but does not produce clearly different, trustworthy results. A smaller set of sharper presets is more valuable than many half-working ones. | MEDIUM | MEDIUM/HIGH | Make presets feel intentionally designed, ensure accent color propagates through active controls, and let light/dark surfaces both ship as confident first-class options. | More presets, color pickers, particles, novelty effects, or personalization depth for its own sake. |
| Stronger product judgment in secondary states | The redesign should show up not only in hero screens but in the decisions users notice every day: modal focus, welcome dismissal, empty labels, save actions, missing counts, and wording. | MEDIUM | HIGH | Rewrite weak or awkward microstates so the app stops feeling "annoyingly default" even when nothing exceptional is happening. | Full onboarding systems, gamified tips, or narrative tutorial layers. |

### Anti-Features (Attractive, but Wrong for This Milestone)

| Anti-feature | Why it is tempting | Complexity | User Value | Why it is wrong for `v0.5.0` | Better move now |
| --- | --- | --- | --- | --- | --- |
| Another bug-fix-only pass without shared redesign rules | The screenshot list is long, so it is easy to patch each defect locally and call the milestone done. | MEDIUM | LOW | That would preserve the exact product drift the milestone is supposed to remove. Users would get fewer obvious bugs but the launcher would still feel arbitrary. | Build shared shell, state, fallback, and brand rules first, then fix screens through those rules. |
| New capability expansion during the redesign | Adding multiplayer, accounts, browser, or creator features can feel like a stronger milestone headline. | HIGH | LOW/MEDIUM | The current user pain is not missing feature breadth. It is low trust in the product already shipped. Expansion would dilute design judgment work. | Keep scope on redesigning existing launcher surfaces only. |
| Preset proliferation and effect-heavy customization | More presets, particles, glows, or dramatic animations can masquerade as a "brand reset." | MEDIUM | LOW | The current problem is inconsistency and poor state readability. More visual options before stronger rules would multiply incoherence. | Reduce to a sharper authored theme system with reliable contrast and accent behavior. |
| Raw technical transparency in user UI | Showing stack traces, raw placeholders, or internal values can look expedient during development. | LOW | NEGATIVE | In a desktop launcher, these states read as brokenness, not honesty. The fatal error screen in `S20` is the clearest example. | Hide implementation detail behind productized failure states with recovery guidance. |
| Duplicate CTAs and redundant actions for "discoverability" | Keeping `PLAY` in multiple places can seem safer than deciding one primary action. | LOW | LOW | It creates ambiguity, weakens hierarchy, and makes the app feel less confident in its own model. | Keep one primary action per context and demote or relocate secondary actions deliberately. |

## Scope Call: What The Milestone Should Actually Ship

### In Scope Now

- redesign the shared shell behavior so top chrome, side navigation, sticky headers, footers, and scroll areas stop fighting each other
- redesign core launcher surfaces that users touch constantly: classic/home, modpack list, modpack browser, modpack details, creation flow, settings, modal flows, and fatal/fallback states
- reset FMCL branding inside the app itself so missing art, empty states, and errors look intentional instead of generic or technical
- remove contradictory state presentation around play, modloader choice, dependency satisfaction, and active selections
- tighten theme/preset behavior so appearance settings produce visibly coherent results and trustworthy states
- fix localization leaks and locale mismatches on the redesigned surfaces as part of the redesign, not as a later copy-only sweep

### Explicitly Deferred

- net-new product areas or route expansion
- new multiplayer capabilities, account systems, sharing workflows, or content features unrelated to redesigning current surfaces
- deep architecture changes outside what is required to support the redesign safely
- highly granular customization such as user-defined palettes, extra preset packs, or effect systems
- heavyweight onboarding/tutorial systems
- developer-facing diagnostics surfaces beyond bounded crash recovery and user-readable error handling

## Ordering And Dependency Notes

- Shell and spacing rules come first. If title-bar overlap and footer collisions stay unresolved, the redesign will still look broken.
- State truth comes before visual polish on affected screens. A prettier screen that still lies about the active modloader or primary action is a failed milestone.
- Shared fallback and error components should be established early so browser, details, lists, and fatal states do not each invent their own degraded behavior.
- Theme reset should happen after contrast and selection rules are locked; otherwise presets will continue to be cosmetic labels on inconsistent controls.
- Copy and localization cleanup should ship alongside each redesigned surface because several visible defects are mixed presentation-and-language failures.

## Prioritization Matrix

| Feature area | User Value | Implementation Cost | Priority | Why |
| --- | --- | --- | --- | --- |
| Window-safe shell and action layout discipline | HIGH | HIGH | P0 | Without this, the launcher still looks structurally broken even after visual work. |
| Single source of truth for primary actions and runtime state | HIGH | HIGH | P0 | This is the trust core of a launcher; contradictory play and loader state is product-breaking. |
| Graceful fallbacks and user-safe failure handling | HIGH | MEDIUM | P1 | Missing or failing data is common; the redesign fails if those states still leak technical internals. |
| FMCL brand reset across core surfaces | HIGH | HIGH | P1 | This is the main reason the milestone exists beyond bug fixing. |
| Readable dense desktop navigation and controls | HIGH | MEDIUM | P1 | The launcher is desktop-first; density should feel efficient, not cramped or improvised. |
| Cohesive contrast, selection, and locale behavior | HIGH | MEDIUM | P1 | Appearance controls and setup flows need to be trustworthy to support the redesign claim. |
| Authored theme system and stronger product judgment in secondary states | MEDIUM/HIGH | MEDIUM | P2 | Important for distinctiveness, but should follow once layout and truth foundations are in place. |

## Main Conclusion

`v0.5.0` should not be framed as "more polish" and should not be used as cover for unrelated feature expansion.

From the feature angle, users need FMCL to become:

- structurally correct on desktop
- unambiguous about what is selected, installed, missing, or about to launch
- branded and intentional even when data is missing or a flow fails
- more disciplined in theme, state, and microcopy decisions

If the milestone ships those outcomes across the existing launcher map, it will feel like a genuine product reset. If it only fixes visible defects or adds more visuals/features without resolving layout truth and fallback quality, the redesign will still read as low-trust.

## Sources

- `.planning/PROJECT.md`
- `docs/KNOWN_ISSUES.md`
- `new_screens/BUG_REPORT_2026-04-17.md`
- `/Users/kszinikov/.codex/get-shit-done/templates/research-project/FEATURES.md`

---
*Research completed: 2026-04-17*  
*Ready for synthesis: yes*
