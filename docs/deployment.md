# Deployment

## Configuration names

Public:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_GATEWAY_API_KEY`
- `AI_MODEL`
- `APP_URL`
- `CRON_SECRET`
- `INVITATION_HMAC_SECRET`
- `NURTUREOPS_DEMO_MODE`
- `AI_ENABLED`

Never copy values into Git, browser bundles, build logs, screenshots, or documentation.

## Remote Supabase preflight

Remote project creation is not automatic until the owner selects an unambiguous Supabase organization and region and the UI shows Free / USD $0 per month with no add-on commitment.

Before linking or pushing:

1. Run `pnpm exec supabase db reset --local` twice from a clean state.
2. Run static and live RLS/grant probes and `supabase db lint --local --level warning`.
3. Generate types and review the diff.
4. Run a remote migration dry-run after linking.
5. Confirm the seed is synthetic-only; do not seed a real production tenant.
6. Apply the migration once, then verify migration history, 62 tables, grants, forced RLS, functions, indexes, bucket privacy, and advisors.

## Vercel Preview

Use exactly one project named `nurtureops-ai`, Next.js framework, Free plan, only when the UI displays USD $0 per month. The Vercel team choice is owner-bound when more than one team is available.

- Deploy the exact feature commit to Preview.
- Do not attach a custom domain or production alias.
- Keep noindex/nofollow and synthetic demo mode.
- Configure secret values only in provider UI and scope them minimally.
- Keep `AI_ENABLED=false` unless a synthetic-only provider evaluation is approved.
- Run all route, role, RLS, attendance, care, billing, parent, AI-disabled, accessibility, responsive, PWA, header, asset, and secret scans against that exact SHA.
- Remove temporary bypass credentials after verification.

## Demo production

Production is a synthetic-data portfolio demonstration only. It remains blocked if any real child/family data, public signup, live payment/message provider, unsupported compliance claim, real-data AI processing, exposed/missing secret, or failed gate exists.

After a normal merge, verify the production source SHA equals merged `main`; deploy; repeat critical checks; verify noindex, intended `vercel.app` alias only, zero bypass credentials, and a recorded previous deployment.
