# NURTUREOPS AI / DAYCARE AI
# MASTER CODEX AUDIT, CLEAN-ROOM REBUILD, TEST, GITHUB, SUPABASE, VERCEL PREVIEW, AND DEMO-PRODUCTION PROMPT

## How to use this prompt

Place these three original ZIP archives in the same Codex workspace:

```text
folk-care.zip
nannybill.zip
ai(10).zip
```

Also include the completed audit package when available:

```text
daycare-ai-audit-and-rebuild-package.zip
```

Run this prompt from a clean parent directory that is **not inside any of the
three extracted source repositories**.

Do not paste secrets, bank details, API keys, database passwords, real child
records, real family records, incident narratives, medical information, or
payment credentials into Codex chat.

---

# OWNER AUTHORIZATION

I, the project owner, authorize Codex to perform one broad, bounded execution
cycle to:

1. inspect and hash the uploaded archives;
2. preserve their exact source evidence;
3. create licence and provenance records;
4. create a new clean-room childcare application;
5. implement the product, architecture, security, UX, PWA, billing, testing,
   AI, documentation, and portfolio recommendations in this prompt;
6. create a feature branch and coherent commits;
7. create or update a GitHub repository when an authenticated connection is
   available;
8. push the feature branch and open a Draft pull request;
9. create one Supabase Free-plan project only when the displayed cost is
   exactly USD $0/month with no paid commitment, add-on, or subscription
   acceptance;
10. apply reviewed migrations and RLS to that project after local reset and
    dry-run verification pass;
11. create one Vercel project on the Free plan only when the displayed cost
    is exactly USD $0/month with no paid commitment;
12. create exact-commit Vercel Preview deployments;
13. run live browser, accessibility, security, PWA, AI-boundary, and
    responsive verification;
14. fix ordinary in-scope code defects found by those gates;
15. merge normally only after the final exact SHA passes all mandatory gates;
16. create one Vercel Production deployment for a **synthetic-data portfolio
    demonstration**;
17. verify the exact deployed Production SHA and record rollback.

This authorization is intentionally broad so Codex does not stop for routine
code, architecture, UX, test, documentation, commit, push, Preview, or
evidence decisions.

Codex must stop only at a genuine owner-only boundary, including:

```text
login or MFA that Codex cannot complete
secret or credential entry
choosing an ambiguous Supabase organization or region
choosing an ambiguous Vercel team
any displayed charge, paid plan, tax acceptance, add-on, or subscription
domain purchase or DNS change
legal or licence acceptance
real payment activation
real email/SMS provider activation
real child/family data import
real childcare-regulatory or safeguarding policy approval
production AI processing of real child/family data
custom domain activation
```

At an owner-only boundary:

1. finish every safe local and source-controlled task first;
2. stop at the exact smallest action;
3. state precisely what must be clicked, selected, or entered;
4. ask the owner to reply `ready`;
5. resume from the preserved state without restarting discovery.

Do not use administrator bypasses, force pushes, branch protection bypass,
secret disclosure, billing workarounds, or hidden provider mutations.

---

# ROLE

Act as a multidisciplinary senior team:

- AI Staff Engineer
- Principal Web and Mobile Architect
- Product Architect
- UX Researcher
- Product Manager
- Database Architect
- Security and Privacy Engineer
- Child Safeguarding and Trust Engineer
- Billing and Financial-Correctness Engineer
- Accessibility Lead
- Performance Engineer
- PWA and Offline Systems Engineer
- DevEx and Release Engineer
- Technical Writer
- Portfolio Case-Study Author

Your goal is not to combine folders mechanically.

Your goal is to build the next safe, maintainable, modern evolution of the
uploaded childcare concepts as one coherent application.

---

# PRODUCT IDENTITY

Working product name:

```text
NurtureOps AI
```

Working tagline:

```text
Childcare operations, family communication, attendance and billing—with
human-reviewed AI.
```

The name is provisional. Do not claim trademark, corporate-name, domain,
app-store, or social-handle clearance.

If the repository slug is available, prefer:

```text
nurtureops-ai
```

If unavailable, use a clear collision-safe name and record the final slug.

The first deployable release is:

```text
synthetic-data portfolio demonstration
responsive and accessible
Vercel-hosted
no real child or family data
no real payment processing
no unrestricted public signup
no legal/regulatory compliance claim
AI limited to synthetic/demo data or disabled with an honest unavailable state
```

A later real-childcare beta requires a separate legal, privacy, safeguarding,
provider, retention, and operational-readiness release.

---

# GOVERNING SOURCE DECISIONS

