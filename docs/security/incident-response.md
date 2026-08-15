# Security incident response

## Trigger

Treat suspected cross-tenant access, real-data contamination, leaked credential, public file, invitation replay, attendance/invoice manipulation, provider replay, AI data leak, or immutable-history failure as an incident.

## Response

1. Disable the affected feature/provider and preserve exact SHA, deployment, migration, request IDs, and content-free logs.
2. Do not copy child/family content into chat, tickets, screenshots, or AI.
3. Determine affected tenant/purpose/time range through authorized queries.
4. Revoke/rotate service-role, model, database, signing, webhook, or invitation credentials as applicable.
5. Revoke sessions/links and restrict exports/downloads when indicated.
6. Patch through reviewed code or forward database migration; never destructive remote reset.
7. Re-run secret/data scans, RLS probes, immutability checks, browser journeys, build, and affected provider tests.
8. Have the owner and qualified privacy/legal/safeguarding advisors determine notice and evidence obligations.
9. Record containment, decision, recovery SHA/deployment, data-integrity result, and follow-up without sensitive narratives.

No production contact tree, severity SLA, regulator list, or breach-notification promise is claimed until jurisdiction and operators are approved.
