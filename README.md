# NurtureOps AI

A synthetic-data childcare operations portfolio demonstration built around deterministic workflows, relationship-aware authorization, and human-reviewed AI.

> This is not a live childcare service, compliance-certified system, medical/safeguarding tool, or payment platform. Every identity and operational record is fictional. Public signup, live payments/messages, and real-data AI are disabled or blocked.

## What is implemented

- Public, sign-in/onboarding, director, educator, and guardian route shells.
- Mobile-first accessible UI with dark/system themes, reduced motion, forced colors, noindex, and PWA offline shell.
- Idempotent attendance state machine with explicit correction/history and a 24-hour/50-event minimal offline queue.
- Deterministic bigint minor-unit billing with timezone/DST handling, caps, grace, late fees, subsidies/credits, calculation version, invoice state machine, and synthetic PDF.
- Supabase/PostgreSQL 17 migration: 62 application tables, explicit Data API grants, forced RLS, tenant/location/guardian policies, private storage, immutable audit/consent/incident history, and immutable issued financial records.
- Care Copilot: six deterministic read tools, six typed proposal tools, sensitive-field manifest, evidence/warnings, explicit approval, six-step cap, provider-neutral injected model, and no direct mutation.
- Unit, integration, static/live RLS, PWA, security, browser/accessibility, and CI contracts.
- Complete source/provenance, architecture, threat-model, deployment, rollback, operations, and portfolio documentation.

## Status

| Area                                                   | State                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| Local application and production build                 | Implemented and gated                                          |
| Local Supabase migration/seed                          | Executed repeatedly on PostgreSQL 17                           |
| Live local guardian/staff/director/cross-tenant probes | Passing                                                        |
| Remote Supabase                                        | Free project verified in `ca-central-1`; 62/62 tables use forced RLS |
| Vercel Preview                                         | Exact feature-SHA deployment verified READY and protected      |
| Vercel Production                                      | Authorized synthetic-only release target: <https://nurtureops-ai.vercel.app> |
| Real providers or real data                            | Blocked                                                        |
| AI                                                     | Synthetic deterministic demo; remote model disabled by default |

See [known limitations](docs/limitations.md) for the exact demo/deferred/blocked boundary.

The stable portfolio URL is <https://nurtureops-ai.vercel.app>. Treat it as public release evidence only after the exact-main deployment and verification gates recorded on the release pull request pass.

## Stack

- Next.js 16.3.1 / React 19.2.8 / TypeScript 6.0.3
- Supabase JS 2.112.3 / SSR 0.12.4 / CLI 2.114.0 / PostgreSQL 17
- AI SDK 7.0.66 / Zod 4.4.3
- Vitest 4.1.10 / Playwright 1.62.1 / Axe 4.13.0
- pnpm 11.19.0 / Node 24.x

Versions are intentionally pinned.

## Quick start

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm exec supabase start
pnpm dev
```

Open <http://127.0.0.1:3000>. Demo mode renders without a remote Supabase project. Local seed identities use the reserved `@synthetic.invalid` domain and the seed-only password `synthetic-demo-only`.

Run the gates:

```powershell
pnpm verify
pnpm test:e2e
```

For live database policy probes, follow [development.md](docs/development.md).

## Routes

- Public/auth: `/`, `/about`, `/privacy`, `/terms`, `/sign-in`, `/forgot-password`, `/onboarding`, `/accept-invite/:token`
- Director: `/today`, `/children`, `/attendance`, `/rooms`, `/families`, `/staff`, `/billing`, `/incidents`, `/reports`, `/documents`, `/settings`
- Educator: `/care-log` plus assignment-scoped operational views
- Guardian: `/parent`, child timeline, attendance, messages, invoices, documents
- Bounded APIs: health, synthetic attendance validation, synthetic AI proposal, synthetic invoice PDF

## Security posture

Browser code never receives a service-role/database-admin/provider/model secret. Components do not query the database directly. Roles come from server-managed membership/grant rows. All private access is denied by default and enforced again through forced RLS. Money uses integer minor units. Service-worker caches exclude API/private data. AI receives minimum authorized fields and cannot claim or perform a completed mutation.

The archive audit found no high-confidence real secret or personal dataset, and no archive source was reused. Full evidence is in [source inventory](docs/source-inventory.md) and [licence/provenance register](docs/licence-and-provenance-register.md).

## Documentation

- [Product requirements](docs/product-requirements.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Threat model](docs/security/threat-model.md)
- [Role access matrix](docs/security/role-access-matrix.md)
- [Care Copilot tools](docs/ai/tool-register.md) and [approval contract](docs/ai/approval-contract.md)
- [Testing](docs/testing.md)
- [Release evidence](docs/release-evidence.md)
- [Development](docs/development.md)
- [Deployment](docs/deployment.md)
- [Rollback](docs/rollback.md)
- [Operations](docs/operations.md)
- [Case study](docs/portfolio/nurtureops-ai-case-study.md)

## Licence

Application code is currently marked `UNLICENSED`. Published dependencies retain their upstream licences. Folk Care and NannyBill source/assets were deliberately not copied because their licence evidence was conflicting or ambiguous.

