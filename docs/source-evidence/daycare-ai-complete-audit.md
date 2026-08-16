# Daycare AI — Complete Product, Architecture, Code, UX, Security, Performance, and Vercel Audit

**Prepared from:** `folk-care.zip`, `nannybill.zip`, and `ai(10).zip`  
**Audit date:** 2026-08-15  
**Status:** Evidence-based audit and redesign specification; no uploaded source was overwritten, merged, deployed, or represented as production-ready.

## 1. Executive decision

Do **not** literally merge the three ZIPs.

The strongest consolidation is a clean-room rebuild:

- **NannyBill** is the best product-domain seed because it contains the clearest childcare workflow: children/guardians, attendance sessions, rate rules, invoice aggregation, and PDF invoices.
- **Folk Care** is a large home-health platform and should be treated as an architecture and workflow pattern source only. Its useful patterns include role-aware operations, schedules, family engagement, incident reporting, medication records, staff time/payroll, auditability, and offline mobile work. It is not a safe daycare foundation because its domain, regulatory assumptions, source size, incomplete surfaces, mixed authentication model, and AGPL licence create major risk.
- **The Vercel AI SDK repository** is an SDK monorepo, not a deployable childcare app. Install its published packages and reuse its typed tool, structured-output, streaming, approval, and testing patterns. Do not copy or merge the monorepo.

### Recommended working product

**Working name:** **NurtureOps AI**  
**Descriptor:** AI-assisted childcare operations, billing, and family communication.

This name is a working product direction only. Trademark, corporate-name, app-store, social-handle, and domain clearance remain required.

### Product promise

> One secure workspace for enrolment, attendance, room ratios, daily child updates, staff scheduling, billing, safety records, and carefully supervised AI assistance.

### Primary audiences

1. Childcare centre owner/administrator
2. Educator, nanny, childminder, or room lead
3. Parent or guardian
4. Bookkeeper/operations staff
5. Restricted safety/compliance reviewer

## 2. Audit method and limitations

### Inspected

- Archive structure, embedded Git metadata, source scale, packages, dependencies, routes/screens, data models, database access, environment variables, security boundaries, tests, TODOs/placeholders, licensing, deployment configuration, and representative high-risk code.
- Exact archive hashes and source Git revisions.
- NannyBill build command was attempted from the extracted workspace.

### Not claimed

- No source archive was deployed.
- Folk Care's entire test suite was not executed; it is a large multi-package platform with external database/provider requirements.
- NannyBill's clean build was not independently proven because dependency installation was incomplete; the partial install produced missing type-definition errors.
- No legal opinion is given. Licence, privacy, childcare-regulatory, tax, employment, and payment decisions require qualified review for the intended launch jurisdiction.
- No feature is called integrated merely because a similar feature exists in a source archive.

## 3. Source inventory summary

| Source | Exact role in target | Direct reuse | Main reason |
|---|---|---:|---|
| `nannybill.zip` | Daycare product/domain seed | Blocked pending licence clarification; prefer clean-room rewrite | Clear childcare attendance/billing value, but unsafe browser-held DB credentials, no auth/tenant boundary, no tests, and no actual licence file |
| `folk-care.zip` | Operational workflow and architecture pattern source | No, unless the target deliberately complies with AGPL-3.0 | AGPL-3.0, healthcare-specific complexity, mixed authentication, incomplete mobile/TODO surfaces, and excessive scope |
| `ai(10).zip` | Published SDK dependency and AI design reference | Use published packages, not repository source | Apache-2.0 SDK monorepo; valuable typed tools/streaming/structured outputs, but not an app foundation |

## 4. Product architecture audit

### 4.1 Fragmentation

#### Observation

The three archives represent three different product layers:

- NannyBill is a small single-user browser application.
- Folk Care is a large multi-vertical healthcare platform.
- Vercel AI is an SDK development monorepo.

There is no shared identity model, tenancy model, route architecture, database boundary, role model, or release contract.

#### Why this matters

A literal merge would produce:

- competing package managers and build systems;
- duplicate attendance/billing concepts with incompatible schemas;
- healthcare terms leaking into childcare;
- two conflicting database approaches;
- an enormous SDK source tree;
- unclear licensing;
- multiple authentication models;
- a portfolio that looks assembled rather than designed.

#### Recommendation

Create one new production application and translate capabilities into a daycare-specific domain model. Preserve source attribution in a provenance register, but do not import repository histories, demo data, deployment folders, provider credentials, or unrelated branding.

