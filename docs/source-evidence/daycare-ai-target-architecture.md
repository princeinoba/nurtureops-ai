# NurtureOps AI — Target Product and Technical Architecture

## 1. Architecture decision

Build a modular monolith in one Next.js repository. Do not begin with separate microservices, a full healthcare monorepo, or a copied AI SDK workspace.

```text
Browser/PWA
  → Next.js route/server action boundary
  → authentication + authorization + validation
  → application command/query services
  → PostgreSQL/Supabase RLS
  → outbox/background jobs
  → approved email/payment/AI providers
```

## 2. Bounded contexts

### Organizations and identity

- organizations
- centres
- memberships
- role grants
- invitations
- sessions
- privileged access

### Enrolment and child records

- children
- guardians
- relationships
- authorized pickups
- emergency contacts
- enrolments
- rooms
- schedules
- consent and documents

### Attendance and rooms

- check-in/out
- handoff actor
- room transfers
- attendance correction/review
- occupancy
- deterministic ratio policy
- offline queue
- audit trail

### Daily care

- meals
- naps
- toileting
- mood/wellbeing observations
- activities
- photos/documents where approved
- educator notes
- reviewed parent daily report

### Safety

- allergies
- child plans
- medication authorization
- medication administration
- accidents/incidents
- notifications/escalations
- restricted reviewer access

### Staff

- staff profile
- role
- qualification/expiry
- room assignment
- shift
- timesheet
- leave
- payroll export

### Billing

- billing agreement
- rate rule
- subsidy/credit
- attendance calculation
- invoice
- invoice line snapshot
- payment/reconciliation
- receipt/export

### Family communication

- reviewed report
- invoice/document delivery
- consent request
- message draft/send state
- preferences
- access audit

### AI copilot

- authorized tool
- model/provider policy
- field manifest
- structured draft
- human approval
- deterministic command
- audit/cost/evaluation

## 3. Command/query examples

```ts
type CheckInChild = {
  organizationId: string;
  centreId: string;
  childId: string;
  roomId: string;
  occurredAt: string;
  handedOffByGuardianId?: string;
  actorId: string;
  idempotencyKey: string;
};

type PublishDailyReport = {
  reportId: string;
  actorId: string;
  expectedVersion: number;
  approvedSections: string[];
};

type IssueInvoice = {
  organizationId: string;
  agreementId: string;
  period: { start: string; end: string };
  actorId: string;
  idempotencyKey: string;
};
```

Commands revalidate authentication, authorization, entity version, invariants, and idempotency on the server.

## 4. AI boundary

### Tool example

```ts
const explainInvoice = tool({
  description: "Explain an already calculated invoice without changing it.",
  inputSchema: z.object({
    invoiceId: z.string().uuid(),
    question: z.string().trim().min(1).max(500),
  }),
  execute: async ({ invoiceId, question }, context) => {
    const invoice = await invoiceQueries.getAuthorizedExplanationView({
      invoiceId,
      actor: context.actor,
    });

    return {
      invoiceNumber: invoice.number,
      calculationVersion: invoice.calculationVersion,
      lineExplanations: invoice.lines,
      question,
    };
  },
});
```

The model explains deterministic results. It cannot call a mutation tool during the first release.

### Draft-and-approve example

```text
structured child events
→ server selects minimum approved fields
→ model drafts neutral parent summary
→ policy validator removes diagnoses/unsupported claims
→ educator reviews and edits
→ educator clicks Publish
→ server command checks report version and role
→ parent receives reviewed report
```

## 5. Multi-tenancy and RLS

Every private table includes `organization_id`; centre-scoped records also include `centre_id`.

Examples:

```sql
create policy "members read organization children"
on public.children
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.organization_id = children.organization_id
      and m.status = 'active'
  )
);
```

Parent access also requires an active child-guardian relationship and a field/action scope.

Never authorize from user-editable metadata.

## 6. Offline architecture

Educator PWA supports only approved offline operations:

- roster already downloaded for assigned room
- local attendance event queue
- local structured daily events
- signed conflict-safe mutations
- no offline privileged admin changes
- no long-lived server/admin secret
- device/session binding
- sync status and conflict resolution
- remote revocation handling

Every queued mutation has:

```text
client_operation_id
entity_id
expected_version
occurred_at
device_id
actor_id
payload schema version
signature/session context
```

## 7. Background jobs

Initial stable approach:

```text
Postgres outbox
→ scheduled bounded worker
→ email, PDF, exports, retention, retries
```

Requirements:

- idempotency key
- attempt count
- next attempt
- dead-letter state
- content-minimized payload
- deployment/version trace
- audit outcome

Vercel Queues is an optional later decision because it is currently beta.

## 8. Observability

Log:

- request ID
- organization/centre pseudonymous IDs
- actor class
- route/command
- result class
- latency
- safe error code
- model/tool name
- token/cost aggregate

Never log:

- child narrative
- raw parent message
- medication details
- incident narrative
- database/service keys
- AI provider body
- complete invoice bank/payment details

## 9. Performance budgets

- route-level JavaScript budget
- no AI SDK in routes that do not use AI
- server-render operational lists
- pagination and indexed date/range filters
- avoid minute-by-minute refetch for duration clocks
- image optimization and signed thumbnails
- streaming only where it improves task completion
- dashboard aggregates calculated asynchronously or with indexed views
- PDF/export jobs outside interactive response
- test query plans for high-volume attendance/invoice paths

## 10. Deployment topology

```text
Vercel
- Next.js app
- server routes/actions
- scheduled job endpoint
- protected Preview environments

Supabase
- Auth
- PostgreSQL
- RLS
- Storage
- migrations and generated types

Optional providers
- Vercel AI Gateway/model provider
- email
- payment
- monitoring
```

No provider is activated until credentials, contracts, privacy terms, data residency, cost, and owner approval are recorded.
