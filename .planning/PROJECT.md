# FriendLauncher (FMCL)

## Current Milestone: v0.3.0 Adaptive UX Hardening And Launcher Ergonomics

**Goal:** Make FMCL feel predictable, adaptive, and trustworthy in day-to-day use by fixing layout instability, broken theme behavior, overloaded settings navigation, unclear launch feedback, and weak modpack UX seams.

**Target features:**
- make the launcher adaptive to different window sizes and density settings without broken sizing, clipped menus, or inconsistent visual rhythm
- repair the theme preset system so light and dark presets apply correctly, safely, and consistently across all refreshed surfaces
- simplify information architecture in settings and related flows so users do not get trapped in nested tabs and hidden actions
- make launch and background task progress explicit so users understand what is happening and stop spam-clicking during long operations
- improve modpack creation, dependency visibility, browser usability, and other user-critical launcher ergonomics based on pain points and competitive research

## Current State

**Latest shipped milestone:** `v0.2.0` — UI System And Experience Rework (`2026-04-13`)

FMCL is now a shipped desktop Minecraft launcher with a shared UI system across the core and secondary launcher surfaces, synchronized EN/RU release-facing copy, browser-backed manual verification for milestone-owned routes, and a green packaging-aware repository gate.

## What This Is

FriendLauncher is an Electron-based Minecraft launcher focused on modpack-heavy desktop workflows, with built-in P2P multiplayer through FriendTunnel. It combines instance management, modpack browsing, content-management tools, settings and account flows, and multiplayer sharing into one local-first desktop application.

## Core Value

Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## Next Milestone Goals

- Ship a UX-hardening release instead of another visual refresh-only pass.
- Remove the most obvious trust breakers: broken preset themes, placeholder surfaces, inconsistent controls, and unclear progress states.
- Use competitive launcher patterns selectively where they improve clarity or capability, without turning the milestone into an unbounded feature clone.

## Context

- Current codebase remains centered on `electron/`, `src/`, and `shared/`.
- Current shipped UI truth is documented in:
  - `.planning/milestones/v0.2.0-ROADMAP.md`
  - `.planning/milestones/v0.2.0-REQUIREMENTS.md`
  - `.planning/milestones/v0.2.0-MILESTONE-AUDIT.md`
- The launcher now has a reusable browser-backed manual verification seam for milestone walkthroughs.
- Remaining non-blocking debt after `v0.2.0`:
  - large renderer chunk warning in production build
  - missing `description` and `author` in `package.json`
- New user-reported pain points after `v0.2.0`:
  - non-adaptive layout and inconsistent button or row sizing across surfaces
  - preset themes behaving incorrectly across light and dark modes
  - overly nested settings navigation
  - weak transparency during launch or background operations
  - unreliable dependency visibility in modpack creation and awkward modpack-browser ergonomics
  - placeholder assets still leaking on some classic or easter-egg surfaces

## Constraints

- Preserve the Electron + React + TypeScript + TailwindCSS + Vite architecture unless a future milestone explicitly changes that.
- Keep shared IPC contracts, preload bridges, and renderer IPC wrappers as the preferred integration pattern.
- Maintain green quality gates for `npm test`, `npm run lint`, and `npx tsc --noEmit`.
- Keep EN/RU user-facing strings synchronized when launcher behavior changes.
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
| Make `v0.3.0` a UX-hardening milestone before adding broad new launcher scope | The current gap is reliability of interaction design and product ergonomics, not lack of raw surface area | Pending |
| Use competitor research as input, not as a mandate to clone other launchers | FMCL should adopt proven patterns where they reduce user pain without losing product focus | Pending |

## Archived Milestone Definition

<details>
<summary>v0.2.0 milestone definition before archive</summary>

The shipped milestone focused on turning FMCL into a visually coherent, theme-correct, fully translated, and meaningfully polished launcher with a deliberate UI system instead of ad hoc screen-by-screen styling.

Primary requirements that were active before archive:

- coherent UI system across shared shells, cards, forms, dialogs, themes, icons, and typography
- visible UI correctness fixes across English and Russian
- stronger launcher flow design for core and secondary surfaces
- manual browser-based UI verification as part of completion

</details>

---
*Last updated: 2026-04-13 after starting v0.3.0 milestone*