### 4.2 Missing connections in the current childcare flow

NannyBill currently supports only:

```text
register child/parent
→ check in/out
→ calculate charge
→ generate invoice
```

A credible daycare platform needs the connected lifecycle:

```text
centre setup
→ invite staff
→ enrol child and guardians
→ collect consent and authorized pickups
→ configure room, schedule, billing contract, subsidy/credit
→ check in/out
→ record meals, naps, toileting, mood, activities, incidents, and medication
→ validate room ratio
→ publish reviewed daily report
→ calculate and review invoice
→ parent views report/invoice
→ payment/reconciliation
→ export, audit, retention, and deletion
```

### 4.3 Unnecessary complexity

Folk Care contains many valuable concepts, but its complete architecture is excessive for the first daycare release:

- 18 vertical packages
- web, mobile, app, core, and shared packages
- 71 migrations
- payroll, clinical documentation, EVV, medication, analytics, quality, burnout prediction, and integrations
- many files above 1,000 lines
- extensive healthcare/state-specific assumptions

The first daycare release should not inherit this operational weight.

### 4.4 Simplification principle

Use three role-correct experiences:

1. **Operator workspace** — enrolment, staff, attendance, rooms, billing, safety, reporting.
2. **Educator mobile/PWA** — attendance, room roster, daily events, incident/medication records, offline queue.
3. **Family portal** — approved daily reports, attendance history, invoices, documents, messages, consents.

AI is a supporting copilot, never the primary navigation model.

## 5. Codebase audit — NannyBill

### 5.1 What is worth preserving conceptually

- Live attendance board
- Hourly and fixed-day billing
- Daily cap
- Custom invoice period
- Invoice status
- PDF invoice preview/export
- Light/dark/warm visual themes
- Basic loading, error, and empty states
- Compact product scope

### 5.2 P0 security findings

#### P0 — Database credential is browser-accessible

**Evidence**

- `src/db/client.ts` reads `VITE_TURSO_AUTH_TOKEN` in browser code and falls back to `localStorage`.
- `src/components/Settings.tsx` displays, accepts, tests, and stores the database token in `localStorage`.
- Browser code creates the LibSQL client, runs migrations, queries tables, and can reset all data.

**Impact**

Any XSS, malicious extension, shared device, browser inspection, or bundled environment value can expose database access. There is no trusted server authorization boundary.

**Required correction**

Move all data access to authenticated server code. The browser should receive only user-scoped data. Never store database/admin tokens in browser storage.

#### P0 — Bank details are exposed through Vite variables

**Evidence**

`.env.example` uses:

```text
VITE_BANK_SORT_CODE
VITE_BANK_ACCOUNT_NUMBER
VITE_BANK_ACCOUNT_NAME
```

Invoice preview and PDF code read those values in browser modules.

**Impact**

Every `VITE_*` value is intended for client code. This is incompatible with treating bank/payment configuration as a secret or restricted business setting.

**Required correction**

Store payment instructions in an authorized provider profile on the server. Return only the approved invoice rendering fields to authorized users. Do not commit live bank values.

#### P0 — No authentication, tenancy, or role authorization

**Evidence**

The app connects to one database and exposes Dashboard, Clients, Invoices, Settings, migrations, and reset actions with no user account or organization boundary.

**Impact**

It cannot safely support multiple centres, staff, families, or restricted records.

**Required correction**

Add organizations, centres, memberships, role grants, sessions, and row-level authorization. Parents must never see another family's children, records, or invoices.

### 5.3 P1 architecture findings

#### SQL is embedded in UI components

`Dashboard.tsx`, `ClientList.tsx`, and `InvoiceList.tsx` directly run SQL and own fetching, mapping, domain math, modal state, errors, and rendering.

**Impact:** difficult testing, duplicated logic, fragile changes, impossible server authorization.

**Recommendation:** use feature services, repositories, typed queries/commands, and route/server boundaries.

#### Oversized components

- `Dashboard.tsx`: 906 lines
- `InvoiceList.tsx`: 533 lines
- `ClientList.tsx`: 440 lines
- `Settings.tsx`: 233 lines
- `index.css`: 1,247 lines

**Recommendation:** split by feature and responsibility, not arbitrary component size.

#### No route architecture

`App.tsx` uses a four-value tab state rather than URLs.

**Impact:** no deep links, browser-history semantics, route-level authorization, code splitting, or meaningful error boundaries.

