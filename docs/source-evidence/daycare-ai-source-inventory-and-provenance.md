# Daycare AI — Source Inventory, Licence, and Provenance Register

## Archive identities

| Archive | Bytes | SHA-256 | ZIP entries | Uncompressed bytes |
|---|---:|---|---:|---:|
| `folk-care.zip` | 80,648,627 | `d074e4552ec0de494b02b0c527dc9b8b6e2d959a2b1eb110cb8e3a5a19a82866` | 2,428 | 94,083,191 |
| `nannybill.zip` | 199,750 | `79025aee0e27999b6a41ffb47d12ee2352132283d03de8e3c49f0f07d53c0e68` | 81 | 410,277 |
| `ai(10).zip` | 355,515,862 | `ffaa74d14f617cc5311bd57f2d0d9fe06673f74fe6e127f2de78134553b4e34d` | 8,580 | 396,775,542 |

All three archives contain embedded `.git` data. Embedded Git histories must not be copied into the target repository.

## Folk Care

```text
Origin:
https://github.com/neighborhood-lab/folk-care.git

Branch:
develop

Commit:
2083a67db804a0fe6ccfc37e3bcd4a98c630d854

Commit date:
2025-12-29T02:59:13-06:00
```

### Scale

```text
Non-Git/non-node_modules files:
1,869

Source bytes:
39,916,454

TypeScript files:
1,062

TSX files:
319

Markdown files:
196

Migrations:
71

Test/spec files:
176
```

### Technology

- npm workspaces
- Turbo
- Node 22
- TypeScript
- React
- Vite
- Express
- PostgreSQL
- Expo/React Native
- Tailwind
- Vitest
- Playwright
- Terraform/Kubernetes/Vercel/Cloudflare deployment material

### Licence

```text
package.json:
AGPL-3.0

LICENSE:
GNU Affero General Public License v3

README:
claims MIT
```

**Decision:** the licence file and package metadata take precedence for this audit. Direct code reuse is blocked unless the owner knowingly adopts an AGPL-compatible distribution and qualified legal review approves the plan.

### Capability classification

| Capability | Classification | Daycare translation |
|---|---|---|
| Client demographics | Conceptual translation | Child/guardian enrolment |
| Caregiver staff | Conceptual translation | Educators/nannies/staff |
| Scheduling/visits | Conceptual translation | Rooms, shifts, bookings |
| EVV/time tracking | Conceptual translation | Child attendance and staff time |
| Care plans/tasks | Conceptual translation | Routines, child plans, activities |
| Billing/invoicing | Conceptual translation | Contracts, subsidies, invoices |
| Family engagement | Conceptual translation | Parent portal |
| Payroll | Deferred/translation | Timesheets and payroll export |
| Incident reporting | Clean-room rewrite | Daycare accident/incident records |
| Medication management | Clean-room rewrite | Consent and administration |
| Visit notes | Conceptual translation | Daily child reports |
| QA/audits | Architecture reference | Licensing/audit evidence |
| Shift matching | Deferred | Ratio-aware coverage suggestions |
| Burnout prediction | Rejected for launch | High-risk inference; insufficient target evidence |
| AI services | Architecture reference only | Constrained daycare tools |
| Source code | Rejected from direct merge | AGPL/domain/security risk |
| Embedded `.git`/deploy/demo/secrets | Rejected | Never import |

## NannyBill

```text
Origin:
https://github.com/olamide226/nannybill.git

Branch:
main

Commit:
e5f441902a35fb784daab8b8ee59c43caf3f12ef

Commit date:
2026-05-26T11:09:44+01:00
```

### Scale

```text
Non-Git/non-node_modules files:
28

Source bytes:
291,181

TSX files:
7

TypeScript files:
6

CSS files:
1

Tests:
0
```

### Technology

- React 19
- Vite 8
- TypeScript 6
- browser-side LibSQL/Turso
- jsPDF
- Lucide
- vanilla CSS

### Licence

```text
README:
claims MIT and says to see LICENSE

LICENSE file:
absent

package.json licence:
absent
```

**Decision:** direct reuse is blocked pending licence verification. Product concepts may be recreated cleanly.

### Capability classification

| Capability | Classification | Decision |
|---|---|---|
| Child/parent/rate records | Clean-room rewrite | Core target domain, normalize child/guardian/contract |
| Attendance check-in/out | Clean-room rewrite | Core vertical slice |
| Hourly/fixed/day-cap billing | Clean-room rewrite | Central versioned billing engine |
| Invoice period/status | Clean-room rewrite | Server-side authoritative invoices |
| PDF invoice | Conceptual translation | Server-side or approved deterministic export |
| Themes | Conceptual translation | Retain accessible theme system |
| Direct Turso browser access | Rejected | No trusted auth boundary |
| DB token in localStorage | Rejected | P0 secret exposure |
| `VITE_BANK_*` | Rejected | Client disclosure |
| Browser migrations/reset | Rejected | Server/deployment/admin-only |
| Four-tab state UI | Rejected as architecture | Replace with role/route architecture |

## Vercel AI SDK repository

```text
Origin:
https://github.com/vercel/ai.git

Branch:
main

Commit:
a56fbc08fd5c171574a499babfbd82f0b2a7b3fe

Commit date:
2026-07-29T10:29:20-07:00
```

### Scale

```text
Non-Git source files:
7,231

Source bytes:
72,189,877

TypeScript files:
5,031

TSX files:
380
```

### Key package versions in upload

```text
ai:
7.0.42

@ai-sdk/react:
4.0.45

Node engine:
>=22
```

### Licence

Apache-2.0.

### Capability classification

| Capability | Classification | Decision |
|---|---|---|
| `ToolLoopAgent` | Published dependency/pattern | Use for bounded operator assistant |
| `Output.object` and Zod | Published dependency/pattern | Use for typed drafts |
| `useChat` | Published dependency/pattern | Use for streaming UI where justified |
| Tool approval | Pattern | Mandatory for sensitive proposals |
| Provider packages | Published dependency | Install only selected provider/gateway |
| Examples | Architecture reference | Never ship demo/fake data as product logic |
| Monorepo source | Rejected | Do not copy |
| Embedded `.git`, fixtures, release tooling | Rejected | Do not import |

## Target source policy

```text
Primary new repository:
clean-room Next.js application

Direct source import from NannyBill:
blocked pending licence

Direct source import from Folk Care:
blocked unless AGPL strategy approved

AI SDK:
install published Apache-2.0 packages

Attribution:
maintain this register and dependency notices
```