## 1. NannyBill

Use NannyBill as the childcare product and workflow seed through clean-room
reimplementation.

Useful concepts to retain:

```text
child/client records
attendance check-in and check-out
hourly rate
fixed daily rate
daily cap
attendance-derived cost
billing periods
invoice preview
invoice PDF
operator dashboard
themes
basic loading/empty/error states
```

Mandatory rejection or rewrite:

```text
browser Turso database URL/token
localStorage database credentials
VITE_BANK_* browser variables
browser-run schema migrations
browser database reset authority
single shared database without Auth or tenancy
direct SQL from React components
floating-point money
random invoice numbers
mutable/deletable issued invoices
invalid paid/unpaid toggle state machine
technical credential onboarding
large all-in-one components
no-test release model
```

Licence boundary:

```text
README claims MIT
archive contains no LICENSE file
package metadata does not verify a licence
```

Do not copy NannyBill source until ownership/licence is verified. Clean-room
recreate its useful workflows.

## 2. Folk Care

Treat Folk Care as an architecture and workflow pattern source only.

Controlling licence evidence:

```text
root package:
AGPL-3.0

LICENSE:
GNU Affero General Public License v3

README:
conflicting MIT claim
```

Do not copy AGPL source into the new product unless the owner separately
approves an AGPL distribution strategy after qualified legal review.

Translate useful patterns cleanly:

```text
organization and location roles
staff records
scheduling
room/coverage planning
family portal
attendance and offline event patterns
care instructions and routines
daily notes
incident workflow
medication-consent patterns
notifications
audits
quality checklists
reporting
timesheets
invoice and payroll-export concepts
```

Reject or defer:

```text
home-health and Medicaid EVV domain
state-specific aggregator integrations
clinical documentation and FHIR
hospitalization prediction
caregiver burnout ML
broad 50-state compliance claims
placeholder provider IDs
mock header authentication
wildcard Vercel CORS
fake Stripe webhook verification
raw server-error disclosure
browser AI processing of sensitive notes
27-package production topology unless measured need proves it
```

## 3. Vercel AI SDK archive

Treat `ai(10).zip` as the Vercel AI SDK source monorepo and evidence source,
not the application foundation.

Use current compatible **published packages** from the registry.

Useful patterns:

```text
typed UI messages
typed tools
structured output with Zod
streaming states
tool result components
explicit tool approval
bounded agent steps
provider-neutral model boundary
mock model testing
retry, timeout, and error states
```

Do not copy:

```text
embedded .git
packages directory
apps directory
content/docs sites
examples wholesale
provider implementations
fixtures
SDK tests
Changesets
Turbo workspace
release tooling
monorepo configuration
```

---

# PHASE 0 — SOURCE INGESTION, INTEGRITY, AND LICENCE REGISTER

Before creating application code:

1. Compute and record SHA-256, bytes, entry count, and uncompressed bytes for
   every ZIP.
2. Extract each ZIP into a separate read-only evidence directory.
3. Record embedded Git:
   - origin;
   - branch;
   - commit;
   - dirty status where determinable.
4. Inventory:
   - framework and versions;
   - package manifests;
   - routes;
   - components;
   - domain models;
   - database access;
   - environment names;
   - tests;
   - assets;
   - build/deployment files;
   - generated folders;
   - embedded secrets or suspicious financial values;
   - duplicate implementations.
5. Scan for secrets, bank details, real personal data, real child/family
   records, service-role keys, database tokens, provider keys, and private
   addresses.
6. Never copy `.git`, `node_modules`, build output, deployment output, cache
   folders, credentials, real data, or unrelated branding.
7. Create:

```text
docs/source-inventory.md
docs/licence-and-provenance-register.md
docs/consolidation-decision-register.md
docs/source-risk-register.md
```

8. Classify every retained capability as:

```text
PUBLISHED_DEPENDENCY
CLEAN_ROOM_REWRITE
CONCEPTUAL_TRANSLATION
ARCHITECTURE_REFERENCE
REJECTED
DEFERRED
BLOCKED
```

9. Stop before direct source reuse when licence or ownership is ambiguous.

---

# PHASE 1 — CREATE THE CLEAN APPLICATION FOUNDATION

Create a new application rather than modifying a source archive in place.

Use current patched stable production versions verified at execution time:

```text
Next.js App Router
React
Node LTS
TypeScript strict
pnpm
Supabase Auth
Supabase PostgreSQL
Supabase Storage
PostgreSQL RLS
Vercel
Zod
Vitest
Playwright
Axe
published Vercel AI SDK packages
```

