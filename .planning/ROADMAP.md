# Roadmap: FriendLauncher (FMCL)

## Milestones

- ✅ **v0.2.0 UI System And Experience Rework** — Phases 7-10, shipped 2026-04-13. Archive: `.planning/milestones/v0.2.0-ROADMAP.md`
- ◆ **v0.3.0 Adaptive UX Hardening And Launcher Ergonomics** — Phases 11-14, active

## Current Milestone Overview

`v0.3.0` is a UX-trust release. The milestone focuses on fixing the places where FMCL still feels unreliable in everyday use: non-adaptive layouts, mixed control sizing, preset themes that do not apply truthfully, deep settings nesting, unclear launch progress, unstable modpack actions, and placeholder or fallback leaks on shipped surfaces.

## Phases

### Phase 11: Adaptive Layout And Interaction Foundations

**Goal:** FMCL adapts cleanly to different window sizes and density conditions, while shared controls, overlays, and fallback assets stop breaking trust.  
**Depends on:** Phase 10  
**Plans:** 4 plans

Plans:

- [x] 11-01: Normalize responsive shell and surface rhythm
- [x] 11-02: Harden anchored menus and overflow-safe overlays
- [x] 11-03: Close placeholder and asset-fallback truth gaps
- [x] 11-04: Run the adaptive layout integration gate and close Phase 11

**Details:**
- Establish consistent button/card sizing and responsive behavior across the highest-traffic launcher surfaces.
- Remove raw coordinate assumptions for menus and popovers, and close obvious placeholder/fallback leaks that undermine shipped polish.

### Phase 12: Theme Truth And Settings IA Simplification

**Goal:** Preset themes become reliable in light and dark mode, and settings stop feeling like nested navigation traps.  
**Depends on:** Phase 11  
**Plans:** 3/4 plans executed

Plans:

- [x] 12-01: Repair the preset theme application contract
- [x] 12-02: Close preset readability and contrast regressions
- [ ] 12-03: Simplify settings information architecture
- [ ] 12-04: Run the theme and settings integration gate and close Phase 12

**Details:**
- Make preset themes update the real launcher immediately and safely.
- Flatten common settings paths so users reach appearance, launcher, downloads, accounts, and utilities without excessive tab-inside-tab depth.

### Phase 13: Launch Trust And Modpack Workflow Ergonomics

**Goal:** Users understand what the launcher is doing during launch and can manage modpacks through truthful, lower-friction flows.  
**Depends on:** Phase 12  
**Plans:** 5 plans

Plans:

- [ ] 13-01: Model explicit launch stages and busy-state feedback
- [ ] 13-02: Surface truthful modpack creation dependencies
- [ ] 13-03: Improve modpack browser scanning, filtering, and adaptive density
- [ ] 13-04: Stabilize installed-modpack card actions and quick flows
- [ ] 13-05: Run the core UX trust gate and close Phase 13

**Details:**
- Turn launch progress into understandable product states instead of vague waiting.
- Fix dependency visibility in modpack creation and improve both remote browsing and installed-pack management ergonomics.

### Phase 14: Manual Verification And Release Truth

**Goal:** The milestone closes on resize-aware live experience evidence and truthful documentation instead of inferred confidence.  
**Depends on:** Phase 13  
**Plans:** 4 plans

Plans:

- [ ] 14-01: Record milestone-wide browser walkthroughs across adaptive sizes
- [ ] 14-02: Capture bounded future parity opportunities from live evidence
- [ ] 14-03: Refresh README and public roadmap truth
- [ ] 14-04: Run the final repo gate and publish verification artifacts

**Details:**
- Verify the milestone-owned flows through live browser passes at multiple window sizes.
- Close on truthful release-facing docs and a bounded list of future launcher ergonomics worth pursuing after `v0.3.0`.

---

## Milestone Summary

**Target outcomes:**

- Adaptive layout and interaction safety become part of the launcher's normal behavior, not lucky default-window behavior.
- Theme presets work truthfully across light and dark mode without unreadable surfaces.
- Settings become flatter and easier to navigate for common tasks.
- Launching feels understandable and trustworthy instead of frozen or ambiguous.
- Modpack creation, browsing, and installed-pack actions feel more dependable and less awkward.

**Key decisions:**

- Keep the milestone inside the current Electron + React + TypeScript architecture.
- Treat competitor research as bounded input for trust and ergonomics improvements, not as a mandate to clone feature sets.
- Require live browser verification at multiple window sizes before claiming the milestone complete.

**Deferred to later milestones:**

- Richer launcher layout personalization and density presets beyond the adaptive default shell
- Dedicated activity-center UX for all downloads and background tasks
- Broader competitor parity outside the current trust and ergonomics gaps

---

For shipped historical scope, see `.planning/milestones/v0.2.0-ROADMAP.md`. For current requirements and traceability, see `.planning/REQUIREMENTS.md`.
