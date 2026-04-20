# FriendLauncher (FMCL)

## Current State

**Latest shipped milestone:** `v0.5.0` — Experience Reinvention And Brand Reset (`2026-04-20`)
**Active milestone:** `v0.6.0` — Feedback-Driven Stabilization And Expansion (`2026-04-20`, Phase `28` complete)
**Audit status:** `v0.5.0` passed milestone audit with `23/23` requirements satisfied, Phases `19-27` verified, and Nyquist fully compliant.

FMCL is now a shipped desktop Minecraft launcher with stable shell geometry, explicit CTA ownership, a product-owned brand system, neutral artwork fallbacks, denser but clearer modpack flows, truthful theme and locale behavior, recovery-first degraded states, and deterministic closeout proof with screenshot regression coverage.

## Current Milestone: v0.6.0 Feedback-Driven Stabilization And Expansion

**Goal:** Ship one coherent release that removes the remaining product weirdness from live feedback, restores trust in core launcher and modpack flows, makes settings honest instead of noisy, and only then adds the next bounded content-flow expansion.

**Target features:**
- Product restraint and native shell truth across app-critical surfaces, fallback states, macOS window behavior, modpack-update visibility, and top-level runtime state after reopen or restart.
- Modpack workflow simplification and runtime truth across list, detail, tab, dependency, loader, version, and async action seams.
- Settings truth and honest personalization through real preset-theme behavior, consistent control geometry, removal of misleading appearance controls, and only bounded `CUSTOM-01`.
- Guided resource-pack and shader content browsers with compatibility guidance, recoverable failures, and only bounded `EXPAND-01`.

**Boundaries:**
- Treat the next public release as one milestone: `v0.6.0`, not pseudo-releases like `v0.5.1`, `v0.5.2`, and `v0.5.3`.
- Use internal phases `28-31` to structure execution instead of pretending intermediate public patches shipped.
- Keep `PERF-01` explicit but deferred until shell, modpack, and settings truth stop being the dominant product complaint.
- If intermediate artifacts are needed before release, prefer prerelease labels such as `0.6.0-alpha.*`, `0.6.0-beta.*`, or `0.6.0-rc.*`.

## What This Is

FriendLauncher is an Electron-based Minecraft launcher focused on modpack-heavy desktop workflows, with built-in P2P multiplayer through FriendTunnel. It combines instance management, modpack browsing, content-management tools, settings and account flows, and multiplayer sharing into one local-first desktop application.

## Core Value

Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## Context

- The codebase remains centered on `electron/`, `src/`, and `shared/`.
- Shipped milestone truth now lives in:
  - `.planning/milestones/v0.2.0-ROADMAP.md`
  - `.planning/milestones/v0.2.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.2.0-MILESTONE-AUDIT.md`
  - `.planning/milestones/v0.3.0-ROADMAP.md`
  - `.planning/milestones/v0.3.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.3.0-MILESTONE-AUDIT.md`
  - `.planning/milestones/v0.4.0-ROADMAP.md`
  - `.planning/milestones/v0.4.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.5.0-ROADMAP.md`
  - `.planning/milestones/v0.5.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.5.0-MILESTONE-AUDIT.md`
- The launcher now has one reusable closeout proof seam on `manual-verification.html` plus a milestone-owned screenshot regression lane.
- `v0.5.0` closed the redesign scope and its audit-trail recovery; there is no active milestone in progress.
- `v0.6.0` planning starts from the shipped redesign baseline and uses `docs/ru/product-feedback-2026-04-20.md` plus `docs/ru/ui-qa-audit-2026-04-14.md` as the primary scope inputs.
- Future scope should start from the shipped redesign baseline rather than reopening archived proof recovery or archive cleanup work.

## Constraints

