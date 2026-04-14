---
phase: 16
slug: modpack-detail-integrity-and-discoverable-dense-navigation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 16 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx` |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit` |
| **Estimated runtime** | ~180 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest or seam-specific static/type command for the detail surface touched; if a task spans dependency logic and header navigation, use the quick run command above
- **After every plan wave:** Run `npm test && npm run lint && npx tsc --noEmit`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 1 | DETAIL-01, DETAIL-02 | static/type | `npx eslint src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx src/utils/versionCheck.ts && npx tsc --noEmit` | ✅ | ⬜ pending |
| 16-01-02 | 01 | 1 | DETAIL-01, DETAIL-02 | component | `npx vitest run src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` | ✅ | ⬜ pending |
| 16-02-01 | 02 | 2 | DETAIL-03 | static/type | `npx eslint src/components/modpacks/details/ModpackDetailsHeader.tsx src/components/modpacks/ModpackDetails.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 16-02-02 | 02 | 2 | DETAIL-03 | component | `npx vitest run src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` | ✅ | ⬜ pending |
| 16-03-01 | 03 | 3 | DETAIL-01, DETAIL-02, DETAIL-03 | full gate + manual | `npx vitest run src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx && npm test && npm run lint && npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Modpack details shows runtime-provided dependencies as satisfied and wrong runtime versions as incompatible in a realistic screen context | DETAIL-01 | The combined readability of dependency state, labels, and surrounding page cues is product-facing rather than purely structural | Open `manual-verification.html?view=modpack-details`, inspect a mod with runtime dependencies, and confirm runtime-provided and incompatible states read clearly without false missing alarms |
| Dependency requirement copy reads like product language instead of raw syntax on the detail surface | DETAIL-02 | Human readability and fallback quality are hard to judge from parser-level assertions alone | Expand representative dependency rows on the manual detail surface and confirm the requirement copy is understandable, concise, and never leaks raw range syntax for supported cases |
| Primary detail sections stay discoverable at the audited desktop width without relying on hidden horizontal scroll | DETAIL-03 | Discoverability and scan quality are spatial UX behaviors, not only DOM facts | Open `manual-verification.html?view=modpack-details` at the audited desktop width and confirm the primary sections are visibly reachable without needing to discover a scrollable tab strip |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
