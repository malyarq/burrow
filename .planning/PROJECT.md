# FriendLauncher (FMCL)

## What This Is

FriendLauncher (FMCL) is an Electron-based Minecraft launcher focused on modpack-heavy desktop workflows, with built-in P2P multiplayer through FriendTunnel. It already covers most core launcher flows and is roughly 80% complete; the current cycle is about turning that broad feature set into a stable, tested, documented, accessible, and security-reviewed release for modpack users.

## Core Value

Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## Requirements

### Validated

- ✓ User can launch vanilla and modded Minecraft with Forge, Fabric, NeoForge, OptiFine, and offline/cracked account support — existing
- ✓ User can create, import, export, browse, update, and manage modpacks and instances across CurseForge, Modrinth, MultiMC, Prism Launcher, and ATLauncher formats — existing
- ✓ User can manage mods, resource packs, shaders, datapacks, worlds, screenshots, logs, Java settings, and launcher UI customization from the launcher — existing
- ✓ User can use FriendTunnel P2P multiplayer, custom accounts, mirrors, statistics, and share codes as part of the current product surface — existing

### Active

- [ ] Eliminate current critical stability and code-quality issues so the project returns to a clean React hooks, TypeScript, and ESLint baseline
- [ ] Establish Vitest and Testing Library coverage for critical service logic, starting with `modpackService`, `contentManager`, `shareService`, and formatting utilities
- [ ] Close all remaining roadmap gaps needed for the current release cycle, including instance duplicate/rename from list cards, modpack history and configurable pagination, image disk caching, skin management, mirror fallback and priority, and richer statistics/export
- [ ] Reach the current accessibility target for desktop use: ARIA coverage, keyboard navigation, sufficient contrast, and reduced-motion support
- [ ] Bring project documentation in sync across README, EN/RU roadmaps, and IPC contract maps
- [ ] Complete a practical security hardening pass across IPC validation, path handling, XSS exposure, and Electron window security settings

### Out of Scope

- Mobile launcher clients — FMCL is a desktop Electron product and the current cycle is about finishing and hardening that product
- Backend-heavy social or cloud platform features beyond the current launcher/share model — they would expand scope away from launcher stability and local-first workflows
- Rewriting the application away from Electron, React, TypeScript, or the current IPC architecture — this is a brownfield stabilization milestone, not a platform rewrite

## Context

- The project is an existing brownfield codebase with an established architecture split across `electron/`, `src/`, and `shared/`, plus a codebase map under `.planning/codebase/`
- The Russian roadmap in `docs/ru/roadmap.md` is the most accurate functional inventory; the English roadmap is behind and must be synchronized
- `docs/KNOWN_ISSUES.md` identifies current lint/hook issues, missing test coverage, and documentation drift; these are part of the active scope, not side notes
- The product already includes differentiators that matter to this project, especially FriendTunnel P2P multiplayer, broad modpack interoperability, and deep content management
- Audience for the current stage is modpack users first; the launcher still supports simple-play workflows, but modpack management is the primary product lens
- Success for the current milestone is a stable release, not merely adding more surface area

## Constraints

- **Tech stack**: Electron + React + TypeScript + TailwindCSS + Vite — preserve the current platform and improve within it
- **Architecture**: Shared IPC contracts, preload bridges, and renderer IPC wrappers remain the preferred integration pattern — avoid new direct `window.*` calls in UI code
- **Quality gates**: `npx tsc --noEmit` must pass and `npx eslint src/` must have 0 errors — release readiness depends on these staying green
- **Localization**: User-facing strings must remain synchronized in `src/locales/en.json` and `src/locales/ru.json` — features are not done until both locales are updated
- **Documentation**: Roadmap and IPC contract documentation must stay current in RU and EN — brownfield drift has already created confusion
- **Security**: Electron security posture, IPC input validation, and filesystem safety must be reviewed without weakening current functionality

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep the current cycle scoped to all six listed priority buckets | The remaining 20% spans stability, testing, roadmap gaps, accessibility, docs, and security; shipping only a subset would leave the release definition incomplete | — Pending |
| Optimize for a stable release, not pure feature count | The codebase already has broad coverage; the biggest risk is regressions and unfinished hardening work | — Pending |
| Treat FMCL as a modpack-first launcher | Existing validated functionality and remaining roadmap items are centered on modpack workflows more than vanilla-only play | — Pending |
| Continue as a brownfield improvement effort instead of a rewrite | The architecture and feature set already exist; a rewrite would delay release and reset risk | — Pending |
| Add automated tests with Vitest and React Testing Library | The repo currently lacks meaningful automated coverage, and service-level tests are the fastest leverage point | — Pending |

---
*Last updated: 2026-04-12 after initialization*
