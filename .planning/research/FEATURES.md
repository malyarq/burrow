# Feature Research

**Domain:** Brownfield modpack-first desktop Minecraft launcher release milestone
**Researched:** 2026-04-12
**Confidence:** HIGH

## Release Frame

FMCL already has broad launcher coverage. This milestone is not about inventing a bigger product; it is about making the existing modpack-first desktop launcher releasable.

The release definition is driven by six mandatory buckets from `PROJECT.md`:

1. Critical bugs and code-quality regressions
2. Automated tests for critical paths
3. Remaining roadmap gaps that materially affect modpack workflows
4. Accessibility baseline
5. Documentation parity
6. Security hardening

For this milestone, the right feature question is not "what else could a launcher do?" but "what must be finished or protected so modpack users can trust FMCL as their daily launcher?"

## Feature Landscape

### Table Stakes

**Category complexity:** HIGH

**Category dependencies:**
- Stability work is the gate for meaningful testing, accessibility verification, and release confidence.
- Roadmap gap closure should stay inside existing FMCL surfaces, not create new product areas.
- Documentation and release notes should follow shipped behavior, not planned behavior.

| Feature | Why Expected In This Milestone | Complexity | Dependency Notes |
|---------|-------------------------------|------------|------------------|
| Stable React, TypeScript, and ESLint baseline | Known hook and runtime issues make the launcher feel unsafe before users even reach modpack workflows | MEDIUM | Must happen before broad verification; directly tied to `docs/KNOWN_ISSUES.md` |
| Critical-path automated tests for modpack/content/share flows | A brownfield release without regression coverage is likely to break install, import, update, or share flows during cleanup work | HIGH | Depends on stabilized modules; start with `modpackService`, `contentManager`, `shareService`, and formatting utilities |
| Complete core instance management from list surfaces | Modpack-first users expect duplicate and rename flows without manual filesystem workarounds | MEDIUM | Builds on already shipped instance cards and context actions |
| Complete modpack discovery continuity | Recent-view history and configurable pagination are basic usability requirements once the browser already exists and catalog size is large | MEDIUM | Depends on current browser filters, persistence, and view-state handling |
| Persistent disk caching for modpack imagery | Re-downloading covers and previews every session makes the launcher feel unfinished and slow | MEDIUM | Depends on safe cache-path handling, invalidation, and storage settings |
| Accessibility baseline for desktop interaction | Screen-reader semantics, keyboard traversal, contrast, and reduced motion are part of release readiness, not polish | HIGH | Best done after core UI bugs are fixed; likely touches shared UI primitives and layout components |
| Documentation parity across README, EN/RU roadmap, and IPC maps | Brownfield drift already exists; wrong docs create support load and false expectations about what is done | LOW-MEDIUM | Depends on final shipped scope; must be updated after feature truth is settled |
| Security hardening across IPC, path handling, XSS exposure, and Electron window settings | Electron launchers are high-risk if process boundaries and filesystem inputs are too permissive | HIGH | Cross-cuts preload bridges, IPC contracts, main-process handlers, and renderer content surfaces |

### Differentiators

**Category complexity:** MEDIUM

**Category dependencies:**
- These only pay off if table stakes are green first.
- The milestone should deepen FMCL's existing strengths, not invent new platform bets.
- Differentiators should remain local-first and launcher-centric.

| Feature | Value In This Milestone | Complexity | Dependency Notes |
|---------|-------------------------|------------|------------------|
| Skin management on top of existing multi-account support | Finishes the custom-account story for modded and private-server users instead of stopping at login switching | MEDIUM | Depends on current account management and secure file/import validation |
| Mirror fallback and user-controlled priority | Converts the current mirror system from "fast when it works" into a reliability advantage for large modpack downloads | MEDIUM | Depends on existing mirror speed testing and download retry plumbing |
| Lightweight local stats uplift with export | Popular packs, usage charts, and export can help users manage their own launcher habits without turning FMCL into a cloud analytics product | MEDIUM | Depends on current per-instance and play-time stats; export must stay local and privacy-safe |
| Protect FriendTunnel and cross-launcher interoperability during release work | These are already meaningful FMCL differentiators; the release should avoid regressing them while hardening the rest of the app | MEDIUM-HIGH | Depends more on tests, docs, and security review than on net-new UI work |

### Anti-Features / Defer

**Category complexity:** HIGH if pursued

