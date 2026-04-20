# Pitfalls Research

**Domain:** stabilization and bounded expansion of an already redesigned Electron desktop launcher
**Milestone:** `v0.6.0 Feedback-Driven Stabilization And Expansion`
**Researched:** `2026-04-20`
**Confidence:** HIGH

## Phase Buckets Used In This Mapping

| Phase | What it should own |
| --- | --- |
| Phase 28: Product Restraint And Native Shell Truth | shell restraint, content-first fallbacks, native macOS behavior, localized modpack-update visibility, truthful top-level state after reopen or restart |
| Phase 29: Modpack Workflow Simplification And Runtime Truth | compact list/detail flows, tab discoverability, truthful loader/version/dependency semantics, stable async actions, unified content-tab contract |
| Phase 30: Settings Truth And Honest Personalization | removal of noisy settings branding, deterministic preset-theme behavior, consistent control geometry, removal or rewording of misleading controls, only bounded `CUSTOM-01` |
| Phase 31: Guided Content Browsers And Capability Expansion | in-app resource-pack and shader flows, compatibility guidance, recoverable errors, only bounded `EXPAND-01` tied to the launcher core |

## Why This Milestone Is Easy To Get Wrong

`v0.5.0` already shipped the redesign. The next release is not supposed to be another broad visual reinvention. The strongest evidence in the current milestone inputs points to a different kind of risk:

- feedback is about overreach, noise, and untruth, not lack of styling;
- users are explicitly asking for less shell interference and more native behavior;
- modpack flows already look "redesigned" but still do not feel trustworthy;
- settings already have many controls, but some controls do not produce truthful visible results;
- resource-pack and shader flows already exist, but they still feel like system-detour plumbing instead of guided product flows.

The common failure mode for `v0.6.0` is to keep polishing surfaces while leaving the trust break underneath untouched.

## Primary Pitfalls

### Pitfall 1: Treating shell restraint as another brand wave

**What goes wrong:**
The team hears "the shell feels wrong" and answers with more visual replacement work: new marks, new placeholders, new branded chrome. The release ships different shell styling, but not a calmer shell.

**Why it is likely here:**
The previous milestone was a redesign and brand reset. That makes it easy to keep solving discomfort with more design activity even when the feedback is explicitly asking for less branding and less weirdness.

**Milestone-specific warning signs:**
- critical surfaces still debate which logo/mark should be shown instead of whether the mark should be shown at all;
- fallback states keep replacing missing content with launcher identity rather than a neutral content placeholder;
- the sidebar or shell gains new decorative blocks while feedback is asking for noise reduction;
- review language focuses on "refreshing" the shell instead of making it quieter and more native.

**Concrete prevention strategies:**
- Define a strict allowlist for branding on app-critical surfaces before implementation starts.
- Write one fallback policy: missing content gets a calm content placeholder, not a logo substitute.
- Require every shell change to answer: "what user confusion or noise does this remove?"
- Reject shell work whose main value is "looks more branded" rather than "feels less intrusive."

**Phase owner:**
Phase 28

---

### Pitfall 2: Fixing macOS complaints with route-level chrome hacks

**What goes wrong:**
The launcher keeps its custom shell tension on macOS, but the fixes land as local padding and button-placement patches. The result is duplicated controls, fragile titlebar spacing, and routes that only look correct on one window size.

**Why it is likely here:**
The feedback is precise: macOS already has system traffic lights, and the app should not fight them. Existing Electron shells often drift into page-specific compensation instead of one platform-aware contract.

**Milestone-specific warning signs:**
- right-side duplicate window controls survive on macOS after "native" fixes;
- individual routes add bespoke top spacing to avoid shell overlap;
- drag regions, safe areas, and titlebar behavior differ by screen;
- reopen/restart flows restore a shell state that does not match the current platform expectations.

**Concrete prevention strategies:**
- Move macOS shell rules into one platform-aware shell contract owned centrally, not per route.
- Remove duplicate macOS controls instead of visually restyling both sets.
- Test native behavior with reopen/restart, focus restore, narrow widths, and modal states.
- Treat shell-safe geometry as a reusable invariant, not as per-page CSS cleanup.

**Phase owner:**
Phase 28

---

### Pitfall 3: Leaving modpack-specific urgency in the global shell

**What goes wrong:**
Modpack update state keeps leaking into the app shell, dashboard, or top-level messaging. Users get launcher-wide urgency for a local modpack property, and the shell starts competing with the actual thing they want to launch.

