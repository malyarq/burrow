# Phase 6 Research: Milestone Auditability Recovery

## What The Planner Needs To Know

Phase 6 is not a pure paperwork pass. The first milestone audit failed because Phases 1 through 5 had no `VERIFICATION.md` artifacts and `REQUIREMENTS.md` was never rolled forward, but later repo inspection also surfaced a small set of real release-truth gaps that should be closed before the milestone is archived.

The planner should treat this as a recovery phase with two linked jobs:

1. close the remaining concrete drift between what `v1.0` claims and what the shipped code actually does;
2. rebuild the missing audit trail so the milestone can be re-audited and archived honestly.

The safest phase shape is:

1. fix the concrete delivery, cache, and roadmap-truth gaps first while the code evidence is fresh;
2. reconstruct phase verification artifacts and reconcile any requirement wording that overstated shipped scope;
3. roll requirement status forward from the reconstructed evidence and re-run the milestone audit under the full repo gate.

Do not broaden this phase into new feature work. The gap is honest release closure for the current FMCL codebase, not a second product roadmap.

## Requirement Fit

Phase 6 exists to recover milestone closure across the full `v1.0` set, but the concrete code and documentation drift is concentrated in:

- `FLOW-05`: the image cache was shipped, but some live modpack and mod icon surfaces still use raw remote image URLs;
- `ACCT-01`: the shipped account skin flow is provider-aware preview, refresh, and provider-site handoff, so requirement wording and verification need to match that narrower contract;
- `DLVR-01` and `DLVR-02`: mirror priority was added in Phase 4, but launcher runtime and version-discovery flows still preserve a legacy provider-selection seam;
- `DOC-01`: roadmap truth still under-reports already shipped modpack browser history and configurable pagination behavior.

The remaining requirements are primarily blocked by missing verification evidence, not by newly discovered implementation gaps.

## Audit Baseline

The current milestone audit records these hard blockers:

- no `VERIFICATION.md` files exist for Phases 1 through 5;
- all 23 `v1.0` requirements are still pending in `REQUIREMENTS.md`;
- `REL-02` has no explicit verification closure despite a green repo-wide gate.

That is enough to block milestone archival on its own, but it is not the whole story.

## Concrete Gaps Found After Audit

### Mirror priority is not the only live download source of truth

The runtime download path still preserves a split between the Phase 4 mirror-priority model and older provider-selection state:

- `electron/services/runtime/downloadService.ts`
- `src/contexts/SettingsContext.tsx`
- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useVersions.ts`
- `src/features/launcher/hooks/useModSupportedVersions.ts`

That means `DLVR-01` and `DLVR-02` are not fully honest at milestone-closeout time unless the runtime and discovery flows are pulled back onto one persisted source of truth.

### The image cache rollout is incomplete on shipped surfaces

`LazyImage` and the disk-backed image-cache backend exist, but raw remote imagery is still rendered in release-visible surfaces:

- `src/components/modpacks/InstallModpackPage.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`

So `FLOW-05` is close but still incomplete from a release-truth perspective.

### The account-skin requirement wording drifted wider than the shipped Phase 4 scope

`src/features/accounts/AccountSkinPanel.tsx` shows a deliberate provider-aware skin experience built around preview, refresh, and external manage-page handoff. It is not a full in-launcher skin upload or edit flow. The requirement and verification language should reflect that intentional shipped contract rather than implying broader account-management work.

### Roadmap truth is still stale on completed browser features

Both roadmap files still report modpack browser history and configurable pagination as incomplete even though Phase 3 shipped them:

- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`

That makes `DOC-01` fail on release truth even before the auditability gap is fixed.

## Brownfield-Safe Sequencing

### 1. Fix the real product and documentation drift before rebuilding evidence

If the verification files are reconstructed before the concrete gaps are fixed, the milestone will become auditable around stale claims. The small set of live code and doc mismatches should be corrected first.

### 2. Reuse existing execution evidence instead of fabricating a new history

The phase should mine:

- prior `SUMMARY.md` files;
- prior `VALIDATION.md` files;
- recorded repo-gate results from completed phases;
- the current codebase state after the recovery fixes.

The right move is to reconstruct traceable evidence, not to invent phase results retroactively.

### 3. Re-run the milestone audit as the final proof, not just a file-existence check

Phase 6 is only successful if the milestone audit stops reporting orphaned or unsatisfied requirements for avoidable reasons. The rerun audit should be treated as the real end condition.

## Planning Risks

- If Phase 6 only creates `VERIFICATION.md` files without fixing mirror, cache, and roadmap drift, the milestone will be auditable but still not fully truthful.
- If `ACCT-01` is kept broad without new implementation work, the phase will either fail the audit again or silently overstate what shipped.
- If requirement status is rolled forward directly from memory or summary prose instead of reconstructed verification artifacts, the audit will remain fragile.
- If the rerun audit is skipped, the phase can end with more files on disk but without proof that archival is actually unblocked.

## Recommended Plan Shape

The cleanest Phase 6 decomposition is three plans:

- `06-01`: close the remaining mirror-priority, image-cache, and roadmap-truth gaps;
- `06-02`: reconcile `ACCT-01` wording and rebuild `01-05` verification artifacts from shipped evidence;
- `06-03`: roll `REQUIREMENTS.md` forward from the reconstructed verification set, re-run the repo gate, and refresh the milestone audit for archival readiness.

Recommended wave map:

- Wave 1: `06-01`, `06-02`
- Wave 2: `06-03`

## Validation Architecture

Phase 6 needs mixed validation:

- targeted Vitest coverage for the recovered mirror-runtime seam and cached-image seam;
- lightweight artifact checks that the new `VERIFICATION.md` files and requirement wording exist and reference the correct requirements;
- the full repo-wide release gate before the final milestone audit rerun.

The final success test is not "files were created". It is "the repo is still green and the rerun milestone audit stops reporting avoidable blockers."
