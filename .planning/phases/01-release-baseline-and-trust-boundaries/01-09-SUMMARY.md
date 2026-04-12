# 01-09 Summary

## Outcome

Plan `01-09` is implemented for persisted accounts and mirror configurations.

- Saved third-party accounts and custom mirrors are revalidated on load with the same trust policy used for new submissions.
- Insecure remote HTTP entries are preserved but marked disabled instead of being used silently or deleted.
- Accounts and mirrors UI surfaces now show disabled state, the reason for the block, and an in-flow correction path.
- The trust-policy implementation was centralized so persisted-state revalidation and ingress validation do not drift.

## Files Changed

- `electron/security/trustedEndpoints.ts`
- `electron/ipc/validation/privilegedPayloads.ts`
- `electron/services/account/accountService.ts`
- `electron/services/mirrors/mirrorsService.ts`
- `shared/types/account.ts`
- `shared/types/mirrors.ts`
- `src/features/accounts/AccountsPage.tsx`
- `src/features/settings/mirrors/MirrorsSettings.tsx`
- `src/locales/en.json`
- `src/locales/ru.json`

## Verification

- `npx eslint electron/services/account/accountService.ts electron/services/mirrors/mirrorsService.ts shared/types/account.ts shared/types/mirrors.ts shared/contracts/account.ts shared/contracts/mirrors.ts src/services/ipc/accountIPC.ts src/services/ipc/mirrorsIPC.ts src/features/accounts/AccountsPage.tsx src/features/settings/mirrors/MirrorsSettings.tsx`
- `npx tsc --noEmit`

## Notes

- Manual restart-and-seed smoke for disabled persisted configs was not run from this CLI session.
- The UI recovery path remains remove-and-add with a trusted HTTPS or loopback URL; no advanced override path was introduced in Phase 1.

## Commit

- `5582c70` — `fix(01-09): disable insecure persisted configs`
