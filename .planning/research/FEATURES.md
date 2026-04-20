# Project Research: Features

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.6.0 Feedback-Driven Stabilization And Expansion`  
**Researched:** 2026-04-20  
**Confidence:** HIGH

## Research Question

What feature directions should define `v0.6.0` now that `v0.5.0` already shipped the redesign baseline, but live feedback still says the launcher feels overbranded in the wrong places, noisy in modpack-heavy workflows, dishonest in settings, and unfinished in resource-pack or shader flows?

## Milestone Read

`v0.6.0` should be treated as one truthful public release, not a fake sequence of `v0.5.1`, `v0.5.2`, and `v0.5.3`.

The milestone already has a clear internal phase structure in `.planning/MILESTONES.md`:

- Phase 28: product restraint and native shell truth
- Phase 29: modpack workflow simplification and runtime truth
- Phase 30: settings truth and honest personalization
- Phase 31: guided content browsers and bounded capability expansion

The product goal is not another redesign wave. The goal is to stabilize the shipped `v0.5.0` launcher so it stops contradicting itself in day-to-day use, then add only one bounded expansion that clearly strengthens the modpack-heavy core value.

## Current Product Shape

`v0.5.0` already shipped the hard baseline that `v0.6.0` must build on rather than reopen:

- a shell that is generally safer and more structured than pre-redesign FMCL
- explicit CTA ownership instead of broad action duplication
- a product-owned brand language and fallback system
- denser modpack surfaces, settings surfaces, and degraded-state handling
- a theme and locale system that was intended to be truthful
- one existing manual verification seam for deterministic closeout

That means `v0.6.0` should not start from "the launcher needs more surface area." It should start from "the shipped redesign still has remaining trust debt in four specific seams."

## Feature Categories

| Category | Phase | User problem now | Why this belongs in `v0.6.0` |
| --- | --- | --- | --- |
| Product restraint and shell truth | 28 | Critical shell surfaces still feel louder than the content they are supposed to frame. Branding leaks into fallback states, macOS shell behavior fights the platform, modpack update messaging escapes into the global shell, and reopened launcher state can disagree with runtime truth. | This is the remaining top-level trust problem. Users notice shell weirdness before they judge deeper features. |
| Simplified modpack workflows | 29 | FMCL is modpack-first, but list, details, tabs, dependencies, and async actions still feel too busy and sometimes untrustworthy. | This is the core everyday workflow. If modpack-heavy use is noisy or contradictory, the launcher misses its main value. |
| Honest settings | 30 | Settings still contain branding noise, inconsistent control geometry, theme presets that do not behave predictably, and appearance controls that appear to do little or nothing. | Settings are supposed to be a truth surface. When they feel decorative or misleading, users stop trusting personalization altogether. |
| Guided resource-pack and shader browsers | 31 | Resource-pack and shader flows still escape into Finder or Explorer, compatibility rules are unclear, and failure handling does not explain enough. | This is the one justified expansion seam because it strengthens an existing modpack-centered job instead of inventing a new product area. |

## Table Stakes

These are not "nice-to-have polish" items anymore. They are the minimum product behaviors users now expect from `v0.6.0`.

| Category | What users now expect | Evidence from supplied inputs | In scope for `v0.6.0` |
| --- | --- | --- | --- |
| Product restraint and shell truth | The shell should frame content quietly, behave natively where the OS already has an answer, and never present route-unrelated urgency. | Product feedback rejects aggressive logo reuse in fallback states, calls for native macOS traffic-light behavior, rejects a global modpack-update banner, and reports classic-mode reopen mismatch where displayed version and launched version disagree. | Treat app identity as restrained and contextual, prefer content-first fallbacks, remove shell-level modpack-update urgency, choose native-first macOS chrome behavior, and make reopen or restart restore truthful launcher state. |
| Simplified modpack workflows | Modpack browsing and details should feel smaller, calmer, and more truthful. The user should not fight filters, card density, tab discoverability, dependency colors, or flickering async flows. | Product feedback asks for one-line search or filter composition, fewer card details, tabs discoverable without scroll fights, truthful modloader and runtime settings, neutral dependency badges when healthy, and stable confirm actions. QA adds BUG-06, BUG-08, and BUG-09. | Compress list controls into a lower-noise scan pattern, reduce cards to minimum useful metadata, keep tabs visible without internal scroll traps, fix dependency or loader truth, and stabilize create/add-mod confirm flows. |
| Honest settings | Settings should only show controls that visibly do something, present one consistent control system, and make preset behavior readable without guessing. | Product feedback calls out the settings brand block as unnecessary, reports text collisions, broken toggle geometry, massive tabs, duplicated copy, and preset switching that changes theme mode unpredictably. QA adds BUG-12 and settings-side raw-key leakage in BUG-02. | Remove or demote decorative branding in settings, normalize control geometry, make preset changes deterministic and legible, and remove or reword controls whose visible effect is negligible or misleading. |
| Guided resource-pack and shader browsers | Content flows should stay inside the launcher, explain compatibility before install, and fail in a way a normal user can recover from. | Product feedback explicitly rejects Finder or Explorer detours, asks for built-in resource-pack and shader browsers, calls out unclear shader compatibility rules, and reports resource-pack errors plus unexplained creation failures. | Build guided in-app content flows for packs and shaders, expose compatibility guidance before confirmation, and replace silent failures with recoverable explanations tied to the actual blocking reason. |

## Differentiators

These are the product moves that make `v0.6.0` worth shipping as a milestone rather than a loose patch bundle.

| Category | Differentiator | Why it matters for FMCL specifically | Required boundary |
| --- | --- | --- | --- |
| Product restraint and shell truth | A calmer, Minecraft-native shell that knows when not to brand itself | FMCL already proved it can redesign itself in `v0.5.0`; now it needs judgment. The differentiator is not "more branding," but knowing that app identity belongs on app surfaces while content placeholders should stay content-first. The supplied feedback is explicit that `icon.ico` is the trusted baseline for app-icon identity and that the newer abstract mark should not dominate critical surfaces by default. | Do not turn Phase 28 into another broad visual reset. Fix restraint, not novelty. |
| Simplified modpack workflows | A modpack-first interface that exposes only the information needed at each altitude | FMCL's core value is still day-to-day modpack use. The differentiator is a launcher where list view, detail view, and async actions all feel intentionally scoped: summary in the list, truth in the details, clear action ownership, no fake alarms. | Do not expand this into more modpack surface area or unrelated route growth. |
| Honest settings | Personalization that earns trust before it offers more of itself | FMCL already has presets and appearance controls. The next value step is not adding more knobs; it is making the existing knobs truthful enough that users believe them. That is the only defensible path to bounded `CUSTOM-01`. | Any deeper customization work must come after the existing settings contract is cleaned up. |
| Guided resource-pack and shader browsers | A content-management experience that stays inside FMCL and teaches compatibility instead of outsourcing it | FMCL already exposes content tabs for resource packs and shaders. The differentiator is turning those tabs into guided acquisition and import flows, not leaving the user in OS file pickers with unclear compatibility assumptions. That is a bounded, core-value-aligned interpretation of `EXPAND-01`. | Keep the expansion tied to modpack-heavy use. Do not turn it into a broad marketplace or social feature bet. |

## Anti-Features And Deferred Scope

These items are attractive because they sound bigger or more exciting, but they would weaken the milestone if they absorb attention now.

| Anti-feature or deferred scope | Why it is tempting | Why it is wrong for `v0.6.0` | Better move now |
| --- | --- | --- | --- |
| Another brand-reset wave or more abstract identity experiments | The user feedback starts with branding complaints, so it is easy to answer with another visual reinvention. | The complaint is not lack of originality. It is lack of restraint and poor placement of branding. More experimentation would repeat the same mistake. | Keep identity quiet on critical surfaces and remove branding from fallback states that should stay content-first. |
| Global shell announcements for local object state | A top-level banner seems like an easy way to ensure update visibility. | Product feedback explicitly says this scales badly and steals focus from the user's primary intent to launch a specific pack. | Keep update affordances local to the modpack list and details surfaces. |
| Broad modpack capability growth during workflow cleanup | New actions, more metadata, or more tabs can sound like a stronger modpack milestone. | The supplied feedback is asking for smaller, clearer flows, not more UI mass. | Reduce list and details noise first; add nothing that makes scanning harder. |
| Decorative customization sprawl | More presets, background effects, and appearance controls look like visible user value. | Current settings already feel misleading. More knobs before truthful behavior would deepen distrust and make `CUSTOM-01` indefensible. | Ship honest settings first, then consider only tightly bounded personalization follow-up. |
| A standalone content marketplace or open-ended browser expansion | Content browsers are the one allowed expansion seam, so it is easy to overbuild them. | The goal is guided resource-pack and shader flows that strengthen current modpack use, not a new discovery business inside the launcher. | Limit Phase 31 to guided import or acquisition, compatibility clarity, and recoverable failure handling. |
| `PERF-01` inside the main milestone story | Performance work is always desirable and often easy to justify technically. | `.planning/PROJECT.md` and `.planning/MILESTONES.md` already say the dominant user complaint is not performance right now. Making it central would blur the release story. | Keep `PERF-01` explicit, but defer it until the launcher stops feeling noisy or untruthful in the four active seams. |
| New multiplayer or social expansion | New capability headlines can feel more marketable than cleanup work. | Nothing in the supplied feedback points to multiplayer breadth as the immediate trust problem. | Keep the release story centered on shell truth, modpack truth, settings truth, and guided content flows. |

## Category Recommendations

### 1. Product Restraint And Shell Truth

This category should be treated as "top-level trust repair," not as generic visual polish.

The strongest product recommendation is to reduce the amount of launcher identity competing with actual content:

- keep app-level identity where identity is needed
- treat missing media as missing content, not as an excuse to show loud branded fallback art
- simplify the sidebar so it helps orientation instead of consuming space or truncating the launcher name
- make macOS shell behavior defer to the platform where the OS already has a canonical answer
- make launcher reopen and restart restore the state users will actually launch, not an older visible default

If Phase 28 succeeds, FMCL should feel less like a shell advertising itself and more like a native desktop frame around the user's selected content.

### 2. Simplified Modpack Workflows

This category should optimize for scanability, locality, and truth.

The supplied feedback is unusually clear that the user wants less UI, not a different arrangement of the same volume:

- fewer summary blocks on the list screen
- one lower-noise filter/search row instead of stacked vertical control towers
- cards reduced to minimum useful metadata such as Minecraft version and update recency
- tabs that stay discoverable without forcing the user to scroll past action blocks first
- dependency and runtime semantics that read as trustworthy at a glance
- confirm actions that stay physically stable while async loading continues

If Phase 29 succeeds, FMCL's core modpack flows should feel smaller, faster to read, and much harder to misinterpret.

### 3. Honest Settings

This category should restore the idea that settings are a truthful contract with the user.

The current problem is not missing settings depth. It is that some controls either behave unpredictably or do not produce a clear visible outcome at all. That makes the right recommendation narrow and disciplined:

- remove settings surfaces that exist mainly to re-show launcher branding
- make preset behavior deterministic enough that users can predict the result before and after the switch
- normalize the geometry of toggles, sliders, buttons, and tab selection so settings stop looking like mixed components
- delete, hide, or rewrite appearance controls whose visible output is too weak to justify their presence

Only after this category is stable does bounded `CUSTOM-01` make sense.

### 4. Guided Resource-Pack And Shader Browsers

This category is the one justified capability expansion in `v0.6.0`, but it should still feel like stabilization of an existing job rather than a new product direction.

The current FMCL shape already exposes resource-pack and shader areas. The missing piece is guidance:

- keep acquisition and import inside the launcher
- explain compatibility requirements before installation, especially for shaders
- report actual blocking reasons instead of opaque failure
- keep expanded content sections visually integrated with the rest of the details surface

Only bounded `EXPAND-01` belongs here. The expansion is "guided content management for existing modpack use," not "a broad new content platform."

## Phase Ordering And Dependency Notes

- Phase 28 should happen first because shell noise, overbranding, and runtime mismatch contaminate every other surface.
- Phase 29 should follow because the core modpack workflows are the launcher's main everyday value and currently carry the heaviest density complaints.
- Phase 30 should come after modpack cleanup because settings truth depends on a clearer baseline for what the launcher actually does and how presets should present it.
- Phase 31 should come last because it is the only bounded expansion seam and should inherit the calmer shell, clearer modpack detail contract, and more trustworthy settings behavior.
- Closeout should reuse the existing manual verification seam rather than inventing a new proof path.

## Main Conclusion

`v0.6.0` should be framed as a release about restraint, truth, and only one bounded expansion.

The feature story is coherent if FMCL ships these four outcomes together:

- the shell becomes quieter, more native, and more truthful
- modpack list and detail workflows become smaller and easier to trust
- settings stop pretending that decorative or unpredictable controls are real product value
- resource-pack and shader flows stay inside the launcher and explain compatibility and failure honestly

The milestone becomes incoherent if it turns into any of the following:

- another broad brand experiment
- a feature-growth wave disguised as workflow cleanup
- a settings customization spree before truth is restored
- a large content-platform bet instead of guided content management
- a release story diluted by unrelated performance or multiplayer work

## Sources

- `.planning/PROJECT.md`
- `.planning/MILESTONES.md`
- `.planning/milestones/v0.5.0-REQUIREMENTS.md`
- `docs/ru/product-feedback-2026-04-20.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `/Users/kszinikov/.codex/get-shit-done/templates/research-project/FEATURES.md`

---
*Research completed: 2026-04-20*  
*Ready for synthesis: yes*
