# Data model

The PostgreSQL 17 migration creates 62 public application tables. Every table enables and forces RLS. Foreign keys generally use `restrict` so history is not silently cascaded away.

## Domains

| Domain                     | Tables                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant and identity        | organizations, locations, profiles, memberships, role_grants, invitations, staff_profiles                                                       |
| Children and relationships | children, guardians, child_guardians, emergency_contacts, authorized_pickups, child_care_profiles, allergies, care_instructions, consents       |
| Rooms and workforce        | rooms, room_enrollments, staff_room_assignments, child_schedules, staff_shifts, staff_qualifications, ratio_policy_versions, ratio_observations |
| Attendance/offline         | attendance_sessions, attendance_events, attendance_corrections, offline_event_receipts, sync_conflicts                                          |
| Daily care                 | daily_care_entries, daily_report_drafts, daily_reports, parent_visibility                                                                       |
| Safety                     | incidents, incident_history, medication_authorizations, medication_administrations                                                              |
| Communication              | message_threads, thread_participants, messages, announcements, notification_preferences, notification_deliveries, outbox_jobs                   |
| Billing                    | contracts, rate_plans, subsidies, credits, invoice_sequences, invoices, invoice_lines, payments, credit_notes                                   |
| Documents/governance       | documents, attachments, audit_events, security_events, export_jobs, deletion_requests, billing_exports                                          |
| AI governance              | ai_runs, ai_approvals                                                                                                                           |

## Invariants

- Tenant-bearing records include `organization_id`; location/child composite foreign keys prevent mismatched parent references.
- Membership roles are server-managed database rows, not user-editable profile metadata.
- A partial unique index permits only one open attendance session per child/location.
- Attendance and offline receipts use organization-scoped idempotency keys.
- Corrections append original and corrected instants with an actor and reason.
- Ratio observations reference a policy version.
- Care drafts and published reports are separate records; guardian visibility is explicit.
- Incident, consent, and audit history cannot be updated or deleted.
- Money columns are `bigint` minor units with non-negative/check-total constraints.
- Invoice issue requires a number/timestamp; state transitions are constrained; issued financial fields and lines are immutable.
- AI run/audit metadata prohibits prompt/body/narrative keys.
- The private storage bucket is non-public and organization-folder access is RLS-protected.

## Authorization helpers

Private security-definer helpers answer narrow questions: active organization membership, role ownership, staff location assignment, guardian-child relationship, attendance-session access, contract access, thread participation, and invoice access. They use `set search_path = ''`, and execute is revoked from public/anon.

## Deletion and retention

Operational records are designed for reviewed retention/deletion jobs rather than cascaded erasure. Legal-hold, retention window, backup propagation, and production deletion schedules require owner and jurisdiction decisions. Remote rollback is by reviewed forward migration; destructive reset is local-development-only.
