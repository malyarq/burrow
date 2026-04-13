---
phase: 08-core-route-rollout-and-ui-correctness
plan: "02"
subsystem: ui-settings
tags: [react, settings, accounts, skins, vitest]
requires:
  - phase: 07-ui-system-foundations
    provides: shared modal chrome, shared surfaces, and token-aware controls
  - phase: 08-core-route-rollout-and-ui-correctness
    provides: route-truth rollout patterns for refreshed core surfaces
provides:
  - settings modal content and footer aligned to the shared route contract
  - accounts and skin management surfaces integrated into that contract
  - route-focused tests for settings/accounts integration plus provider-aware skin behavior
affects: [settings, accounts, skin-management, localization]
tech-stack:
  added: []
  patterns: [settings-route-as-shared-surface, provider-aware-skin-actions, settings-to-accounts-integration-tests]
key-files:
  created: [src/components/__tests__/SettingsPage.accounts.test.tsx]
  modified: [src/components/SettingsPage.tsx, src/features/accounts/AccountsPage.tsx, src/features/accounts/AddAccountDialog.tsx, src/features/accounts/AccountSkinPanel.tsx, src/features/accounts/__tests__/AccountsPage.a11y.test.tsx, src/features/accounts/__tests__/AccountSkinsPage.test.tsx, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Widened the settings modal and wrapped the inner tab content plus footer in shared surfaces instead of leaving the accounts route nested inside legacy chrome."
  - "Made skin actions explicitly provider-aware and disabled unsupported flows rather than keeping visually polished buttons that still implied unavailable behavior."
patterns-established:
  - "Settings tabs should hand off into surface-wrapped content and footer shells so embedded feature routes feel like one product surface."
  - "Account-provider features should ship with both locale-safe helper copy and route-level integration tests, not isolated widget assertions only."
requirements-completed: [DSYS-03, LOCL-01, UX-03]
duration: 12min
completed: 2026-04-13
---

# Phase 8 Plan 02: Core Route Rollout And UI Correctness Summary

**Settings and account management now read as one shared launcher route, with provider-aware skin actions and route-level regression coverage**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-13T08:49:00+03:00
- **Completed:** 2026-04-13T09:01:10+03:00
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Moved the settings modal body and footer onto the shared surface contract so the accounts tab no longer feels like a nested legacy module.
- Reworked accounts, add-account, and skin-management panels around shared cards, helper copy, and explicit provider-aware action states.
- Added route-focused tests for settings-to-accounts integration, account accessibility semantics, and supported or unsupported skin-provider behavior.

## Task Commits

1. **Task 1: Bring settings/accounts structure and visual language onto the shared route contract** - `402cd17` (`fix(08-02): align settings and accounts route`)
2. **Task 2: Complete touched settings/accounts copy and add route-focused regression coverage** - `7dc594f` (`test(08-02): cover settings accounts seam`)

## Files Created/Modified

- `src/components/SettingsPage.tsx` - wider modal route, surface-wrapped tab panels, and shared footer treatment
- `src/features/accounts/AccountsPage.tsx` - shared-surface account header, account cards, and selected-account presentation
- `src/features/accounts/AddAccountDialog.tsx` - helper copy, segmented auth-mode control, and shared-surface form layout
- `src/features/accounts/AccountSkinPanel.tsx` - tokenized skin-management card with disabled unsupported actions
- `src/locales/en.json` and `src/locales/ru.json` - settings/accounts helper copy for the refreshed route
- `src/features/accounts/__tests__/AccountsPage.a11y.test.tsx` and `src/features/accounts/__tests__/AccountSkinsPage.test.tsx` - readable route semantics and provider-aware skin behavior coverage
- `src/components/__tests__/SettingsPage.accounts.test.tsx` - settings/accounts integration seam inside the real modal route

## Decisions Made

- Kept account behavior anchored to existing IPC seams and the shipped Blessing Skin or LittleSkin contract instead of expanding into new provider features.
- Used route integration tests to prove the settings modal and real accounts surface work together, rather than adding another shallow mock-only UI test.

## Deviations from Plan

None.

## Issues Encountered

- The account skin test initially failed because this test lane does not auto-clean DOM between renders and the refreshed panel now shows `LittleSkin` in more than one place; the fix was to clean up explicitly and assert the provider label more intentionally.

## User Setup Required

None.

## Next Phase Readiness

- `08-03` can align the modpack list, browser, details, install, export, and add-mod seams against a launcher that already has coherent entry and settings routes.
- `08-04` can verify Phase 8 route continuity from entry through settings/accounts before broadening into milestone-wide manual walkthroughs in Phase 10.

---
*Phase: 08-core-route-rollout-and-ui-correctness*
*Completed: 2026-04-13*
