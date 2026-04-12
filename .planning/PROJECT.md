# FriendLauncher (FMCL)

## Current Milestone: v0.2.0 UI System And Experience Rework

**Goal:** Turn FMCL into a visually coherent, theme-correct, fully translated, and meaningfully polished launcher with a deliberate UI system instead of ad hoc screen-by-screen styling.

**Target features:**
- Unify the launcher visual language across shared components and major launcher surfaces so blocks, spacing, typography, icons, and states feel like one product.
- Eliminate visible UI correctness gaps such as missing translations, placeholder text, absent icons, broken theme switching, and inconsistent component styling.
- Redesign core launcher UX where needed and pull the remaining secondary surfaces into the same system so the launcher feels intentionally convenient and attractive end to end.
- Verify the refreshed experience manually through real browser runs in addition to the normal repository quality gates.

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

- [ ] Build a coherent UI system for FMCL across shared shells, cards, forms, dialogs, themes, icons, and typography instead of the current mixed visual language
- [ ] Fix visible UI correctness problems such as untranslated placeholder text, missing icons, broken theme application, and inconsistent component states across English and Russian
- [ ] Redesign key launcher flows where needed so the product feels intentionally convenient and attractive rather than only technically functional
- [ ] Treat manual browser-based UI verification as a first-class milestone requirement alongside the standard automated repository gates

### Out of Scope

- Mobile launcher clients — FMCL is a desktop Electron product and the current cycle is about finishing and hardening that product
- Backend-heavy social or cloud platform features beyond the current launcher/share model — they would expand scope away from launcher stability and local-first workflows
- Rewriting the application away from Electron, React, TypeScript, or the current IPC architecture — this is a brownfield stabilization milestone, not a platform rewrite
- Large backend or protocol changes unrelated to launcher presentation and usability — this milestone is about UI/UX and design-system quality on top of the current feature surface

## Context

- The project is an existing brownfield codebase with an established architecture split across `electron/`, `src/`, and `shared/`, plus a codebase map under `.planning/codebase/`
- The Russian roadmap in `docs/ru/roadmap.md` is the most accurate functional inventory; the English roadmap is behind and must be synchronized
- `docs/KNOWN_ISSUES.md` identifies current lint/hook issues, missing test coverage, and documentation drift; these are part of the active scope, not side notes
- The product already includes differentiators that matter to this project, especially FriendTunnel P2P multiplayer, broad modpack interoperability, and deep content management
- Audience for the current stage is modpack users first; the launcher still supports simple-play workflows, but modpack management is the primary product lens
- The previous milestone closed release-hardening and audit recovery work; the next gap is product coherence and perceived quality, not another hardening-only pass
- Manual UI review through a real browser run is part of the milestone definition, not an optional polish step

## Constraints

- **Tech stack**: Electron + React + TypeScript + TailwindCSS + Vite — preserve the current platform and improve within it
- **Architecture**: Shared IPC contracts, preload bridges, and renderer IPC wrappers remain the preferred integration pattern — avoid new direct `window.*` calls in UI code
- **Quality gates**: `npx tsc --noEmit` must pass and `npx eslint src/` must have 0 errors — release readiness depends on these staying green
- **Localization**: User-facing strings must remain synchronized in `src/locales/en.json` and `src/locales/ru.json` — features are not done until both locales are updated
- **Documentation**: Roadmap and IPC contract documentation must stay current in RU and EN — brownfield drift has already created confusion
- **Security**: Electron security posture, IPC input validation, and filesystem safety must be reviewed without weakening current functionality
- **Testing bar**: The milestone must include hands-on browser verification of the redesigned UI, not only static or automated checks

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Make `v0.2.0` a UI-system-first milestone | The next product gap is inconsistency and perceived quality across the launcher, not missing base capability | Locked |
| Allow strong UX redesign inside existing architecture | The user explicitly wants a fuller and more deliberate launcher experience, not only cosmetic bugfixes | Locked |
| Keep the work brownfield-safe | The milestone should improve the current Electron/React launcher rather than reset platform or feature scope | Locked |
| Require manual browser verification in addition to repo gates | The milestone is specifically about real UI/UX quality, which cannot be judged from static code checks alone | Locked |
| Continue treating FMCL as a modpack-first launcher | Existing product value and the user’s goal still center on making the launcher itself feel coherent for everyday modpack use | Locked |

---
*Last updated: 2026-04-13 after v0.2.0 research and roadmap definition*
