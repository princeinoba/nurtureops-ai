# Threat model

## Scope and trust boundaries

Assets include tenant/role relationships, child and guardian records, attendance history, safety records, invoices, private documents, exports, provider jobs, audit metadata, and AI proposals. Trust boundaries are browser to Next.js, Next.js to Supabase, Auth claims to database roles, private storage, future provider webhooks, offline device storage, and model/provider calls.

The repository contains synthetic data only. Controls here do not certify compliance or replace jurisdictional, privacy, safeguarding, or legal review.

## Threats and controls

| Threat                                   | Primary controls                                                                                                               | Residual risk / next action                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Compromised browser/session              | HttpOnly Supabase cookie design, CSP/headers, server reauthorization, recent-auth hooks, short-lived signed downloads          | Remote session limits/MFA and device policy need approval      |
| Cross-tenant or cross-family access      | Organization/location FKs, explicit grants, forced RLS, guardian relationship/staff assignment helpers, live allow/deny probes | Every future query/table needs equivalent tests                |
| User-editable role forgery               | Roles stored in server-managed membership/grant tables; no profile-metadata authorization                                      | Privileged role-management command UI deferred                 |
| Leaked service-role/model/provider key   | Server-only modules/env, scanner, no browser import, rotate/disable runbook                                                    | Remote provider rotation and alerting not configured           |
| Invitation replay/enumeration            | Random one-use token, stored hash, email bind, expiry/revoke/consume fields, enumeration-safe page                             | Delivery provider and atomic consume transaction deferred      |
| XSS/CSRF                                 | React escaping, restrictive CSP/headers, same-site cookie strategy, no dangerous HTML, same-origin APIs                        | Production nonce strategy and penetration test deferred        |
| Private file exposure                    | Non-public bucket, canonical UUID folder policy, RLS, signed access design                                                     | Signed-download command and expiry telemetry deferred          |
| Child data in URLs/logs/errors/analytics | UUID route identifiers, synthetic data, content-free audit schema/check, redacted API errors, no analytics                     | Operational logging pipeline must be reviewed                  |
| Administrator misuse                     | Purpose-limited roles, audit/security events, recent-auth design, immutable history                                            | Separation of duties and alert review need an owner policy     |
| Offline device loss                      | Minimal 24-hour/50-event attendance queue; no profiles/API caches; server replay authorization                                 | MDM/remote wipe unavailable                                    |
| Export exfiltration                      | Export job model, recent-auth requirement, short-lived/private design, no email attachments                                    | Object generator, expiry deletion, download audit deferred     |
| Deletion inconsistency                   | Explicit deletion job states; restrict FKs; forward-fix operations                                                             | Retention/legal hold and backup propagation unresolved         |
| Webhook replay                           | Provider boundary/outbox and idempotency fields; no provider currently connected                                               | Signature/timestamp/replay tests required before activation    |
| Attendance manipulation                  | Append-only events, idempotency, optimistic version, explicit correction actor/reason, immutable audit                         | Full repository transaction path deferred                      |
| Billing fraud/error                      | Bigint, deterministic calculation version, state machine, immutable issued records/lines                                       | Jurisdiction/tax/provider reconciliation blocked               |
| AI prompt injection                      | Tool content treated as data, typed tools/output, step cap, deny fields, no direct mutation                                    | Provider/model eval and adversarial suite deferred             |
| AI cross-family leakage                  | Actor passed to deterministic tools, minimum field manifest, relationship RLS, evidence IDs                                    | Live model must be tested against remote RLS before enablement |
| Provider/subprocessor exposure           | AI off by default; no payment/message provider; no raw prompt/body logs                                                        | Data-processing assessment and regional terms required         |
| Backup restore failure                   | Local reproducible migration/seed, documented restore verification                                                             | Remote RPO/RTO and restore rehearsal not completed             |
| Real-data contamination of demo evidence | Reserved domains, visible demo labels, ignored archives, repository scanner, noindex                                           | Human screenshot/log review remains required                   |

## Abuse cases

An attacker may alter local queue payloads, submit stale versions, guess resource UUIDs, manipulate headers, forge profile metadata, replay invitations/webhooks, or inject instructions through stored text. The server/database must treat every browser/model/provider value as untrusted and recheck actor, tenant, relationship, assignment, version, idempotency, and invariant at the transaction boundary.

## Security release gates

Hard stop on real data, browser secrets, failed RLS, anonymous private access, mutable issued invoices/audit, duplicate attendance, sensitive offline cache, serious/critical accessibility defects, high/critical applicable vulnerabilities, or AI/provider mutation without explicit approval.
