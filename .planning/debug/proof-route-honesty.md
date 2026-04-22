---
status: investigating
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Manual settings proof should stay honest about real direct-feedback gaps instead of implying closure while the live UI still violates the same core expectations. Severity: major. Test: 5. User report: Уже все описал в других."
created: 2026-04-22T19:23:23Z
updated: 2026-04-22T19:23:23Z
---

## Current Focus

hypothesis: The Phase 36 manual settings proof is a wording-only contract. The route marks itself ready from static appearance-tab text, the regression tests only assert description/readiness strings, and the manual-verification shell still presents the route as closeout proof. That lets the harness imply closure even when the live settings UI still fails the same direct-feedback expectations.
test: Trace the `settings-appearance` scenario readiness conditions, inspect the proof-route tests, and compare them with the closeout summary and manual-verification shell framing.
expecting: If true, code will show that no preset interaction, no visible-effect verification, and no utility-tab/product-behavior check is required before the route reports Phase 36 proof as rendered.
next_action: Record the proof-harness gap as the root cause and return the diagnosis.

## Symptoms

expected: Manual settings proof should stay honest about open direct-feedback gaps instead of signaling closure while the live UI still violates the same expectations.
actual: The proof route presents itself as Phase 36 closeout proof even though the same settings expectations remain broken in live UAT and were already reported under other tests.
errors: none reported
reproduction: Open the manual verification harness on `?view=settings-appearance` and compare the route’s “proof” status and copy with the still-failing live settings behavior from Phase 36 UAT tests 1-4.
started: reported during Phase 36 UAT on 2026-04-22 after the proof-route refresh landed

## Eliminated

- hypothesis: The gap is only that the route still uses the old preset-era wording.
  evidence: `views.ts` and `scenarios.tsx` were updated to name duplicate-copy removal, preset predictability, aligned control geometry, and visible-effect scope explicitly, so the wording itself is no longer the main failure.
  timestamp: 2026-04-22T19:23:23Z

## Evidence

- timestamp: 2026-04-22T19:23:23Z
  checked: src/verification/manual/scenarios.tsx
  found: `SettingsAppearanceScenario` marks the route ready when four static strings are present (`FriendLauncher`, `Launcher Settings`, `Theme Presets`, `Visible Background Scope`) and then declares the full Phase 36 proof rendered.
  implication: The harness does not require any interaction or observable success for duplicate-copy removal, preset predictability, aligned control geometry, or visible-effect behavior before it reports success.

- timestamp: 2026-04-22T19:23:23Z
  checked: src/verification/manual/__tests__/appearanceProof.test.tsx and src/verification/manual/__tests__/views.test.ts
  found: The tests mock `SettingsPage` down to static text and only assert the ready message and route description strings.
  implication: Regression coverage protects wording drift, not truthful correspondence between the proof route and actual live settings behavior.

- timestamp: 2026-04-22T19:23:23Z
  checked: src/verification/manual/views.ts and src/verification/manual/ManualVerificationApp.tsx
  found: The route is labeled as "Phase 36 settings closeout proof", while the manual-verification shell still hardcodes `Milestone v0.5.0 Closeout` and `Mounting closeout scenario...`.
  implication: The harness framing itself communicates closure/proof status even though the route is only a copy-driven appearance view.

- timestamp: 2026-04-22T19:23:23Z
  checked: .planning/phases/36-settings-predictability-and-shared-control-contract/36-04-SUMMARY.md
  found: Plan 04 explicitly describes Task 2 as a docs-only proof refresh, says the route/tests protect wording, and notes that a live interactive settings walkthrough was not rerun.
  implication: Phase 36 closeout deliberately refreshed the proof narrative without adding a behavior gate that could fail when the real UI still violated the direct-feedback contract.

## Resolution

root_cause: The Phase 36 settings proof route is implemented as a copy-level closeout harness rather than a behavior-truth harness. `settings-appearance` reports success from static appearance-tab text, the proof tests only enforce wording, and the manual-verification shell still frames the route as closeout proof. As a result, the route can imply that Phase 36 settings feedback is closed even while the live UI still fails the same direct-feedback expectations captured by UAT tests 1-4.
fix:
verification:
files_changed: []
