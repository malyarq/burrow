# FriendLauncher (FMCL)

## Current State

**Latest shipped milestone:** `v0.4.0` — Launcher Truth And Product Polish (`2026-04-17`)

FMCL is now a shipped desktop Minecraft launcher with truthful launch-state surfaces, corrected modpack dependency semantics, coherent catalog and compact-navigation polish, localized appearance preset naming, a reusable browser-backed verification seam, and a green packaging-aware repository gate.

## Next Milestone Goals

The next milestone is not defined yet. Likely planning candidates are:

- Promote the deferred future requirements (`LAUNCH-F01`, `DETAIL-F01`, `CATALOG-F01`, `SET-F01`) into a fresh scoped milestone only if they still fit the product direction.
- Decide whether the remaining large-renderer-chunk warning should become explicit build/performance work.
- Start the next planning cycle with `$gsd-new-milestone` so requirements and roadmap state are recreated from scratch instead of extended from archived `v0.4.0` documents.

## What This Is

FriendLauncher is an Electron-based Minecraft launcher focused on modpack-heavy desktop workflows, with built-in P2P multiplayer through FriendTunnel. It combines instance management, modpack browsing, content-management tools, settings and account flows, and multiplayer sharing into one local-first desktop application.

## Core Value

Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## Context

- Current codebase remains centered on `electron/`, `src/`, and `shared/`.
- Current shipped launcher truth is documented in:
  - `.planning/milestones/v0.2.0-ROADMAP.md`
  - `.planning/milestones/v0.2.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.2.0-MILESTONE-AUDIT.md`
  - `.planning/milestones/v0.3.0-ROADMAP.md`
  - `.planning/milestones/v0.3.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.3.0-MILESTONE-AUDIT.md`
  - `.planning/milestones/v0.4.0-ROADMAP.md`
  - `.planning/milestones/v0.4.0-REQUIREMENTS.md`
  - `.planning/phases/18-verification-and-release-truth/18-VERIFICATION.md`
- The launcher now has a reusable browser-backed manual verification seam for milestone walkthroughs.
- Screenshot-backed defects for this milestone are captured in `docs/ru/ui-qa-audit-2026-04-14.md` and the linked `screens/` attachments.
- Remaining non-blocking debt after `v0.4.0`:
  - large renderer chunk warning in production build
  - no standalone `v0.4.0-MILESTONE-AUDIT.md`; archive relies on the shipped Phase 18 verification artifact instead

## Constraints

- Preserve the Electron + React + TypeScript + TailwindCSS + Vite architecture unless a future milestone explicitly changes that.
- Keep shared IPC contracts, preload bridges, and renderer IPC wrappers as the preferred integration pattern.
- Maintain green quality gates for `npm test`, `npm run lint`, and `npx tsc --noEmit`.
- Keep EN/RU user-facing strings synchronized when launcher behavior changes.
- Keep `v0.4.0` bounded to shipped bug-fix and polish work on current launcher surfaces, not new product-feature expansion.
- Treat public docs as part of shipped truth, not afterthought cleanup.

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

## Archived Milestone Definitions

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
*Last updated: 2026-04-17 after v0.4.0 milestone*