Do not pin an experimental framework release merely because it is newest.

Use one package manager and one committed lockfile.

Prefer a modular monolith:

```text
nurtureops-ai/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── (parent)/
│   └── api/
├── features/
│   ├── identity/
│   ├── organizations/
│   ├── children/
│   ├── attendance/
│   ├── scheduling/
│   ├── care-log/
│   ├── incidents/
│   ├── family/
│   ├── billing/
│   ├── staff/
│   ├── documents/
│   ├── reports/
│   └── ai/
├── domain/
│   ├── money/
│   ├── time/
│   ├── permissions/
│   ├── identifiers/
│   ├── audit/
│   └── safeguarding/
├── db/
│   ├── migrations/
│   ├── policies/
│   ├── repositories/
│   ├── generated/
│   └── seed/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── shells/
│   └── feedback/
├── lib/
│   ├── auth/
│   ├── env/
│   ├── validation/
│   ├── security/
│   ├── observability/
│   ├── storage/
│   └── ai/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── rls/
│   └── e2e/
└── docs/
```

Architecture rule:

```text
route/component
→ typed command or query
→ server authorization and validation
→ transaction/repository
→ PostgreSQL
→ content-free audit event
```

Components never access the database directly.

Create:

```text
.env.example
README.md
AGENTS.md
docs/architecture.md
docs/product-requirements.md
docs/data-model.md
docs/development.md
docs/deployment.md
docs/rollback.md
```

Add:

- strict environment validation;
- safe public/server environment separation;
- typed result/error contracts;
- request IDs;
- content-free logging;
- zero-new-warning lint;
- formatting;
- pre-commit or pre-push checks where practical;
- CI workflow;
- synthetic seed data.

---

# PHASE 2 — PRODUCT INFORMATION ARCHITECTURE AND UX

Build three role-correct experiences.

## Director / Administrator shell

Primary navigation:

```text
Today
Children
Attendance
Rooms & Schedule
Families
Staff
Billing
Safety
Reports
Documents
Settings
```

## Staff / Educator shell

Mobile-first navigation:

```text
Today
Room
Check In/Out
Care Log
Incidents
Messages
More
```

## Parent / Guardian shell

Primary navigation:

```text
Home
Child Timeline
Attendance
Messages
Invoices
Documents
Profile
```

Required public/auth routes:

```text
/
 /about
 /privacy
 /terms
 /sign-in
 /forgot-password
 /accept-invite/[token]
 /onboarding
```

Required application routes:

```text
/today
/children
/children/[childId]
/attendance
/rooms
/rooms/[roomId]
/care-log
/incidents
/incidents/[incidentId]
/families
/staff
/billing
/billing/invoices/[invoiceId]
/reports
/documents
/settings
/parent
/parent/children/[childId]
/parent/invoices
```

UX requirements:

- meaningful URLs and deep links;
- route-level loading and error boundaries;
- first-run onboarding based on role, not database credentials;
- progressive disclosure;
- strong empty states;
- saving/saved/error states;
- offline and sync-pending states;
- visible conflict handling;
- safe destructive confirmation;
- Undo where valid;
- mobile bottom navigation where appropriate;
- keyboard navigation;
- visible focus;
- screen-reader names and status announcements;
- no color-only meaning;
- WCAG 2.2 AA;
- reduced-motion support;
- high-contrast/forced-colors review;
- no horizontal overflow from 320 px through desktop widths;
- light, dark, and system themes;
- clear distinction between demo and real operational capabilities.

Do not reproduce clinical/home-health language in the daycare UI.

---

# PHASE 3 — AUTH, TENANCY, ROLES, AND RLS

Use Supabase Auth as the only identity system.

Implement:

```text
organizations
locations
profiles
memberships
staff_profiles
role_grants
invitations
sessions/security events
```

Initial roles:

```text
organization_owner
director
staff
billing_manager
guardian
auditor
```

Rules:

1. Never authorize from editable `user_metadata`.
2. Service-role credentials remain server-only.
3. Every exposed table has explicit grants and RLS.
4. Every private row is organization-scoped.
5. Location-scoped records include `location_id`.
6. Guardians see only children with an active relationship.
7. Staff see only assigned locations/rooms and purpose-appropriate fields.
8. Billing users do not receive care or incident narrative access unless
   separately required and authorized.
9. High-risk role changes, exports, and destructive actions require recent
   authentication; design MFA readiness for privileged roles.
10. Record content-free role and access audit events.
11. Test cross-organization, cross-location, cross-family, revoked-role,
    expired-invitation, and stale-session denial.