#### Browser-run migrations and destructive reset

Settings can run schema migrations and permanently delete all application records.

**Recommendation:** migrations belong in deployment/admin tooling; destructive operations require recent authentication, role checks, preview, audit, and idempotent jobs.

#### Time refresh effect churn

`Dashboard.tsx` uses a minute interval that increments `timeTrigger`, while the effect depends on `timeTrigger`. The interval and data load are repeatedly torn down and recreated.

**Recommendation:** separate the clock tick from server-data fetching; derive live duration client-side.

#### Month calculation mutation bug

The code mutates `now` while computing Monday:

```ts
const startOfWeek = new Date(now.setDate(diffToMonday));
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
```

Near a month boundary, computing the week can move `now` into a different month before the month query is built.

**Recommendation:** never mutate the reference date. Use independent date values and unit tests around month/year/timezone boundaries.

#### Multiple open sessions are possible

No database constraint prevents more than one `attendance_logs` row with `check_out IS NULL` per child. The client maps active logs by child and silently overwrites duplicates.

**Recommendation:** enforce an invariant transactionally, with a partial unique index or service-level lock plus database protection.

#### Billing rules are distributed

Live charge calculation, checkout calculation, manual edits, invoice aggregation, and PDF display can drift.

**Recommendation:** create one pure, versioned billing engine and immutable invoice-line snapshots.

#### Client-side invoice identity/idempotency

Invoice numbers can be generated in the browser and uniqueness is delegated to a database error.

**Recommendation:** issue invoice numbers transactionally on the server, use idempotency keys, and maintain status/audit history.

#### No automated test foundation

The source includes no unit, integration, browser, RLS, or accessibility test files.

#### Licence evidence is inconsistent

README says MIT and points to `LICENSE`, but no licence file is present and `package.json` declares no licence.

**Decision:** treat direct reuse as blocked until the author supplies or verifies the exact licence.

### 5.4 Build verification

The package exposes `dev`, `build`, `lint`, and `preview`, but no tests.

The attempted build stopped during TypeScript initialization because the extracted workspace had an incomplete dependency install and missing type libraries. This is **not** proof that the source can never build; it means a clean reproducible build was not independently established during this audit.

## 6. Codebase audit — Folk Care

### 6.1 Valuable patterns

The following verticals are useful conceptually:

| Folk Care concept | Daycare translation |
|---|---|
| client demographics | child and guardian enrolment |
| caregiver staff | educator/nanny staff records |
| scheduling visits | classroom/staff schedules |
| EVV/time tracking | child attendance and staff timesheets |
| care plans/tasks | routines, child plans, allergies, activities |
| billing/invoicing | childcare contracts, subsidies, invoices |
| family engagement | parent portal and reviewed updates |
| payroll | staff timesheets/payroll export |
| incident reporting | accident/incident workflow |
| medication management | consent, schedule, administration log |
| visit notes | daily child report |
| quality/audits | licensing/compliance evidence |
| shift matching | ratio-aware staffing suggestions |
| offline mobile | educator PWA/mobile continuity |

### 6.2 Licence conflict

- Root `package.json` says `AGPL-3.0`.
- The repository `LICENSE` is GNU Affero GPL v3.
- README says “MIT license.”

The licence file and package metadata are the stronger evidence. Directly incorporating Folk Care code into a networked product can impose AGPL obligations. Do not copy source into a closed or differently licensed app without qualified legal review.

### 6.3 P0 authentication inconsistency

The application globally installs `authContextMiddleware`, labelled in source as a mock. It trusts caller-supplied headers including:

```text
X-User-Id
X-Organization-Id
X-Branch-Id
X-User-Roles
X-User-Permissions
```

Defaults include `system` and `CAREGIVER`.

A separate core middleware correctly validates JWT bearer tokens, user status, and token version. The coexistence of these two identity models is dangerous because route code uses both `req.user` and `req.userContext`.

**Decision:** do not inherit this authentication layer. Use one identity system and one authorization contract.

### 6.4 “Production ready” is not consistently supported

The repository has mature tooling, but source inspection found incomplete surfaces:

- offline/mobile data loading TODOs
- location and biometric integration TODOs
- queue/sync TODOs
- placeholder E2E helpers
- placeholder speech recognition
- placeholder media
- simplified ML model logic
- auth-context TODOs
- large demo and seed surfaces

