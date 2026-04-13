# Project Research: Pitfalls

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.3.0 Adaptive UX Hardening And Launcher Ergonomics`  
**Researched:** 2026-04-13  
**Confidence:** HIGH

## Question

What are the main ways this milestone could look “busy” in git while still failing to improve the real launcher UX?

## Primary Risks

### 1. Adaptive Work That Only Fits One Window Size

**Failure mode**
- Layout looks fixed at the developer's current window size
- Menus, button groups, or cards break once the user resizes or starts from different default bounds

**Current evidence**
- Modpack action menus are placed from raw coordinates and assumed width
- Multiple surfaces use fixed-feeling card/button proportions

**Prevention**
- Verify at several viewport sizes
- Prefer anchored overlays and responsive layout rules over hand-tuned offsets

**Likely phase**
- Phase 11

### 2. Theme Presets That Change State But Not Product Truth

**Failure mode**
- Preset selector updates stored values, but some real surfaces keep old assumptions
- Dark-mode presets fail until the user flips base theme manually
- Some inputs or cards end up white on white or white text on white surfaces

**Current evidence**
- User-reported preset failures
- Theme application currently sets a limited semantic variable set

**Prevention**
- Treat preset application as a tested contract
- Add readable-surface checks for cards, fields, overlays, and secondary text

**Likely phase**
- Phase 12

### 3. “Flattened” Settings That Still Feel Nested

**Failure mode**
- A tab is removed, but the same complexity survives inside collapsibles and embedded sub-sections
- Users still traverse tab -> section -> collapsible -> embedded editor to reach common actions

**Current evidence**
- `SettingsPage` already tabs top-level categories, while some tabs add multiple `CollapsibleSection` groups and even feature-level embedded panels

**Prevention**
- Redesign by user intent, not by preserving every existing grouping
- Separate common actions from advanced utilities

**Likely phase**
- Phase 12

### 4. Launch Feedback That Still Feels Frozen

**Failure mode**
- Backend emits progress, but the UI only shows a generic percent or stale status string
- Users can still click active controls because the launcher never clearly enters a guarded busy state

**Current evidence**
- `useLauncher` and `useLauncherIPC` expose limited product-level state
- User explicitly reports “looks hung, so I click everything”

**Prevention**
- Model launch stages explicitly
- Show busy/blocked states on the main action surface, not only in console/log output

**Likely phase**
- Phase 13

### 5. Dependency UX That Ignores Real Metadata

**Failure mode**
- Create/export/install flows show incomplete or misleading dependency information
- Required runtime dependencies like Minecraft or Forge disappear even though contracts already know them

**Current evidence**
- User reports missing Minecraft/Forge dependencies during modpack creation
- Shared contracts already model `minecraft` and loader/runtime information

**Prevention**
- Make dependency UI derive from typed metadata/contracts instead of local assumptions
- Distinguish required runtime dependencies from optional content

**Likely phase**
- Phase 13

### 6. Placeholder And Fallback Leaks Surviving Into Release

**Failure mode**
- Main happy path looks polished, but classic mode, easter eggs, or fallbacks still expose placeholders

**Current evidence**
- User reports placeholder leaks on classic main screen and easter egg

**Prevention**
- Treat asset/fallback review as release work, not a nice-to-have cleanup
- Include fallback paths in manual verification

**Likely phases**
- Phase 11 and Phase 14

### 7. Browser Verification That Proves Only One Polished Snapshot

**Failure mode**
- The team captures screenshots of the most polished route but does not verify resize behavior, launch feedback, or secondary UX branches

**Prevention**
- Record walkthroughs at multiple window sizes and through actual interaction flows
- Explicitly include classic, settings, launch, modpack browser, modpack creation, and menu/overlay checks

**Likely phase**
- Phase 14

## Anti-Patterns To Avoid

- Fixing one preset by special-casing one surface
- Rebuilding settings tabs without removing nested cognitive depth
- Measuring success by visual novelty rather than reduced user confusion
- Treating competitor research as permission to add unlimited scope
- Closing the milestone without a resize-aware browser walkthrough

## Sources

- Local repo inspection of:
  - `src/components/modpacks/ModpackList.tsx`
  - `src/components/settings/tabs/AppearanceTab.tsx`
  - `src/contexts/settings/theme.ts`
  - `src/components/SettingsPage.tsx`
  - `src/features/launcher/hooks/useLauncher.ts`
  - `src/features/launcher/hooks/useLauncherIPC.ts`
  - `src/components/modpacks/CreateModpackModal.tsx`
- User-provided pain points captured in the milestone kickoff conversation
- Modrinth modpack dependency specification: https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