12. Do not enable unrestricted public signup for the first release.

Create one-use, expiring invitations with:

- cryptographic random token;
- stored hash only;
- email binding;
- atomic consumption;
- revocation;
- replay prevention;
- rate limits;
- enumeration-safe errors.

---

# PHASE 4 — CHILDREN, GUARDIANS, CONSENTS, AND SAFETY DATA

Implement:

```text
children
guardians
child_guardians
emergency_contacts
authorized_pickups
child_care_profiles
allergies
care_instructions
consents
attachments
```

Requirements:

- minimum necessary fields;
- explicit sensitivity and visibility;
- private by default;
- guardian relationship scope;
- authorized pickup status and expiry;
- versioned consent;
- immutable consent history;
- no medical diagnosis feature;
- no AI inference over allergies, incidents, safeguarding, or care
  instructions by default;
- private storage buckets and signed URLs;
- upload type/size validation;
- synthetic demo identities only.

Do not claim the platform replaces medical, legal, safeguarding, or emergency
services.

---

# PHASE 5 — ROOMS, SCHEDULING, STAFFING, AND RATIO ALERTS

Implement:

```text
rooms
room_enrollments
staff_room_assignments
child_schedules
staff_shifts
staff_qualifications
ratio_policy_versions
ratio_observations
```

Features:

- room roster;
- child schedule;
- staff schedule;
- planned versus present counts;
- configurable ratio/capacity policies;
- deterministic alerts;
- conflict explanation;
- proposed staffing adjustments;
- no claim of legal compliance without jurisdiction-specific review.

Ratio and staffing suggestions are operational aids. They do not certify
licensing compliance.

---

# PHASE 6 — ATTENDANCE AND OFFLINE PWA

Implement:

```text
attendance_sessions
attendance_events
attendance_corrections
offline_event_receipts
sync_conflicts
```

Invariants:

- one active session per child and location;
- check-out cannot precede check-in;
- duplicate events are idempotent;
- corrections preserve original values;
- correction reason and actor are recorded;
- guardian/staff confirmation is explicit;
- UTC instants plus organization timezone;
- DST and overnight cases are tested;
- missing check-out has a review state;
- attendance changes do not silently rewrite issued invoices.

PWA requirements:

- installable;
- service-worker update path;
- offline-safe attendance and care events;
- minimal offline data;
- visible queued/syncing/synced/failed states;
- deterministic idempotency key;
- ordered replay;
- server authorization rechecked at sync;
- no silent conflict overwrite;
- bounded local retention;
- no complete child profile cache unless specifically justified and
  approved;
- device-loss threat documented.

---

# PHASE 7 — DAILY CARE LOG AND PARENT TIMELINE

Implement structured care events:

```text
meal
nap
toileting
activity
observation
mood
supply note
arrival note
departure note
```

Implement:

```text
daily_care_entries
daily_report_drafts
daily_reports
parent_visibility
```

Flow:

```text
staff records structured events
→ staff reviews the daily report
→ staff explicitly publishes
→ guardian sees only the approved report for their child
```

Requirements:

- no automatic publication;
- edit/version history;
- minimum sensitive free text;
- safe empty/loading/offline states;
- no cross-family leakage;
- parent timeline accessible on mobile;
- content-free operational audit.

---

# PHASE 8 — INCIDENTS, MEDICATION, DOCUMENTS, AND SAFEGUARDING

Implement a bounded incident workflow:

```text
draft
submitted
reviewed
guardian_acknowledged
closed
```

Include:

- incident facts;
- restricted notes;
- attachments;
- reviewer;
- acknowledgement;
- immutable history;
- least-privilege access;
- no automatic AI finalization;
- no fabricated regulatory submission success.

Medication support, when implemented for the demo, must be limited to:

- guardian authorization record;
- medication instructions;
- administration event;
- two-person or reviewed workflow where configured;
- audit;
- no clinical recommendation;
- no AI dosage/medical decision.

If the required jurisdictional or safeguarding policy is absent, implement
the data model and honest demo state, document the hold, and do not claim
operational compliance.

---

# PHASE 9 — FAMILY COMMUNICATION AND NOTIFICATIONS

Implement:

```text
message_threads
messages
announcements
notification_preferences
notification_deliveries
```

Requirements:

- role/relationship scope;
- no cross-family thread access;
- draft/review/send states;
- server-side validation;
- content-free provider logs;
- accessible message status;
- quiet hours;
- email/SMS provider adapter;
- deterministic local/demo fallback;
- no fake “sent” status when the provider is disabled.