This should be described as a substantial reference platform, not presumed production-ready evidence for the daycare app.

### 6.5 Complexity and maintainability

Evidence:

- 1,869 source files excluding Git and node_modules
- 1,062 TypeScript files
- 319 TSX files
- 18 vertical packages
- 71 migrations
- 176 test/spec files
- generated types over 5,000 lines
- multiple service/repository/route/UI files over 1,000 lines

Good ideas—vertical ownership, audit logs, role-aware workflows, mobile/offline design—are worth translating. The implementation scale is not appropriate for the target's first release.

### 6.6 Additional security/operational concerns

- Demo credentials are published in README.
- CORS accepts any origin containing `.vercel.app`, rather than a controlled deployment allowlist.
- Embedded deployment, Kubernetes, Terraform, provider, demo, and secret-template material must be excluded from consolidation.
- Healthcare/EVV/US state compliance must not be represented as childcare compliance.

## 7. Codebase audit — Vercel AI SDK repository

### 7.1 What it is

A large SDK monorepo:

- 7,231 non-Git source files
- more than 5,000 TypeScript files
- packages, examples, docs, fixtures, providers, tests, releases, and tooling
- `ai` package version 7.0.42
- `@ai-sdk/react` version 4.0.45
- Node >=22
- Apache-2.0

### 7.2 Correct consolidation decision

Install published packages. Do not copy:

```text
.git
packages/
apps/
content/
examples/
provider source
fixtures
changesets
Turbo configuration
release tooling
SDK tests
```

### 7.3 Patterns to retain

- `ToolLoopAgent`
- typed tools and messages
- `Output.object` with Zod
- streaming response states
- `useChat`
- tool approval
- retry/error states
- provider-neutral model boundary
- mocked model tests

### 7.4 Important architecture rule

Use deterministic code for attendance, billing, medication, ratios, access control, and incidents. Use the model only for bounded draft/explanation tasks. Agent loops are suitable for exploratory operator questions; structured workflows are safer for repeatable sensitive operations.

## 8. UX audit

### 8.1 NannyBill strengths

- Immediate operational value
- Simple vocabulary
- Useful empty/loading/error states
- Live attendance visibility
- Rate model and invoice preview
- Responsive/theme effort

### 8.2 NannyBill friction

#### Database credentials masquerade as onboarding

A childcare user is asked to configure Turso rather than set up a centre.

**Replacement onboarding:**

```text
create centre
→ jurisdiction/timezone/currency
→ invite staff
→ add rooms and operating hours
→ enrol first child and guardians
→ configure billing agreement
→ choose check-in policy
```

#### “Clients” is not the correct information model

Child and parent are flattened into one record. This breaks families with multiple children, multiple guardians, shared custody, authorized pickups, multiple contracts, changing enrolments, and guardian-specific permissions.

#### No role-correct experience

Admin, educator, nanny, parent, and bookkeeper all need different navigation and permissions.

#### Destructive browser prompts

`window.confirm` and `window.prompt` are weak for permanent child/invoice/database deletion. Use accessible dialogs with impact summaries, recent auth, typed confirmation only for truly destructive operations, and audit records.

#### No parent journey

There is no parent portal, consent flow, daily report, invoice delivery, document exchange, or controlled communication.

#### No safety workflow

No incident, allergy, medication, pickup authorization, emergency contact, or attendance handoff workflow.

### 8.3 Folk Care UX risks if copied

- Clinical/home-health terminology
- Too many verticals and dashboards
- High cognitive load
- workflow density beyond a small daycare operator
- state-specific healthcare compliance language
- incomplete mobile flows

### 8.4 Target navigation

**Operator**

```text
Today
Children
Attendance & Rooms
Staff & Schedule
Families
Billing
Safety
Reports
Documents
Settings
```

**Educator mobile/PWA**

```text
Today
Room
Check In/Out
Daily Updates
Safety
More
```

**Parent**

```text
Home
Daily Reports
Attendance
Invoices
Documents
Messages
Profile
```

## 9. Security and privacy architecture

Childcare information is highly sensitive even when it is not classified as medical data.

### Required principles

- minimum necessary collection
- private by default
- server-side sessions
- organization/centre tenancy
- least-privilege roles
- Row Level Security
- immutable audit events
- recent authentication for export/deletion/financial changes
- no secrets in client variables or localStorage
- file scanning and short-lived signed URLs
- explicit guardian relationships
- authorized-pickup rules
- field-level purpose/retention register
- no raw child content in analytics or model logs
- encryption at rest/TLS from providers, with selective application encryption evaluated separately
- tested export, correction, deletion, and retention workflows
- no production child data in demo, test, Preview, logs, screenshots, or AI evaluations