**Why it is likely here:**
The feedback explicitly rejects global update banners and asks for local, optional update UX. This is a classic shipped-launcher mistake: one object-level state becomes a shell-level interruption because it is easy to surface globally.

**Milestone-specific warning signs:**
- dashboard or home surfaces still advertise specific modpack updates globally;
- the shell exposes update pressure even when no relevant modpack is selected;
- "update available" visually competes with or outranks the primary launch action;
- the team talks about "making updates more visible" without saying where that visibility should live.

**Concrete prevention strategies:**
- Define a locality rule: modpack updates belong in modpack list/detail surfaces, not in route-unrelated shell zones.
- Keep launch as the default primary intent unless the user explicitly enters an update flow.
- Use calm indicators in list/detail views instead of global banners or shell-level warnings.
- Validate the design against large libraries: 10, 50, and 100 installed modpacks should still feel quiet.

**Phase owner:**
Phase 28

---

### Pitfall 4: Simplifying modpack UI by subtracting fields without fixing truth

**What goes wrong:**
Cards, list rows, and headers become visually smaller, but the underlying semantics stay wrong. The launcher looks cleaner while still lying about loader, version, dependencies, or health state.

**Why it is likely here:**
Current feedback wants fewer details in cards and less noisy composition, but the QA audit also shows conflicting modloader truth, broken dependency semantics, and raw version-range leakage. Visual compression alone does not solve that.

**Milestone-specific warning signs:**
- list cards show fewer facts, but detail screens still contradict them;
- badges remain red even when everything is actually satisfied;
- version or dependency strings still look like debug output;
- "vanilla" or loader summary text remains contextually wrong after layout cleanup.

**Concrete prevention strategies:**
- Define canonical truth sources for loader, runtime version, dependency state, and update state before redesigning the rows.
- Decide which facts belong in list cards and which belong only in detail views.
- Normalize badge semantics: neutral for healthy, warning for caution, red only for actual failure.
- Add explicit review cases for base dependencies like Minecraft and Forge to avoid false absence states.

**Phase owner:**
Phase 29

---

### Pitfall 5: Reworking modpack details route-by-route instead of creating one tab contract

**What goes wrong:**
The team makes `Mods` better, then adjusts `Resource Packs`, then `Shaders`, then `Worlds`, each with slightly different containers, spacing, empty states, and action placement. The tab set remains hard to discover and feels authored by multiple people.

**Why it is likely here:**
The feedback directly calls out low tab discoverability, scroll fights, and inconsistent visual language across content tabs. Once a launcher has already shipped, the fastest fix is often per-tab surgery, which usually makes cross-tab consistency worse.

**Milestone-specific warning signs:**
- tabs still overflow into awkward horizontal scroll with no stronger pattern;
- switching tabs changes header density, action placement, or content width rules;
- `Mods`, `Resourcepacks`, `Shaders`, `Worlds`, and `Screenshots` still feel like different products;
- useful tab content keeps living below large summary/action blocks.

**Concrete prevention strategies:**
- Build one reusable tab-shell contract for header, actions, summary strip, empty state, and content container.
- Keep tab switching and tab reading above the fold on standard desktop sizes.
- Test tab discoverability in Russian and at narrower widths before approving the layout.
- Require every content tab to adopt the same density, hierarchy, and empty-state rules unless there is a documented exception.

**Phase owner:**
Phase 29

---

### Pitfall 6: Making async modpack flows look calmer while keeping reload-based recovery

**What goes wrong:**
Errors become better styled, but the workflow logic still depends on hard reloads, unclear failures, and unstable button placement. The launcher appears more polished while the user still cannot understand why a flow failed or how to recover.

**Why it is likely here:**
The codebase concerns already flag full-page reload recovery in modpack flows. The product feedback also calls out unexplained create failures, confirm buttons that move away during infinite loading, and visible flicker when switching active modpacks.

**Milestone-specific warning signs:**
- success or failure paths still use full renderer reloads as the main recovery mechanism;
- async flows still collapse into generic "something went wrong" copy;
- confirm actions move because the list beneath them keeps loading;
- active modpack selection still flickers or rerenders multiple times during state changes.

**Concrete prevention strategies:**
- Replace reload-driven state sync with explicit local/shared state transitions for install, import, create, and add-mod flows.
- Pin confirmation actions so infinite lists cannot push them away.
- Map known failure categories to user-understandable copy: compatibility, loader conflict, network, filesystem, or dependency issue.
- Require async flows to expose retry, cancel, and recovery next steps without losing local context.

