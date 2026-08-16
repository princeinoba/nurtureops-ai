# Known limitations and activation holds

## Demo-only

- Static fictional dashboard records and dates.
- Attendance API validates and returns `persisted: false`.
- Care log drafts are client-local for the current page session.
- Care Copilot demo endpoint is deterministic; no remote model is required.
- Invoice PDF is a synthetic document.
- Auth pages present honest unavailable/configuration states without a remote project.

## Deferred

- Repository/transaction command handlers for every schema table.
- Live email/SMS, payment, webhook, notification, export object, and deletion workers.
- Dedicated billing-manager/auditor shells.
- Automated performance budgets and production observability dashboards.
- Remote type generation, backup/PITR exercise, and provider signature tests.
- Remote backup/restore evidence; destructive reset remains prohibited.

## Blocked pending owner or qualified review

- Jurisdiction, retention, ratio, tax, invoice, privacy, safeguarding, and consent rules.
- Real child/family data.
- Public signup or public indexing.
- Live payment, messaging, storage-processing, analytics, or AI providers.
- Any compliance certification or medical/legal/safeguarding conclusion.

The architecture, exact-SHA CI, Free Supabase project, protected Preview, and synthetic Production verification reduce release risk but do not establish regulatory compliance or real-world operational safety. Final Production deployment and screenshot identifiers are recorded externally on the merged release pull request so they do not alter the deployed source SHA.