### Role model

```text
platform_admin
organization_owner
centre_admin
educator
room_lead
bookkeeper
family_guardian
restricted_safety_reviewer
```

Authorization must be based on non-user-editable grants, not client-supplied role headers or profile metadata.

## 10. Recommended target product

### 10.1 Release 1 vertical slice

Build this end to end before adding broad AI:

```text
centre setup
→ staff invitation
→ child and guardian enrolment
→ room assignment
→ attendance check-in/out
→ structured daily events
→ reviewed daily report
→ billing calculation
→ invoice preview
→ parent portal view
→ audit/export/delete
```

### 10.2 Core modules

1. Organization and centres
2. Authentication, invitations, memberships, roles
3. Children, guardians, relationships, authorized pickups
4. Enrolments, rooms, schedules, capacity and ratio policies
5. Attendance sessions and handoff
6. Daily events and reviewed reports
7. Allergies, plans, incidents, medication authorization/administration
8. Staff shifts and timesheets
9. Billing agreements, subsidies/credits, invoices, payments/reconciliation
10. Family portal and reviewed communications
11. Documents, consent, expiry, signatures
12. Audit, export, retention, and deletion
13. PWA/offline queue
14. AI copilot and approval records

## 11. AI product design

### 11.1 Useful launch AI tools

```text
draftDailyReport
explainInvoice
detectAttendanceAnomalies
detectRatioRisk
proposeStaffCoverage
checkIncidentCompleteness
searchCentrePolicies
draftGuardianMessage
```

### 11.2 Hard prohibitions

AI must not:

- diagnose a child
- determine developmental or medical status
- decide medication actions
- approve an incident report
- edit attendance silently
- charge a family
- change staff schedules automatically
- send a parent message automatically
- infer abuse, neglect, or parental fitness as a final conclusion
- produce compliance/legal guarantees
- use raw child data without explicit, field-level preview and approved provider terms

### 11.3 Approval model

```text
deterministic tool retrieves authorized data
→ model produces typed draft/explanation
→ policy validation
→ user sees exact input fields and output
→ user edits/rejects/approves
→ deterministic command revalidates authorization and invariants
→ mutation occurs
→ audit event and Undo/reversal where valid
```

### 11.4 AI data model

Every AI run should record content-free or minimized metadata:

```text
organization_id
actor_id
feature
tool names
model/provider
prompt/policy version
input field manifest
source record IDs
output schema version
review status
approval actor/time
result class
latency/token/cost metadata
no raw child text in ordinary operational logs
```

## 12. Target technical architecture

### Recommended stack

- Next.js 16 Active LTS patched release
- React 19
- Node 24 LTS
- strict TypeScript
- pnpm with committed lockfile
- Supabase Auth + PostgreSQL + Storage
- RLS and explicit grants
- Vercel
- AI SDK published packages
- Zod
- Vitest
- Playwright + Axe
- PWA after core server flows stabilize
- Expo later, not in the first web release

### Why Next.js instead of retaining Vite

NannyBill needs trusted server code, authenticated routing, server-side invoice/data operations, route-level authorization, and Vercel functions. Replacing the browser-direct database with a Vite-only SPA plus separate backend would create two deployment surfaces. One Next.js application is simpler for this scale.

### Why not retain Folk Care's Express monorepo

The target does not need 18 independently deployable healthcare verticals. A modular monolith with explicit feature boundaries is easier to test and deploy while the domain is still evolving.

### Why Supabase

Supabase Auth integrates with JWT-based sessions and PostgreSQL RLS. It supports one authoritative relational model for centres, families, attendance, billing, and audit data. Use the SSR package for Next.js cookie sessions, and keep privileged/admin access server-side.

## 13. Proposed folder structure

