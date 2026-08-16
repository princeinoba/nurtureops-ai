# Product requirements

## Product

NurtureOps AI is a calm, mobile-first childcare operations workspace for directors, educators, and guardians. This repository demonstrates architecture and interaction design with fictional identities only; it is not an operating childcare service or a compliance-certified product.

## Users

- Organization owner/director: centre setup, staff, children, safety review, billing, reports, audit.
- Educator/staff: assigned-room roster, attendance, structured care logs, incident drafts, provider-unavailable messages.
- Guardian: related-child timeline, attendance, issued invoices, relationship-scoped documents/messages.
- Billing manager and auditor: represented in the authorization/data model; dedicated UI remains deferred.

## Functional requirements and status

| Area          | Requirement                                                                 | Status                                                      |
| ------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Public        | Landing, about, privacy, terms, noindex                                     | Implemented                                                 |
| Auth          | Sign-in, reset, onboarding, invitation acceptance, closed signup            | UI/config implemented; remote Auth deferred                 |
| Tenancy       | Organizations, locations, memberships, role grants, assignments             | Schema/RLS implemented                                      |
| Children      | Directory, profile, guardian links, pickup/care/consent model               | UI plus schema; sensitive edit workflows deferred           |
| Rooms/staff   | Room overview, staffing observation, versioned ratio policy                 | Implemented as synthetic/read-oriented demo                 |
| Attendance    | Idempotent check-in/out, review/correction, bounded offline replay          | Domain/UI/demo API/schema implemented                       |
| Care log      | Structured private drafts and approved parent visibility                    | UI/schema implemented; persistence command deferred         |
| Safety        | Incident lifecycle, immutable history, medication authorization/admin model | Read/demo UI plus schema; real activation blocked           |
| Communication | Threads, participants, announcements, preferences, outbox                   | Schema and honest unavailable UI; provider deferred         |
| Billing       | Contracts, plans, subsidies, credits, deterministic invoices, PDFs          | Domain/schema/UI implemented; live payments blocked         |
| Reports       | Export/deletion job model and honest states                                 | UI/schema implemented; object generation deferred           |
| AI            | Care Copilot reads, typed proposals, evidence, approval boundary            | Synthetic deterministic UI and server contracts implemented |
| PWA           | Installable manifest, static offline shell, minimal attendance queue        | Implemented; browser install verification is a release gate |

## Safety and quality requirements

- No real child, family, staff, financial, medical, or contact data.
- No browser service-role, database-admin, provider, or model secret.
- No floating-point authoritative money.
- No silent attendance overwrite or duplicate replay.
- No issued-invoice mutation.
- No guardian access outside an active relationship.
- No AI send, publish, charge, check-in/out, incident approval, pickup authorization, role change, or safety-data mutation.
- Zero serious/critical automated accessibility findings before release.
- No claim of regulatory or jurisdictional compliance without qualified review.

## Non-goals

This demo does not provide legal advice, medical decisions, safeguarding outcomes, real communications, real payments, payroll, tax filing, background checks, or guaranteed jurisdictional ratio compliance.

## Release definition

Local release requires frozen install, format, zero-warning lint, strict typecheck, unit/integration/RLS/PWA/browser/accessibility tests, security scan, database reset/lint/live RLS probes, and production build. Remote release additionally requires exact-commit CI/Preview evidence and owner-approved free-plan organization/team/region choices.