**Phase owner:**
Phase 29

---

### Pitfall 7: Cleaning settings visually without proving control truth

**What goes wrong:**
The settings surface loses some noise and gains better alignment, but the actual controls still lie. Presets remain unpredictable, sliders and toggles stay visually inconsistent, and low-value controls continue pretending to do something meaningful.

**Why it is likely here:**
The product feedback is not mainly about settings beauty. It is about settings trust: preset behavior that does not match visible results, duplicate descriptions, controls with weak or invisible effect, and broken geometry.

**Milestone-specific warning signs:**
- preset changes only become visible after unrelated theme toggles;
- switching between presets changes dark/light mode in surprising ways;
- toggles, sliders, and pills still do not share the same geometry contract;
- settings copy is cleaned up while controls with no meaningful visible result remain in place.

**Concrete prevention strategies:**
- Create a settings truth matrix: each control must state its visible effect, persistence rule, and interaction with other controls.
- Remove or reword controls whose effect is too weak to be honest.
- Make preset themes deterministic by defining whether they own palette only, palette plus mode, or the full visual package.
- Verify control alignment and geometry through shared components instead of route-local CSS fixes.

**Phase owner:**
Phase 30

---

### Pitfall 8: Expanding personalization before the launcher earns trust back

**What goes wrong:**
The milestone starts adding `CUSTOM-01` polish, extra presets, or decorative appearance options before the existing settings become truthful. This grows the surface area of confusion instead of reducing it.

**Why it is likely here:**
Once a redesign has shipped, adding more personalization options is tempting because it feels like forward motion. In this milestone, that instinct is dangerous because the current complaint is "settings are noisy and misleading," not "there are not enough choices."

**Milestone-specific warning signs:**
- new presets or appearance options land while old ones still have ambiguous behavior;
- the team talks about customization delight before closing preset truth and geometry consistency;
- settings cleanup becomes mixed with cosmetic expansion in the same phase;
- the phase cannot clearly say which controls were removed because they were not honest.

**Concrete prevention strategies:**
- Gate `CUSTOM-01` behind a passed settings-truth checklist.
- Require one of three outcomes for every existing appearance control: keep and prove, reword honestly, or remove.
- Separate trust-restoration tasks from optional delight tasks in planning and review.
- Make new personalization work prove user value beyond "more options."

**Phase owner:**
Phase 30

---

### Pitfall 9: Calling resource-pack and shader flows "guided" while still detouring into Finder or Explorer

**What goes wrong:**
The launcher adds new entry points or nicer wrappers, but the actual workflow still throws the user into the system file manager or a raw picker. The product remains a thin shell around local file operations rather than a guided in-app flow.

**Why it is likely here:**
The feedback explicitly rejects the current OS-file-manager detour and asks for real in-app browser flows. Existing desktop launchers often stop halfway by adding one more import button instead of designing the acquisition/install path.

**Milestone-specific warning signs:**
- the "new" flow still ends in a raw file picker as the default path;
- content install starts without showing source, target, or compatibility context;
- the workflow assumes the user already knows the right file type, folder, and loader constraints;
- errors still read like filesystem or importer failures rather than guided product feedback.

**Concrete prevention strategies:**
- Make in-app browse/import the primary flow and demote raw local import to an explicit secondary option.
- Show what is being installed, where it will go, and why it is or is not compatible before commit.
- Use step-based guidance: select source, inspect compatibility, confirm install, recover if needed.
- Treat OS dialogs as escape hatches, not the core experience.

**Phase owner:**
Phase 31

---

### Pitfall 10: Shipping content browsers without compatibility truth and recoverable failure paths

**What goes wrong:**
Resource-pack and shader flows become broader, but users still do not know whether a shader requires a specific modloader or whether a content package is installable in the active instance. When something fails, the flow stops without a clear recovery path.

**Why it is likely here:**
The feedback asks exactly these questions: are shaders universally installable, what are the constraints, and why do resource packs still error? Expansion without compatibility truth will deepen distrust faster than the old minimal flow did.

**Milestone-specific warning signs:**
- shader flows do not explain loader/runtime prerequisites before install;
- resource-pack errors still appear as generic failure states;
- retry means restarting the whole flow instead of correcting the mismatch;
- the UI cannot distinguish unsupported content, temporary failure, and already-installed state.