Live email or SMS remains behind a secret/provider owner boundary.

---

# PHASE 10 — FINANCIALLY CORRECT BILLING

Implement one pure, versioned billing domain.

Core entities:

```text
contracts
rate_plans
subsidies
credits
invoice_sequences
invoices
invoice_lines
payments
credit_notes
billing_exports
```

Use:

```text
amount_minor BIGINT
currency CHAR(3)
```

Never use float, JavaScript binary floating point, or PostgreSQL `REAL` as
the authoritative money representation.

Support:

- hourly rate;
- fixed day rate;
- daily cap;
- grace period;
- late pickup;
- subsidies;
- credits;
- tax configuration only when explicitly approved;
- attendance exception review;
- draft preview;
- server-generated PDF;
- payment-ready adapter boundary.

Invoice state machine:

```text
draft → issued → paid
draft → void
issued → void or credit-note workflow
paid → refunded or credited
```

Rules:

1. Issued invoice lines are immutable.
2. An issued invoice is never deleted.
3. Corrections use void/credit records.
4. Invoice number is transactionally unique per organization.
5. Invoice calculations are deterministic and versioned.
6. Attendance edits after issue do not silently mutate the invoice.
7. PDF content is generated from immutable invoice data.
8. Bank/payment credentials do not enter client code.
9. Payment-provider state is separate from invoice state.
10. No simulated real-payment success.

The first portfolio Production may record synthetic/manual payment states but
must not activate a real payment processor without separate owner approval.

---

# PHASE 11 — REPORTS, EXPORT, RETENTION, AND DELETION

Implement:

- attendance report;
- room utilization;
- staffing coverage;
- billing summary;
- outstanding invoices;
- incident summary with role restrictions;
- account/organization export;
- retention/deletion workflow.

Export:

```text
asynchronous job
→ authorization and recent-auth check
→ versioned JSON
→ human-readable HTML/Markdown
→ manifest/data dictionary
→ short-lived signed download
→ expiry/deletion audit
```

Do not email exports as attachments.

Deletion must reconcile:

- Auth;
- PostgreSQL;
- Storage;
- generated reports;
- exports;
- provider artifacts;
- audit/retention exceptions.

Use synthetic data in all evidence.

---

# PHASE 12 — CARE COPILOT AI

Add a focused assistant named:

```text
Care Copilot
```

It is not a generic chatbot.

Use released AI SDK packages and a provider-neutral boundary.

Initial read tools:

```text
getDailyRoster
getRoomRatioStatus
getChildAuthorizedCareSummary
getAttendanceExceptions
calculateInvoicePreview
getCentrePolicyExcerpt
```

Initial proposal tools:

```text
draftParentUpdate
summarizeDailyNotes
proposeScheduleChange
draftIncidentSummary
draftInvoiceExplanation
proposeAttendanceCorrection
```

Rules:

1. Every factual operational claim comes from an authorized deterministic
   tool.
2. The model receives the minimum necessary fields.
3. Child medical, safeguarding, incident, allergy, medication, and deeply
   sensitive free text are excluded by default.
4. No model key enters the browser.
5. No provider body or sensitive prompt enters logs.
6. The assistant returns typed structured proposals.
7. It cannot directly check in/out, send, publish, charge, issue invoices,
   approve incidents, authorize pickup, alter roles, or modify safety data.
8. The UI shows evidence, warnings, before/after diff, and unavailable state.
9. The user explicitly approves.
10. The server revalidates role, relationship, current record version, and
    invariants.
11. Only then may a deterministic command mutate state.
12. Accepted mutations produce an audit event.
13. Rate, token, cost, timeout, retry, cancellation, and outage behavior are
    bounded.
14. Mock models cover tests.
15. AI-disabled mode leaves the core product fully usable.
16. Do not state medical, legal, safeguarding, developmental, or regulatory
    conclusions.
17. Never claim an action completed before the database transaction succeeds.

Create:

```text
docs/ai/tool-register.md
docs/ai/data-boundary.md
docs/ai/approval-contract.md
docs/ai/evaluation-plan.md
```

---

# PHASE 13 — SECURITY, PRIVACY, AND THREAT MODEL

Create:

```text
docs/security/threat-model.md
docs/security/data-inventory.md
docs/security/role-access-matrix.md
docs/security/child-data-boundary.md
docs/security/ai-data-boundary.md
docs/security/incident-response.md
docs/security/backup-restore.md
docs/security/retention-deletion.md
```

Address:

