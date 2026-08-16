# AGENTS.md

## Mission

Maintain NurtureOps AI as a synthetic-data, clean-room childcare operations portfolio demonstration. Preserve honesty: never imply a demo action persisted, sent, charged, complied, or protected a real person unless the exact server/provider transaction is proven.

## Hard rules

- Never add real child, family, staff, medical, financial, contact, credential, or provider data.
- Never copy source, assets, branding, `.git`, dependencies, or build output from `.evidence/`.
- Never expose service-role, database-admin, AI, email, payment, webhook, signing, or bank secrets to browser code or `NEXT_PUBLIC_*`.
- Components do not access PostgreSQL directly. Use typed server commands/queries and keep RLS as the final boundary.
- Store authoritative money as bigint minor units; no floats.
- Attendance requires idempotency, version checks, append-only events, and explicit corrections.
- Issued financial records and audit/history records remain immutable.
- New tenant data requires explicit grants, enabled+forced RLS, allow/deny tests, purpose/retention entry, and threat-model update.
- Offline storage is limited to the bounded attendance event schema; never cache profiles, API responses, safety, messages, invoices, or documents.
- AI returns typed, evidenced, `canMutate: false` proposals. A separate deterministic command must reauthorize, revalidate version/invariants, transact, then audit.
- Never claim legal, medical, safeguarding, regulatory, privacy, or ratio compliance.

## Workflow

Use Node 24 and pnpm 11 with pinned packages. Before handoff run frozen install, format, zero-warning lint, typecheck, unit/integration/RLS/PWA/security tests, database reset/lint/live probes when schema changes, build, browser/accessibility/mobile checks, and inspect the final diff.

Remote Supabase organization/region, Vercel team, paid commitment, real provider, real data, public indexing/signup, and production policy decisions are owner-only. Never perform destructive remote reset; use reviewed forward migrations and reversible Git/Vercel workflows.

Update relevant documentation and evidence with exact measured results. Do not invent clients, production usage, business outcomes, compliance, performance numbers, deployment IDs, URLs, or SHAs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
