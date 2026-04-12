# Phase 1: Release Baseline And Trust Boundaries - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Restore FMCL's trustworthy release baseline without expanding product scope: fix the current runtime/hook regressions, re-establish clean lint/type gates, and harden privileged boundaries so unsafe inputs, paths, archives, and external URLs are rejected before they can mutate the app or filesystem.

</domain>

<decisions>
## Implementation Decisions

### Trust policy
- Third-party account servers should allow HTTPS endpoints plus explicitly local endpoints; insecure remote HTTP should not be accepted by default.
- Custom mirrors should be validated before save instead of being accepted optimistically and failing later during downloads.
- External links should open trusted domains directly, but unfamiliar domains should require confirmation before FMCL hands them to the OS.
- If FMCL blocks an unsafe endpoint or URL, advanced users may get an explicit override path; the app should not stay silently permissive.
- Existing saved custom auth or mirror configurations that fail the new rules should be disabled immediately rather than grandfathered.

### Rejection UX
- Unsafe path, archive, and input rejections should be shown inline in the current flow rather than only in toasts or the console.
- Error messages should be clear and actionable, explaining what was blocked and what the user can do next without exposing raw internal debugging text by default.
- When trust is ambiguous at the archive-entry level, FMCL should ask before proceeding rather than silently sanitizing or silently failing the full operation.
- After blocking an unsafe action, FMCL should keep the user in a retryable state with an immediate path to correct the input.

### Compatibility and cleanup posture
- Phase 1 is allowed to be visibly stricter and cleaner; it does not need to stay an invisible internal-only cleanup.
- Safer-by-default behavior is preferred over preserving permissive legacy flows when the two conflict.
- Browser-native confirms, ad hoc reload recovery, and similar fragile patterns should be cleaned up broadly if Phase 1 work touches them.

### Claude's Discretion
- Exact schema and validator implementation for IPC payloads, path containment, and URL classification.
- How trust confirmations are phrased and where confirmation UI lives, as long as it follows the inline/actionable direction.
- Which direct `window.*` usages and fragile recovery patterns are replaced first inside the phase, provided the overall safer-by-default posture is preserved.

</decisions>

<specifics>
## Specific Ideas

- No external product references were specified.
- The consistent preference across the discussion was: make FMCL stricter and clearer, not merely quieter.
- When FMCL blocks something risky, it should help the user recover immediately instead of pushing them toward logs or full-flow restarts.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Modal.tsx`, `Button.tsx`, `Input.tsx`: existing in-app primitives that can replace browser-native confirm/prompt style interactions and support inline recovery.
- `src/services/ipc/*` plus `shared/contracts/*`: preferred typed boundary for renderer-to-main communication; useful for reducing direct `window.*` usage during hardening.
- `src/contexts/SettingsContext.tsx`: existing translation access and global UI patterns for consistent user-facing messaging.

### Established Patterns
- Renderer code is supposed to prefer typed IPC wrappers over direct `window.*` access, but current hotspots like `AccountsPage.tsx` and `ShareModal.tsx` still bypass that convention.
- Electron IPC handlers are intended to be thin, which means validation should be added at the handler/service edge instead of pushing trust decisions into React code.
- User-facing strings should be localized in both `src/locales/en.json` and `src/locales/ru.json`, so new blocking/warning flows should not introduce fresh hard-coded strings.

### Integration Points
- Reliability fixes start in `src/components/layout/BackgroundLayer.tsx`, `src/features/accounts/AccountsPage.tsx`, `src/features/share/ShareModal.tsx`, and `src/components/settings/tabs/StorageTab.tsx`.
- Trust-boundary hardening will touch `electron/ipc/handlers/*`, especially account/settings/modpack-related handlers, plus importer/service paths in `electron/services/modpacks/importers/`, `electron/services/instances/importer/`, and related file-management services.
- External navigation and window security behavior centers on `electron/window/windowManager.ts` and the preload exposure in `electron/preload.ts`.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-release-baseline-and-trust-boundaries*
*Context gathered: 2026-04-12*
