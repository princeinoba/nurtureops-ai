# Backup and restore

Local Supabase reset proves migration reproducibility; it is not a production backup.

Before real activation:

- Select an approved Supabase plan/region and document backup/PITR features, encryption, access, retention, RPO, and RTO.
- Restrict backup/export access to named privileged roles with recent authentication and audit.
- Keep exports private, short-lived, encrypted in transit/at rest, and never email them as attachments.
- Document how deletion/legal hold propagates to backups.
- Rehearse restore into an isolated project using a reviewed snapshot.
- Verify migration history, 62 table structures, row counts, FKs/indexes, forced RLS/grants/functions, storage bucket privacy/objects, Auth relationships, invoice/attendance invariants, and content-free audit continuity.
- Run static/live RLS, security, integration, and critical browser checks before declaring restore successful.

Remote restore, RPO/RTO, and backup deletion remain blocked until the owner approves a project and policy.
