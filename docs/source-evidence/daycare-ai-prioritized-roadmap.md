# Daycare AI — Prioritized Delivery Roadmap

## Scoring

- **P0:** security/data-loss/release blocker
- **P1:** required for credible portfolio beta
- **P2:** high-value post-MVP
- **P3:** later scale/optimization

## Phase 0 — Decisions and provenance

| Priority | Deliverable | Exit condition |
|---|---|---|
| P0 | Freeze literal ZIP merge | No source trees copied into target |
| P0 | Licence register | Folk Care AGPL and NannyBill uncertainty recorded |
| P0 | Launch jurisdiction | Currency, tax, childcare rules, privacy, ratios documented |
| P0 | Data inventory/threat model | Every child/family/staff field has purpose, visibility, retention |
| P1 | Name/brand decision | Working name approved; legal/domain clearance tracked |

## Phase 1 — Platform foundation

| Priority | Deliverable | Exit condition |
|---|---|---|
| P0 | Next.js/TypeScript/pnpm repository | Clean install, lint, typecheck, tests, build |
| P0 | Supabase Auth and organizations | Invitation/session flows pass |
| P0 | Schema/RLS | Cross-tenant and cross-family denial tests pass |
| P0 | Server-only environment contract | No secret in browser bundle |
| P1 | Design system and role shells | Desktop/mobile/keyboard/Axe pass |
| P1 | Synthetic demo seed | No real child data |

## Phase 2 — Complete vertical slice

| Priority | Deliverable | Exit condition |
|---|---|---|
| P0 | Child + guardian enrolment | Relationships and authorized pickup tested |
| P0 | Attendance | One active session invariant and corrections tested |
| P1 | Daily events/report | Educator review and parent view pass |
| P0 | Billing engine | Versioned math and edge-case unit tests pass |
| P1 | Invoice | Server-issued number, immutable lines, PDF/export |
| P1 | Parent portal | Only authorized child/report/invoice visible |
| P0 | Audit/export/deletion | Ownership, recent auth, expiry, deletion report |

## Phase 3 — Safety and operations

| Priority | Deliverable | Exit condition |
|---|---|---|
| P0 | Incidents | Complete/review/notify workflow |
| P0 | Medication | Authorization, trained role, immutable log |
| P1 | Rooms and ratios | Versioned deterministic policy |
| P1 | Staff shifts/timesheets | Conflict detection and export |
| P1 | Documents/consents | Expiry, signatures, signed access |
| P1 | Notifications | Review, idempotency, provider failure |
| P1 | PWA/offline | Queue, conflict, revocation, no data leak |

## Phase 4 — AI copilot

| Priority | Deliverable | Exit condition |
|---|---|---|
| P1 | Policy search with citations | Injection and citation tests pass |
| P1 | Daily report draft | Minimum fields, review-before-publish |
| P1 | Invoice explanation | No authoritative math in model |
| P1 | Attendance/ratio explanation | Deterministic tools required |
| P2 | Coverage proposal | User approval; no silent schedule update |
| P2 | Message drafting | No auto-send |
| P0 | AI audit/cost/privacy | Field manifest, model version, redaction, hard limits |

## Phase 5 — Vercel release

| Priority | Deliverable | Exit condition |
|---|---|---|
| P0 | Exact-commit Preview | All gates tied to deployed SHA |
| P0 | Security scans | No critical/high finding or secret |
| P0 | Backup/restore | Isolated restore and RLS verification |
| P1 | Performance/accessibility | Budgets and Axe pass |
| P0 | Privacy/legal review | Public wording, retention, processor terms approved |
| P0 | Production authorization | Separate owner approval |

## Suggested solo-development sequencing

```text
Week 1:
foundation, schema, auth, RLS, design shell

Weeks 2–3:
enrolment, attendance, daily report, billing, parent portal

Weeks 4–5:
safety, staff, documents, PWA/offline

Weeks 6–7:
AI tools, approval, evals, cost/privacy

Week 8:
hardening, Preview, backup/restore, portfolio package
```

This is an engineering estimate, not a fixed commitment. Jurisdictional, payment, email, legal, and provider decisions can add time.

## Quick wins from the current sources

1. Preserve NannyBill rate options and invoice preview as domain requirements.
2. Write unit tests for current billing examples before rebuilding UI.
3. Replace “client” with normalized child/guardian relationships.
4. Remove all browser database credentials and bank variables.
5. Establish one date/time/money library boundary.
6. Convert the four tabs into role-aware routes.
7. Create one synthetic centre with child, guardian, staff, attendance, and invoice fixtures.
8. Add error/empty/loading/saving/undo states.
9. Create the source/licence register before copying any code.
10. Install AI packages only after the deterministic vertical slice passes.