- compromised browser/session;
- cross-tenant/cross-family access;
- user-editable role forgery;
- leaked service-role key;
- invitation replay;
- XSS/CSRF;
- private file exposure;
- child data in URLs/logs/errors/analytics;
- administrator misuse;
- offline device loss;
- export exfiltration;
- deletion inconsistency;
- webhook replay;
- attendance manipulation;
- billing fraud;
- AI prompt injection;
- AI cross-family data leakage;
- provider/subprocessor exposure;
- backup restore;
- real-data contamination of demo evidence.

Required controls:

- secure headers and CSP;
- exact origin allowlist;
- CSRF/session strategy;
- rate limits;
- server-only secrets;
- environment schema;
- private storage;
- signed downloads;
- redacted errors;
- no real child data;
- dependency and secret scans;
- purpose-limited access;
- immutable content-free audit;
- least privilege;
- MFA-ready privileged-role design.

Do not claim HIPAA, PIPEDA, GDPR, COPPA, UK childcare, Canadian childcare,
US state, or other regulatory compliance without qualified jurisdictional
review and evidence.

---

# PHASE 14 — DEVELOPER PRODUCTIVITY AND CODE QUALITY

Required:

- feature-first folder ownership;
- no direct SQL in components;
- no giant global state store;
- server components by default;
- small client islands;
- reusable form fields and feedback components;
- central design tokens;
- central error/result model;
- type-safe identifiers and domain types;
- one Money implementation;
- one Time/Timezone implementation;
- one attendance state machine;
- one invoice state machine;
- schema migrations in source control;
- generated database types;
- deterministic seed;
- component catalogue or Storybook where practical;
- ADRs for major decisions;
- no lint warning budget;
- no disabled tests without exact justification;
- no dead copied code;
- no placeholder “production ready” claim.

Add scripts:

```text
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:rls
pnpm test:e2e
pnpm test:a11y
pnpm test:pwa
pnpm security:scan
pnpm build
pnpm verify
```

---

# PHASE 15 — TESTING AND ACCEPTANCE MATRIX

## Unit tests

Cover:

- minor-unit money;
- rounding;
- rate plans and caps;
- timezone/DST;
- attendance transitions;
- idempotency;
- invoice transitions;
- credits/voids;
- permissions;
- invitation token rules;
- AI schemas and proposal rules.

## Integration tests

Cover:

- repositories;
- transactions;
- audit events;
- attendance correction;
- invoice issue;
- credit note;
- exports;
- deletion orchestration;
- private storage;
- AI tool authorization;
- webhook signature where applicable.

## RLS tests

Require:

- cross-organization denial;
- cross-location denial;
- unrelated guardian denial;
- unassigned staff denial;
- billing-role boundary;
- revoked-role denial;
- private storage denial;
- no anonymous private-data access;
- service role absent from browser.

## Browser tests

Required journeys:

1. Owner creates organization/location.
2. Director invites staff.
3. Director creates a synthetic child and guardian.
4. Director configures authorized pickup and care information.
5. Director assigns room and schedule.
6. Staff checks child in.
7. Staff records structured daily care.
8. Staff checks child out.
9. Director reviews attendance exception.
10. Billing creates and issues an invoice.
11. Guardian sees only their child timeline and invoice.
12. Guardian cannot see another child.
13. Staff cannot access billing-only details.
14. Offline attendance syncs once without duplication.
15. Care Copilot drafts a proposal but cannot mutate without approval.
16. AI failure leaves deterministic workflows usable.
17. Export requires authorization and expires.
18. Deletion flow is honest and testable.

## Accessibility and responsive

Require:

- zero serious/critical Axe findings;
- keyboard completion of critical flows;
- visible focus;
- screen-reader status;
- no color-only state;
- no horizontal overflow;
- touch target review;
- 320 px mobile through desktop;
- reduced motion;
- install/update/offline PWA tests.

## Performance

Record:

- bundle size;
- route JS;
- LCP;
- CLS;
- INP;
- simple API p95;
- AI first-status latency;
- database query hot spots.

Do not claim a PASS without measured evidence.

---

# PHASE 16 — LOCAL RELEASE GATES