**Category dependencies:**
- Most of these compete directly with stabilization budget.
- Several require backend, moderation, or long-tail maintenance that the milestone does not budget for.
- Pursuing them now would increase surface area faster than release confidence.

| Feature | Why Requested | Why Problematic In This Milestone | Better Alternative |
|---------|---------------|-----------------------------------|--------------------|
| Cloud sync and hosted profiles | Feels modern and convenient for multi-device play | Adds backend, auth, conflict resolution, privacy, and support burden while the local launcher still needs release hardening | Keep local import/export and share-code flows reliable and documented |
| Rewrite away from Electron/React/current IPC architecture | Sounds like a clean way to solve old code problems | Resets brownfield progress, delays release, and creates new regression classes without solving the immediate shipping gap | Hardening and cleanup inside the current architecture |
| Full social platform around FriendTunnel | Lobbies, presence, and cloud matchmaking sound exciting | Turns a launcher differentiator into a backend product with security and moderation overhead | Keep direct friend play reliable, documented, and well tested |
| Broad new skin-provider matrix | More providers appear to widen compatibility | Expands maintenance surface before the base skin-management flow is complete | Finish core skin upload/manage flow first, then expand providers later |
| More visual customization beyond accessibility-safe fixes | Visible UI additions are easy to market | Competes with accessibility, performance, and bug-fix work while Phase 5 is already largely shipped | Restrict UI work to fixes that improve clarity, contrast, and reduced-motion behavior |
| Additional languages beyond EN/RU | Broadens theoretical audience | Translation QA and maintenance multiply while even EN/RU docs parity is still open | Finish EN/RU parity and release guidance before adding more locales |

## Feature Dependencies

```text
[Stable code-quality baseline]
    └──enables──> [Critical-path tests]
                        └──protect──> [FriendTunnel, mirrors, import/export, skin flows]

[Security hardening]
    ├──overlaps──> [Image disk caching]
    ├──overlaps──> [Skin upload/import]
    └──overlaps──> [Mirror fallback and priority]

[Core modpack workflow completion]
    └──precedes──> [Docs parity and release guidance]

[Accessibility baseline]
    └──depends on──> [Shared UI primitives and stable interaction patterns]

[Cloud sync / rewrite / social-platform work]
    └──conflicts with──> [Stable release budget]
```

### Dependency Notes

- **Stable code-quality baseline requires early completion:** fixing known hook, state, and typing issues should happen before test additions and before any final release audit.
- **Critical-path tests protect differentiators indirectly:** FMCL already has valuable features; the immediate need is to stop hardening work from breaking them.
- **Security hardening is not isolated work:** cache paths, skin uploads, mirror selection, and IPC validation all touch the same trust boundaries.
- **Docs parity must follow actual shipped behavior:** updating roadmap and README too early will just create another drift cycle.
- **Accessibility depends on shared component cleanup:** adding ARIA or keyboard support one screen at a time is fragile if base primitives still have unstable behavior.

## Milestone Cut Line

### Must Ship In This Release

- [ ] Stable lint/type/hook baseline with the current critical issues removed
- [ ] Regression tests for release-critical modpack, content, and share flows
- [ ] Core remaining modpack workflow gaps closed: instance duplicate/rename, discovery history, configurable pagination, image disk caching
- [ ] Accessibility baseline for keyboard, screen-reader semantics, contrast, and reduced motion
- [ ] Documentation parity across README, EN/RU roadmap, and contract mapping
- [ ] Security hardening for IPC, filesystem inputs, XSS exposure, and Electron window settings

### Ship If The Baseline Stays Green

- [ ] Skin management within the already-supported account system
- [ ] Mirror fallback and mirror-priority controls
- [ ] Local stats improvements such as popular packs, simple usage charts, and export

### Explicitly Defer

- [ ] Cloud sync or hosted launcher profiles
- [ ] Architecture rewrite or framework migration
- [ ] Expanded social platform beyond current share and P2P flows
- [ ] Large new provider matrix for skins before core skin management is solid
- [ ] Extra locale rollout beyond EN/RU
- [ ] New customization surfaces that do not improve release readiness

## Sources

- `.planning/PROJECT.md`
- `docs/ru/roadmap.md`
- `docs/KNOWN_ISSUES.md`
- `~/.codex/get-shit-done/templates/research-project/FEATURES.md`

---
*Feature research for: FMCL remaining release work*
*Researched: 2026-04-12*
