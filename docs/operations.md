# Operations

## Daily checks

For an operational deployment, monitor authentication failures, invitation use/replay, RLS denials, attendance conflicts, missing check-outs, outbox failures, invoice state errors, export/deletion jobs, storage authorization failures, AI proposal failures/cost ceilings, and dependency/security advisories. Logs must contain request IDs and result classes, not child/family narratives.

## Privileged actions

Role changes, exports, deletion requests, sensitive downloads, incident review, invoice issue/void/credit, and provider configuration require server authorization. High-risk actions should require recent authentication and be MFA-ready. Service-role use is limited to narrow server jobs.

## Provider posture

No delivery/payment provider is connected. Outbox state must not be represented as sent, delivered, paid, or refunded until a provider-confirmed event passes signature/idempotency checks. AI is off by default and core workflows remain available during model/provider outage.

## Incident response

1. Contain the affected route/provider/key.
2. Preserve content-free logs and exact SHA/deployment/migration evidence.
3. Assess tenant/relationship scope without copying sensitive content into tickets.
4. Rotate exposed credentials and revoke invitations/sessions when indicated.
5. Forward-fix database or revert application code through review.
6. Re-run security, RLS, browser, and data-integrity checks.
7. Document notification/legal decisions with qualified counsel and the owner.

## Backup and restore

Local reset is not a backup strategy. Before real-world use, configure provider backups/PITR appropriate to the approved plan, document RPO/RTO, encrypt and access-control exports, and rehearse restore into an isolated environment. Re-run migrations, RLS probes, object access, counts, and consistency checks after restore.

## Maintenance

Use pinned dependencies and reviewed upgrades. Run frozen install, audit/advisory review, all quality gates, exact-commit Preview, and affected live checks before promotion. Never test production with real child data in screenshots or AI prompts.