Before any push or remote resource creation:

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:rls
pnpm test:a11y
pnpm test:pwa
pnpm security:scan
pnpm build
pnpm test:e2e
```

Hard stop when:

- licence/provenance is ambiguous for copied source;
- a database/admin/provider secret is browser-visible;
- real child/family data appears;
- RLS fails;
- float money is authoritative;
- issued invoices are mutable/deletable;
- attendance idempotency fails;
- offline sync loses or duplicates events;
- AI can mutate/send/publish/charge without approval;
- AI can access unauthorized child/family data;
- serious/critical accessibility finding remains;
- horizontal overflow remains;
- applicable high/critical vulnerability remains;
- build fails;
- screenshots/evidence are not tied to the exact commit.

---

# PHASE 17 — GIT AND GITHUB

When local gates pass:

1. initialize or use the correct repository;
2. create:

```text
codex/nurtureops-ai-clean-room-rebuild
```

3. preserve archive hashes and audit documents;
4. commit coherent milestones;
5. do not commit ZIPs when repository size or licence policy makes that
   inappropriate—store their hashes and provenance instead;
6. push the branch;
7. open a Draft PR;
8. run CI on the exact head SHA;
9. require all checks;
10. after any source fix:
    - commit;
    - push;
    - require fresh CI;
    - require a fresh exact-commit Preview;
    - repeat affected live checks;
11. mark ready only after final gates;
12. merge normally—no force push and no admin bypass;
13. record the merged main SHA.

---

# PHASE 18 — SUPABASE REMOTE PROJECT

Create or use exactly one Supabase project for this application.

If creation is required:

```text
name:
NurtureOps AI

plan:
Free

cost:
must display exactly USD $0/month

region:
ask the owner only when no unambiguous approved region exists
```

Stop if the UI displays any payment, add-on, tax acceptance, or subscription
commitment.

Before remote migration:

1. run local Supabase reset;
2. run migrations twice from clean state;
3. run RLS and grant tests;
4. generate types;
5. run migration dry run;
6. verify there is no seed containing real child/family data;
7. verify no service-role key in source or browser.

Then:

- apply migrations once;
- verify migration history;
- verify tables, grants, RLS, functions, indexes, storage policies, and
  advisors;
- keep Auth/provider secrets out of source;
- keep demo synthetic-only;
- record rollback as reviewed forward migrations, not destructive reset.

---

# PHASE 19 — VERCEL PREVIEW

Create or use exactly one Vercel project:

```text
name:
nurtureops-ai

framework:
Next.js

plan:
Free