**Concrete prevention strategies:**
- Add compatibility summaries before install: supported runtime, loader expectations, conflicts, and likely requirements.
- Normalize failure modes into clear categories with tailored recovery actions.
- Keep install flows resumable so a user can change a choice instead of starting over.
- Validate the flow against both happy path and wrong-content path, especially on modpack-heavy instances.

**Phase owner:**
Phase 31

---

### Pitfall 11: Letting content expansion reintroduce the performance and freeze problems users already tolerate elsewhere

**What goes wrong:**
New guided content flows feel richer, but they block the main process during scans, imports, or archive work. Users perceive the launcher as hanging exactly when the new feature is supposed to feel safer and more guided.

**Why it is likely here:**
The codebase concerns already call out synchronous filesystem and ZIP-heavy work in the Electron main process. Resource-pack and shader flows are the kind of capability expansion that often piles onto that same execution model.

**Milestone-specific warning signs:**
- importing or scanning content causes visible UI stalls;
- progress states feel frozen or jump from idle to done;
- the window becomes unresponsive during large local imports;
- "guided" flows still behave like blocking maintenance operations.

**Concrete prevention strategies:**
- Design content flows around async job execution with explicit progress and cancellation.
- Keep large scans and archive work off the user-perceived critical path when possible.
- Test large local imports and retry paths before treating the browser flow as shippable.
- Do not treat main-thread blocking as acceptable just because `PERF-01` is deferred; avoid introducing new stalls in `v0.6.0`.

**Phase owner:**
Phase 31

## "Looks Fixed But Isn't" Checklist

- [ ] Shell cleanup removed noise instead of replacing it with different noise.
- [ ] macOS behavior is truly more native and no route depends on its own titlebar-offset hack.
- [ ] Modpack updates are local to the relevant modpack surfaces and do not hijack primary launch intent.
- [ ] Modpack cards got smaller without losing truthful loader/version/dependency semantics.
- [ ] Tab discoverability works without scroll fights and the content tabs share one visual contract.
- [ ] Async create/import/add-mod flows recover without full-page reload and explain failure causes.
- [ ] Settings presets produce deterministic visible results and dead appearance controls were removed or reworded.
- [ ] `CUSTOM-01` did not start before settings truth was proven.
- [ ] Resource-pack and shader flows are actually guided in-app flows, not renamed file-manager detours.
- [ ] Compatibility guidance appears before install, not only after failure.
- [ ] New content flows do not freeze the window during realistic imports.

## Risk Ownership Summary

| Risk | Owning phase | Why that phase should own it |
| --- | --- | --- |
| Overbranding and shell overcorrection | Phase 28 | This is top-level restraint work and must be solved before deeper flow cleanup |
| Non-native macOS shell behavior | Phase 28 | Platform shell truth belongs at the shared shell layer, not in route follow-up |
| Global modpack update noise | Phase 28 | The mistake is shell-level leakage of local state |
| Smaller UI but still false modpack semantics | Phase 29 | This is the phase that owns runtime truth in list/detail seams |
| Cross-tab inconsistency and tab discoverability failures | Phase 29 | The detail/content-tab contract belongs with modpack workflow simplification |
| Async flow calmness without real recovery | Phase 29 | Create/add-mod/import behavior is a modpack workflow responsibility |
| Settings cleanup without truthful behavior | Phase 30 | This phase exists to make settings honest, not merely prettier |
| Personalization expansion before trust recovery | Phase 30 | The phase boundary explicitly says bounded `CUSTOM-01` only after truth is restored |
| Guided content flows that are still system detours | Phase 31 | This is the expansion seam and must redefine the workflow, not just rename it |
| Missing compatibility guidance and weak recovery in content flows | Phase 31 | This is the main user-value promise of the new browser flows |
| Content-browser freezes or blocking operations | Phase 31 | The expansion should not introduce new trust regressions while `PERF-01` stays deferred |

## Sources

- `/Users/kszinikov/fmcl/.planning/PROJECT.md`
- `/Users/kszinikov/fmcl/.planning/MILESTONES.md`
- `/Users/kszinikov/fmcl/.planning/codebase/CONCERNS.md`
- `/Users/kszinikov/fmcl/docs/ru/product-feedback-2026-04-20.md`
- `/Users/kszinikov/fmcl/docs/ru/ui-qa-audit-2026-04-14.md`

---
*Pitfalls research for FMCL milestone `v0.6.0 Feedback-Driven Stabilization And Expansion`*