```text
nurtureops-ai/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (operator)/
│   │   ├── today/
│   │   ├── children/
│   │   ├── attendance/
│   │   ├── rooms/
│   │   ├── staff/
│   │   ├── schedules/
│   │   ├── families/
│   │   ├── billing/
│   │   ├── safety/
│   │   ├── reports/
│   │   └── settings/
│   ├── (family)/
│   │   └── family/
│   └── api/
│       ├── ai/
│       ├── webhooks/
│       └── jobs/
├── features/
│   ├── organizations/
│   ├── enrollment/
│   ├── children/
│   ├── guardians/
│   ├── attendance/
│   ├── rooms/
│   ├── daily-reports/
│   ├── scheduling/
│   ├── billing/
│   ├── incidents/
│   ├── medication/
│   ├── documents/
│   ├── communications/
│   └── ai-copilot/
├── domain/
│   ├── attendance/
│   ├── billing/
│   ├── ratios/
│   ├── scheduling/
│   └── safety/
├── server/
│   ├── auth/
│   ├── db/
│   ├── repositories/
│   ├── services/
│   ├── ai/
│   │   ├── agent.ts
│   │   ├── tools/
│   │   ├── policies/
│   │   └── schemas/
│   ├── audit/
│   └── jobs/
├── components/
│   ├── ui/
│   ├── shell/
│   └── forms/
├── supabase/
│   ├── migrations/
│   ├── seed/
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── rls/
│   └── e2e/
└── docs/
```

## 14. Core data model

```text
organizations
centres
users/auth.users
profiles
memberships
role_grants
children
guardians
child_guardians
authorized_pickups
enrollments
rooms
room_assignments
staff_profiles
staff_qualifications
staff_shifts
attendance_sessions
attendance_events
daily_events
daily_reports
child_plans
allergies
medication_authorizations
medication_administrations
incidents
incident_reviews
billing_agreements
subsidies
credits
invoice_sequences
invoices
invoice_lines
payments
communications
documents
consents
audit_events
export_jobs
deletion_requests
ai_runs
ai_approvals
```

### Important invariants

- one active attendance session per child per centre
- child must have active enrolment before ordinary check-in
- checkout must follow check-in
- invoice lines are immutable snapshots
- invoice sequence issued transactionally
- every guardian view requires active relationship and allowed scope
- medication administration requires valid authorization and trained staff role
- room ratios are deterministic and jurisdiction/version aware
- AI cannot bypass commands, RLS, or invariants

## 15. Billing engine design

Use one versioned pure domain service:

```ts
type BillingInput = {
  agreementVersion: string;
  timezone: string;
  attendance: AttendanceInterval[];
  rateRules: RateRule[];
  credits: Credit[];
  subsidies: Subsidy[];
  period: DateRange;
};

type BillingResult = {
  lines: InvoiceLineDraft[];
  subtotal: Money;
  credits: Money;
  total: Money;
  calculationVersion: string;
  explanation: BillingExplanation[];
};
```

Tests must cover:

- hourly rate
- daily fixed rate
- daily cap
- grace periods
- late pickup
- overnight/timezone/DST
- overlapping or duplicate sessions
- edited attendance
- subsidy and credit
- rounding
- zero/negative prevention
- idempotent regeneration
- immutable issued invoice

AI may explain the deterministic result. It may not calculate the authoritative invoice.

## 16. Performance design

### NannyBill fixes

- server pagination instead of loading all records
- indexed centre/date/status queries
- separate clock updates from data fetching
- no refetch every minute to update durations
- server-side or worker PDF generation
- cached dashboard aggregates
- virtualized long rosters only when evidence requires it
- no database migrations in browser startup

### Folk Care lessons

- keep feature boundaries, but start as a modular monolith
- set file and complexity budgets
- avoid generated mega-files in ordinary review
- keep seed/demo data outside production paths
- use one deployment and one database initially
- add vertical extraction only when independent scaling/ownership is proven

## 17. Developer productivity

### Quick wins

- source/licence/provenance register
- one package manager and lockfile
- strict TS and Zod at boundaries
- environment schema
- lint, formatting, typecheck, test, build scripts
- feature templates
- shared errors/result types
- one date/time and money library boundary
- centralized authorization helpers
- seeded synthetic demo centre
- `.env.example` with names only
- CI and Vercel Preview
- architecture decision records

### Medium refactors

- generated database types
- repository/service/command/query boundaries
- centralized billing engine
- role-aware application shell
- RLS test harness
- outbox for email/PDF/background work
- audit event library
- PWA offline mutation queue
- design system and form primitives

### Major architecture work

- jurisdiction/versioned ratio and billing policy system
- multiple centres/organizations
- subsidy/payment integrations
- mobile Expo client
- document OCR
- cited policy RAG
- advanced schedule optimization
- analytics warehouse with de-identified aggregates

## 18. Testing strategy

