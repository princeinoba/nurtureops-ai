# Retention and deletion

Retention must be data-class and jurisdiction specific. No universal period is encoded beyond the 24-hour offline queue and invitation expiry limits.

The intended deletion workflow is request -> identity/recent-auth verification -> scope preview -> legal-hold check -> queued job -> transactional database/object action -> verification -> content-free audit -> backup-propagation status. UI must distinguish requested, processing, complete, partial, failed, and backup-pending states.

Constraints:

- Immutable invoices, consents, incident history, attendance corrections, and audit records are not silently edited or cascaded away.
- `restrict` foreign keys force an explicit reviewed plan.
- Export objects/downloads receive short expiry and deletion audit.
- A deletion job must be idempotent and resumable.
- Legal/tax/safeguarding holds override ordinary deletion only under an approved policy.
- Raw child/family data never appears in deletion logs/errors.
- Remote destructive reset or ad hoc SQL deletion requires separate owner authorization.

Production periods, subject-right verification, legal holds, backup expiry, and exception handling remain owner/jurisdiction decisions.
