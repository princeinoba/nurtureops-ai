# Rollback

## Git

Do not force-push or reset shared history. For an application regression, revert the identified commit in a new reviewed commit, rerun affected gates, push, and deploy the new exact SHA. Preserve the failing SHA and evidence.

## Database

Never use remote `db reset`. PostgreSQL rollback is a reviewed forward migration:

1. Stop the affected write path with a feature/provider disable switch.
2. Snapshot and identify the deployed migration version.
3. Write an additive/forward-fix migration that preserves data.
4. Validate it on a restored/local copy and run RLS/grant tests.
5. Apply once, verify history/advisors/counts, then re-enable the path.

Destructive reversal, table drops, and irreversible data transformations require separate owner authorization and a verified backup/restore exercise.

## Vercel

The retained pre-Production artifact is Preview deployment `dpl_FCZBXHMEmkgmBcbJiQKkwWmBHnmq` at feature SHA `50503c24b669f6ea29665e667935813997efd82f`. It is evidence and a rebuild reference, not a Production artifact to promote when its source SHA differs from current `main`.

For a failed first Production release, remove the Production alias, cancel/delete the failed Production deployment, confirm active Production returns to zero, and keep the retained Preview. For a regression after acceptance, create a normal repair/revert commit from `main`, require green exact-SHA CI, and deploy that new SHA. Never force-push, destructively reset Supabase, or silently point Production at an older source tree.

Record the accepted Production deployment ID, stable alias, exact SHA, and alias-removal command in the merged release pull request after verification passes.

## Providers

- AI: set `AI_ENABLED=false`; deterministic workflows remain available.
- Email/SMS/payment: disconnect or disable the outbox consumer; queued jobs remain reviewable.
- Supabase service-role exposure: revoke/rotate immediately, redeploy server environments, invalidate sessions as appropriate, and review security/audit events.
- Invitation compromise: revoke outstanding links and rotate any related signing/HMAC secret.

## Evidence

Record incident time, trigger, affected SHA/migration/deployment, commands, test results, decision maker, recovery SHA, data-integrity check, and residual follow-up. Do not include child/family narratives or secret values.