- Preserve the Electron + React + TypeScript + TailwindCSS + Vite architecture unless a future milestone explicitly changes that.
- Keep shared IPC contracts, preload bridges, and renderer IPC wrappers as the preferred integration pattern.
- Maintain green quality gates for `npm test`, `npm run lint`, and `npx tsc --noEmit`.
- Keep EN/RU user-facing strings synchronized when launcher behavior changes.
- Treat public docs and closeout proof as part of shipped product truth, not post-release cleanup.
- Start the next milestone with fresh requirements instead of extending archived `v0.5.0` scope by inertia.

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| Make `v0.2.0` a UI-system-first milestone | The next product gap was inconsistency and perceived quality, not missing base capability | Validated in `v0.2.0` |
| Allow strong UX redesign inside the existing architecture | The product needed real experience improvements without a platform rewrite | Validated in `v0.2.0` |
| Keep FMCL modpack-first while preserving simple play | Existing user value still centers on everyday modpack use | Validated in `v0.2.0` |
| Require manual browser verification in addition to repo gates | UI-heavy milestones need real experience evidence, not only code-level confidence | Validated in `v0.2.0` |
| Reuse one manual verification entry across walkthrough waves | Avoid throwaway harnesses and keep milestone evidence on one seam | Validated in `v0.2.0` |
| Refresh public docs from walkthrough evidence before closeout | Release-facing docs should describe shipped behavior, not stale promises | Validated in `v0.2.0` |
| Make `v0.3.0` a UX-hardening milestone before adding broad new launcher scope | The current gap was reliability of interaction design and product ergonomics, not lack of raw surface area | Validated in `v0.3.0` |
| Use competitor research as input, not as a mandate to clone other launchers | FMCL should adopt proven patterns where they reduce user pain without losing product focus | Validated in `v0.3.0` |
| Express adaptive layout through shared shell and overlay seams | The launcher needed resilient resizing and overlay behavior without per-screen hacks | Validated in `v0.3.0` |
| Make launch truth and modpack ergonomics clearer inside existing flows first | The main UX gap was comprehension and reliability, not route explosion | Validated in `v0.3.0` |
| Capture future parity ideas as bounded follow-up, not silent scope creep | Evidence from live walkthroughs should inform later milestones without bloating current execution | Validated in `v0.3.0` |
| Make `v0.4.0` a screenshot-audited bug-fix and polish milestone | The next product gap is trust in the already-shipped launcher surface, not another round of new capability | Validated in `v0.4.0` |
| Bound `v0.4.0` to documented defects and directly related proven cleanup | The user asked for a deep polish pass, but the milestone still needed tight edges to stay buildable and reviewable | Validated in `v0.4.0` |
| Reuse `manual-verification.html` as the milestone proof seam | Shared browser-backed proof reduces closeout churn and keeps launch, detail, catalog, and settings evidence on one deterministic entry | Validated in `v0.4.0` |
| Keep final gate fallout limited to release-truth blockers | The milestone needed an explicit ship gate without reopening feature scope late in execution | Validated in `v0.4.0` |
| Make `v0.5.0` a redesign and brand-reset milestone on top of bug fixing | Product quality was degrading because visual judgment, brand usage, and fallback behavior were drifting, not just because of isolated bugs | Validated in `v0.5.0` |
| Start redesign work from shell and state invariants before broad surface migration | Prevent another route-by-route repaint cycle with local geometry hacks and conflicting CTA rules | Validated in `v0.5.0` |
| Treat logo usage, artwork fallback, empty states, and error states as milestone-owned product surfaces | These repeatedly visible seams were amplifying product drift and low-trust behavior | Validated in `v0.5.0` |
| Keep closeout proof on the existing manual seam and add explicit screenshot coverage | The milestone needed deterministic evidence, not another verification harness | Validated in `v0.5.0` |
| Recover missing audit evidence through explicit phases instead of hand-waving archive readiness | The archive needed honest proof recovery without reopening already-shipped implementation | Validated in `v0.5.0` |
| Treat the next release as one truthful milestone `v0.6.0` | Feedback points to one coherent release story, and pseudo-patch versions would misrepresent shipped history | — Pending |
| Start `v0.6.0` with shell restraint and native startup truth before deeper workflow cleanup | Live feedback still concentrated on shell trust, reopen truth, and top-level launcher noise rather than on missing expansion scope | Validated in Phase `28` |

## Archived Milestone Definitions

<details>
<summary>v0.5.0 milestone definition before archive</summary>

The shipped milestone focused on redesigning FMCL so the launcher feels intentional, distinctive, and high-quality while eliminating screenshot-backed bugs, product drift, and weak brand or fallback behavior.

Primary target areas before archive:

- harden the shared shell, CTA ownership, and dense-route geometry before visual migration
- reset branding, logo usage, and artwork fallbacks into one deliberate launcher language
- simplify dense modpack browse, detail, create, and edit flows into clearer information architecture
- make theme, accent, locale, degraded-state, and fatal-error behavior truthful and reviewable
- close on deterministic proof, screenshot regression coverage, release-truth sync, and audit-grade archive evidence

</details>

<details>
<summary>v0.4.0 milestone definition before archive</summary>

The shipped milestone focused on making FMCL's existing launcher surfaces trustworthy and cohesive through screenshot-audited bug fixing rather than new product expansion.

Primary target areas before archive:

- truthful launch and runtime status surfaces, including resilient launch artwork, synchronized progress or CTA state, and localized live status copy
- correct modpack detail integrity for dependency resolution, version-range presentation, and tab navigation across dense content areas
- polished catalog, settings, and navigation surfaces with complete localization, adaptive controls, and branded fallback states for missing imagery or compact layouts

</details>

<details>
<summary>v0.3.0 milestone definition before archive</summary>

The shipped milestone focused on turning FMCL into a more adaptive, truthful, and dependable desktop launcher by hardening day-to-day UX seams instead of only polishing visuals.

Primary requirements that were active before archive:

- adaptive layout, consistent sizing rhythm, and viewport-safe anchored overlays
- truthful preset themes with readable surfaces in light and dark mode
- flatter settings navigation for common tasks
- explicit launch and busy-state feedback
- dependable modpack creation, browsing, and installed-pack actions
- multi-size live verification and truthful release-facing docs

</details>

---
*Last updated: 2026-04-20 after completing Phase `28`*
