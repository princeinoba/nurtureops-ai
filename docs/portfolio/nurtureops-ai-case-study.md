# NurtureOps AI case study

## Brief

Design and implement a trustworthy childcare-operations portfolio demonstration from three supplied code archives and an audit package, without importing ambiguous/copyleft source or real child/family data.

## Observed source

- NannyBill demonstrated useful billing vocabulary but placed database/auth/migration concerns in the browser, used floating-point SQL money, and had ambiguous licence evidence.
- Folk Care showed broad childcare workflows but had an AGPL-3.0 manifest, conflicting README licence text, and mock/header authorization risks.
- The Vercel AI SDK monorepo provided current architecture evidence for typed tools, agents, and centralized approval.

## Clean-room translation

The rebuild retained only abstract product concepts: attendance before billing, human-reviewed care updates, role-specific workspaces, and AI as a proposal layer. All code, schema, CSS, branding, copy, assets, tests, and documentation were newly authored. Released packages were installed rather than copied.

## Implemented feature

- Next.js public, auth, director, educator, and guardian route shells.
- Strict TypeScript domain engines for idempotent attendance, bigint billing, invoice states, permissions, ratios, time/DST, and invitation tokens.
- PostgreSQL 17 migration with 62 tables, explicit grants, forced RLS, private storage, immutable history/issued invoice controls, and live identity-specific probes.
- Minimal offline attendance queue and static-only service-worker cache.
- Care Copilot typed read/proposal tools, sensitive-field deny list, evidence/warnings, user approval, and no direct mutation.
- Unit, integration, RLS, PWA, security, accessibility/browser, CI, deployment, rollback, and incident runbooks.

## Demo-only feature

Dashboard records, attendance receipt API, care-log state, invoice PDF, and AI proposal endpoint are synthetic. They demonstrate interaction and contracts without pretending to persist, deliver, charge, or publish.

## Deferred feature

Full repositories/transactions for every workflow, provider workers/webhooks, generated exports, remote Auth, performance/observability budgets, dedicated billing/auditor UI, and remote backup restore exercise.

## Blocked real-world activation

Real data, jurisdictional policy, public signup/indexing, compliance claims, live payments/messages, and remote AI remain blocked pending legal/privacy/safeguarding/provider review. The approved public release remains a noindex, synthetic-data-only portfolio demonstration.

## Verification evidence

The repository records exact source hashes, frozen dependencies, strict compiler/lint/build gates, deterministic test counts, twice-clean local migrations plus a hardened reset, database lint, and live guardian/staff/director/cross-tenant probes. The Free Supabase project in `ca-central-1` has 62/62 public tables under forced RLS, and the exact feature-SHA Vercel Preview passed route, browser, accessibility, responsive, and screenshot review. Exact Production deployment evidence is recorded on the release pull request rather than asserted before the deployment exists.

Portfolio URL: <https://nurtureops-ai.vercel.app> (public only after the documented exact-main Production gates pass).