### Unit

- billing
- attendance invariants
- room ratios
- scheduling conflicts
- consent/retention rules
- AI schemas and policy validators

### Database/RLS

- cross-organization denial
- cross-family denial
- staff scope
- guardian relationship expiry
- admin/reviewer restrictions
- storage object ownership
- service-role never exposed

### Integration

- enrolment
- check-in/out
- daily report approval
- invoice issuance
- export/delete
- email/PDF job idempotency
- AI review-before-apply

### Browser

- operator, educator, parent journeys
- keyboard/focus
- responsive/mobile
- offline
- error/loading/empty
- destructive confirmation
- accessibility/Axe
- invoice and report downloads

### AI evaluation

- tool required before factual data claim
- no unauthorized child data
- refusal/deferral for medical/developmental diagnosis
- typed output validation
- prompt injection in uploaded policy docs
- no automatic mutation/send/charge
- source citation accuracy
- provider outage fallback

## 19. Vercel deployment contract

### Environment names

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
AI_GATEWAY_API_KEY
AI_MODEL
RESEND_API_KEY
APP_URL
CRON_SECRET
```

Only publishable identifiers may use `NEXT_PUBLIC_`. The service-role, AI, email, payment, webhook, and signing secrets remain server-only.

### Background work

Start with a Postgres outbox plus a bounded scheduled worker for invoices, PDFs, emails, exports, and retention. Vercel Queues is currently beta and can be evaluated later if the owner accepts that product maturity and data-residency model.

### Release gates

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:rls
pnpm build
pnpm test:e2e
```

Block release when:

- any browser-held database/admin secret exists
- RLS/cross-tenant denial is not proven
- billing invariants fail
- AI can write/send/charge without explicit approval
- child data appears in logs or test artifacts
- critical/serious accessibility findings remain
- mobile attendance/offline flow fails
- invoice sequence is not idempotent
- production build or exact-commit Preview fails

## 20. Prioritized roadmap

### Phase 0 — provenance and product decisions

- freeze literal source merge
- decide product name, jurisdiction, currency, tax/invoice model
- decide direct reuse policy
- record Folk Care as AGPL reference only
- obtain NannyBill licence clarification
- create threat model and data inventory

### Phase 1 — foundation

- scaffold Next.js
- auth, organizations, centres, roles
- schema/RLS
- design system
- synthetic demo data
- CI/Preview

### Phase 2 — end-to-end daycare vertical slice

- child/guardian enrolment
- attendance
- daily events/report
- billing agreement
- deterministic invoice
- parent view
- audit/export/delete

### Phase 3 — safety and operations

- rooms/ratios
- staff scheduling/time
- incidents
- medication
- authorized pickup
- documents/consents
- notifications
- PWA/offline

### Phase 4 — AI copilot

- policy search
- daily report draft
- invoice explanation
- attendance/ratio anomaly explanation
- schedule suggestion
- message drafting
- approval/audit/cost controls

### Phase 5 — release hardening

- full RLS and E2E
- accessibility
- performance budgets
- backup/restore
- incident response
- privacy/legal review
- exact-commit Vercel Preview
- Production authorization

## 21. Name recommendations

All names require legal and domain clearance.

1. **NurtureOps AI** — strongest B2B operations positioning.
2. **KinderLedger** — emphasizes attendance, reports, and billing; verify “Kinder” brand/trademark risk.
3. **CareCanvas AI** — broader family/child record and workflow identity.
4. **BrightNest Ops** — warmer parent-facing identity.
5. **Daycare AI** — clearest working descriptor, weakest distinctiveness.

Avoid adopting a name merely because a domain appears available.

## 22. Final verdict

### Preserve

- NannyBill's focused attendance/billing value
- Folk Care's operational and audit patterns
- AI SDK's published typed tools, streaming, structured output, and approval patterns

### Rewrite

- all database/auth/data-access boundaries
- childcare domain model
- billing engine
- routing and role experiences
- safety/consent/audit
- AI integration
- deployment architecture

### Reject

- direct browser database token
- client-exposed bank configuration
- literal Folk Care code merge without AGPL decision
- Folk Care's mock header authentication
- full AI SDK repository merge
- healthcare/EVV language
- generic chatbot-first UX
- autonomous AI mutations
- production claims based only on README text

### Recommended next action

Authorize a clean-room Next.js rebuild with a single vertical slice. Do not spend another cycle trying to reconcile three incompatible source trees.
