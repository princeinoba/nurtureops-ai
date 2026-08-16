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

Before production promotion, record the current deployment ID, URL, and source SHA. If the new deployment fails, promote the recorded healthy deployment through Vercel's normal rollback/promote workflow, then verify SHA, aliases, headers, noindex, routes, and critical journeys. The rollback target is intentionally blank until a remote production deployment exists.

## Providers

- AI: set `AI_ENABLED=false`; deterministic workflows remain available.
- Email/SMS/payment: disconnect or disable the outbox consumer; queued jobs remain reviewable.
- Supabase service-role exposure: revoke/rotate immediately, redeploy server environments, invalidate sessions as appropriate, and review security/audit events.
- Invitation compromise: revoke outstanding links and rotate any related signing/HMAC secret.

## Evidence

Record incident time, trigger, affected SHA/migration/deployment, commands, test results, decision maker, recovery SHA, data-integrity check, and residual follow-up. Do not include child/family narratives or secret values.