cost:
must display exactly USD $0/month
```

Stop at any paid commitment.

Preview requirements:

- exact Git commit SHA metadata;
- Preview target, never Production;
- no Production aliases;
- no custom domain;
- noindex/nofollow;
- synthetic data only;
- environment variable names documented;
- secret values entered only through the provider UI;
- Vercel Authentication or another protection method when available;
- no active temporary bypass credential after verification.

Run live checks:

```text
route smoke
role shells
Auth unavailable/configured states
Supabase RLS journeys
attendance
care log
billing
parent portal
AI-disabled and AI-demo states
recursive stylesheet and asset verification
Axe
keyboard/focus
responsive
PWA install/update/offline
security headers
noindex/robots/sitemap
secret/private-data scan
screenshots
```

Capture final Preview screenshots from the exact deployed SHA:

- desktop director Today;
- mobile educator Today;
- parent timeline;
- attendance;
- billing/invoice;
- Care Copilot proposal/approval;
- offline/sync state;
- responsive mobile navigation.

Do not use screenshots from an older SHA.

---

# PHASE 20 — DEMO PRODUCTION DEPLOYMENT

Production is authorized only as a synthetic-data portfolio demonstration
when every gate below passes.

Production must remain blocked if:

- real child/family data is present;
- public signup exposes an unreviewed real service;
- legal/privacy/safeguarding documents claim unsupported compliance;
- live payments are active without separate approval;
- live email/SMS is active without separate approval;
- live AI receives real child/family data;
- secrets are missing or exposed;
- CI, Preview, RLS, accessibility, security, PWA, billing, or browser gates
  fail.

Production configuration:

```text
synthetic/demo data only
noindex unless owner separately authorizes indexing
no real payment processor
no real email/SMS required
AI disabled or synthetic-data-only
no custom domain required
no compliance certification
```

After normal merge:

1. verify Production source SHA equals the merged main SHA;
2. deploy Production;
3. verify routes and assets;
4. rerun critical journeys;
5. rerun accessibility and responsive smoke;
6. verify noindex;
7. verify no active bypass credentials;
8. verify zero Production aliases other than the intended Vercel domain;
9. record previous deployment/rollback target;
10. leave `main` clean and synchronized.

---

# PHASE 21 — PORTFOLIO AND DOCUMENTATION PACKAGE

Create:

```text
README.md
docs/product-requirements.md
docs/architecture.md
docs/data-model.md
docs/security/threat-model.md
docs/security/role-access-matrix.md
docs/ai/tool-register.md
docs/ai/approval-contract.md
docs/testing.md
docs/deployment.md
docs/rollback.md
docs/operations.md
docs/limitations.md
docs/portfolio/nurtureops-ai-case-study.md
docs/portfolio/resume-entry.md
docs/portfolio/linkedin-description.md
docs/portfolio/screenshot-manifest.md
```

The case study must distinguish:

```text
observed source
clean-room translation
implemented feature
demo-only feature
deferred feature
blocked real-world activation
```

Do not invent clients, children, families, revenue, compliance, production
usage, partnerships, test results, or business outcomes.

---

# FINAL REPORTING FORMAT

Return exactly these sections.

## Status

Use one:

```text
PASS — NURTUREOPS AI AUDITED, CLEAN-ROOM REBUILT, TESTED, MERGED, AND
VERCEL DEMO-PRODUCTION VERIFIED
```

or:

```text
AWAITING OWNER APPROVAL — <EXACT OWNER-ONLY ACTION>
```

or:

```text
BLOCKED — <EXACT TECHNICAL OR SECURITY GATE>
```

## Source integrity

Include:

- every archive filename/bytes/SHA-256;
- Git origin/branch/commit;
- licence evidence;
- direct reuse/clean-room/rejected decisions;
- embedded Git handling;
- real-data findings;
- secret/financial scan.

## Repository

Include:

- local root;
- repository;
- starting SHA;
- feature branch;
- final feature SHA;
- PR;
- CI runs;
- merge method;
- merged main SHA;
- clean worktree.

## Product and implementation

Include:

- routes;
- role shells;
- Auth/invitations;
- organizations/locations/roles;
- children/guardians;
- attendance/offline;
- care log;
- incidents;
- family communication;
- billing/invoices;
- reports/export/deletion;
- Care Copilot;
- demo/deferred/blocked features.

## Database and security

Include:

- project reference/region/plan;
- migration history;
- table count;
- RLS/grant results;
- cross-tenant tests;
- storage policies;
- Auth state;
- service-role boundary;
- security scans;
- threat-model residual risks.

## Verification

Include exact measured:

- install/audit;
- format/lint/typecheck;
- unit/integration/RLS tests;
- browser tests;
- accessibility;
- responsive;
- PWA/offline;
- performance;
- AI evaluation;
- build;
- secret/private/financial scans.

## Vercel

Include:

- project/team/plan;
- Preview deployment ID/URL/SHA/status;
- Production deployment ID/URL/SHA/status;
- noindex;
- aliases/domains;
- environment names;
- final bypass credential count;
- rollback deployment.

## Portfolio

Include:

- README;
- case study;
- resume entry;
- LinkedIn description;
- screenshot manifest;
- known limitations.

## Rollback

Include:

- Git rollback;
- database forward-fix approach;
- Vercel rollback target;
- provider disable plan;
- no destructive remote reset without separate approval.

---

# REQUIRED OPERATING PRINCIPLES

1. Never merge the three source trees literally.
2. Never copy Folk Care AGPL source without approved AGPL strategy.
3. Never copy NannyBill source without verified rights.
4. Never copy the AI SDK monorepo; use published packages.
5. Never expose service-role, database, AI, email, payment, webhook, or
   signing secrets to the browser.
6. Never use real child or family data in development, Preview, Production
   demo, screenshots, logs, tests, or AI.
7. Never use floating-point authoritative money.
8. Never mutate an issued invoice silently.
9. Never let AI perform a sensitive mutation without explicit review and
   deterministic server revalidation.
10. Never claim medical, legal, safeguarding, licensing, ratio, tax, or
    privacy compliance without qualified review.
11. Never claim a test, Preview, Production, or provider result that was not
    actually measured.
12. After any code change, refresh the exact-commit evidence.
13. Continue through ordinary engineering work without asking for
    micro-approval.
14. Stop only at genuine owner-only or hard safety boundaries.

---

# BEGIN

Begin with the immutable archive inventory and licence/provenance register.

Create the fresh clean-room application.

Implement the complete deterministic childcare platform before enabling AI.

Build the director, educator, and guardian experiences.

Implement Supabase migrations, grants, RLS, tests, offline attendance,
billing correctness, and Care Copilot approval boundaries.

Run every local gate.

Push and open a Draft PR.

Create and verify the exact-commit Supabase/Vercel Preview.

Fix all in-scope failures.

Merge normally only after the final SHA passes.

Deploy and verify the synthetic-data Vercel Production demonstration.

Return the complete evidence report and rollback package.
