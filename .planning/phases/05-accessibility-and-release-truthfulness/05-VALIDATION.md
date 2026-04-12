---
phase: 5
slug: accessibility-and-release-truthfulness
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest for renderer and Electron-focused tests, with `@testing-library/react` for interaction-heavy accessibility checks |
| **Config file** | Existing `vitest.config.ts` and `tests/setup/vitest.setup.ts` from Phase 2 |
| **Quick run command** | active plan's exact `npx vitest run ...` command |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` |
| **Estimated runtime** | targeted checks: 10-60s; full suite: ~90-240s |

---

## Execution Map

| Wave | Plans | Focus |
|------|-------|-------|
| 1 | `05-01`, `05-02` | Repair shared accessibility foundations, then make launcher and modpack workflows keyboard-usable |
| 2 | `05-03` | Finish visual accessibility and release-critical settings polish |
| 3 | `05-04` | Refresh README, roadmap, and contract-map truth against the actual codebase |
| 4 | `05-05` | Close the full phase under the repo-wide release gate |

---

## Sampling Rate

- **After every task:** Run that task's exact `<verify>` command before moving on.
- **After every completed plan:** Run the plan's full `<verification>` checklist, not just the last task check.
- **After Wave 1:** Run `npm test && npx tsc --noEmit`.
- **After Wave 2:** Run `npm test && npm run lint && npx tsc --noEmit`.
- **After Wave 3 / before Wave 4:** Run `npm run contracts:check && npm run ipc:check && npm test && npx tsc --noEmit`.
- **After Wave 4 / before `$gsd-verify-work`:** Run `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never`.
- **Max feedback latency:** 60 seconds for targeted checks and 240 seconds for the full phase gate.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-T1 | 05-01 | 1 | A11Y-01, A11Y-02 | typecheck plus focused settings-shell lint | `npx eslint src/components/ui/Modal.tsx src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/ui/Button.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-01-T2 | 05-01 | 1 | A11Y-01, A11Y-02 | renderer accessibility tests for modal and settings tabs | `npx vitest run src/components/ui/__tests__/Modal.a11y.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx` | ❌ W0 | ⬜ pending |
| 05-02-T1 | 05-02 | 1 | A11Y-01, A11Y-02 | focused renderer lint and typecheck for core flow files | `npx eslint src/components/Sidebar.tsx src/components/modpacks/ModpackBrowser.tsx src/components/modpacks/ModpackList.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-02-T2 | 05-02 | 1 | A11Y-01, A11Y-02 | renderer keyboard tests for launcher shell and modpack flows | `npx vitest run src/components/__tests__/Sidebar.keyboard.test.tsx src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx` | ❌ W0 | ⬜ pending |
| 05-03-T1 | 05-03 | 2 | A11Y-03 | focused style and component gate | `npx eslint src/components/SimplePlayDashboard.tsx src/components/layout/BackgroundLayer.tsx src/components/ui/Button.tsx src/features/accounts/AccountsPage.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/features/settings/statistics/StatisticsTab.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-03-T2 | 05-03 | 2 | A11Y-02, A11Y-03 | renderer tests for release-critical settings surfaces | `npx vitest run src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` | ❌ W0 | ⬜ pending |
| 05-04-T1 | 05-04 | 3 | DOC-01 | roadmap and README truth gate | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-04-T2 | 05-04 | 3 | DOC-02 | contract and IPC documentation consistency checks | `npm run contracts:check && npm run ipc:check` | ✅ | ⬜ pending |
| 05-05-T1 | 05-05 | 4 | A11Y-01, A11Y-02, A11Y-03, DOC-01, DOC-02 | final release gate | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing Vitest and jsdom infrastructure from Phase 2 covers framework setup
- [ ] `src/components/ui/__tests__/Modal.a11y.test.tsx` — modal semantics and focus management coverage
- [ ] `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx` — tab semantics and keyboard movement coverage
- [ ] `src/components/__tests__/Sidebar.keyboard.test.tsx` — launcher-shell keyboard reachability coverage
- [ ] `src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx` — browser keyboard and labelled-control coverage
- [ ] `src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx` — installed-card keyboard action coverage
- [ ] `src/features/accounts/__tests__/AccountsPage.a11y.test.tsx` — account-surface accessibility coverage
- [ ] `src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx` — mirror controls accessibility coverage
- [x] `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` — existing statistics test file can be expanded for accessibility assertions

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Keyboard-only user can open settings, move across tabs, close dialogs, browse modpacks, and trigger card actions without pointer input | A11Y-01, A11Y-02 | End-to-end focus order, focus return, and modal recovery are more trustworthy in a real Electron session than in isolated jsdom only | Launch FMCL, avoid the mouse, open Settings, move between tabs with keyboard, enter and exit dialogs, browse modpacks, open install or details flows, and confirm all primary actions remain reachable and recoverable |
| Light and dark themes maintain readable contrast and visible focus rings on real backgrounds | A11Y-03 | Contrast and focus visibility depend on the actual composed UI, backgrounds, translucency, and iconography | Review the launcher in both light and dark themes, tab through interactive controls, confirm visible focus on every stop, and spot-check text or icon contrast on translucent and accent-heavy surfaces |
| Reduced motion is respected both via system preference and FMCL's disable-animations setting | A11Y-03 | CSS media queries and runtime settings can interact differently in a real session than in tests | Enable reduced motion at the OS level and then with FMCL's own disable-animations setting, reopen animated screens and dialogs, and confirm motion-heavy transitions no longer animate |
| README, EN/RU roadmaps, and both contract maps describe the shipped release rather than an older snapshot | DOC-01, DOC-02 | Documentation truth requires comparing prose to the actual product and current IPC registration, not just checking syntax | Review README feature bullets against the app, compare EN and RU roadmap status lines to current implementation, and confirm contract maps match `electron/ipc/ipcManager.ts`, preload bridges, and renderer IPC wrappers for the listed domains |

---

## Validation Sign-Off

- [x] All tasks have automated verification or explicit manual-only justification
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Existing infrastructure covers framework prerequisites
- [x] No watch-mode flags
- [x] Feedback latency < 240s at the phase gate and < 60s at the task level
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
