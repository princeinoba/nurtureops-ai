# Development

## Prerequisites

- Node.js 24.x
- pnpm 11.x
- Docker Desktop for local Supabase
- Git

## Setup

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm exec supabase start
pnpm dev
```

Demo mode works without remote credentials. Local Supabase URLs/keys can be obtained with `pnpm exec supabase status -o env`; keep generated values in `.env.local`, which is ignored.

Local synthetic identities use the reserved `@synthetic.invalid` domain and the seed-only password `synthetic-demo-only`. They must never be promoted as operational accounts.

## Commands

| Command                 | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `pnpm format:check`     | Formatting gate                                           |
| `pnpm lint`             | Zero-warning ESLint gate                                  |
| `pnpm typecheck`        | Strict TypeScript                                         |
| `pnpm test`             | Pure-domain unit tests                                    |
| `pnpm test:integration` | Route/domain vertical slice                               |
| `pnpm test:rls`         | Static migration contract                                 |
| `pnpm test:pwa`         | Offline/cache contract                                    |
| `pnpm test:e2e`         | Browser journeys and mobile checks                        |
| `pnpm test:a11y`        | Axe browser subset                                        |
| `pnpm security:scan`    | Secret, real-email, public-env, local-storage, money scan |
| `pnpm build`            | Production build                                          |
| `pnpm verify`           | Non-browser local gates                                   |

To execute live RLS probes after local reset:

```powershell
docker cp supabase/tests/rls.sql supabase_db_daycare-ai:/tmp/nurtureops-rls.sql
docker exec supabase_db_daycare-ai psql -v ON_ERROR_STOP=1 -U postgres -d postgres -f /tmp/nurtureops-rls.sql
```

## Rules

Do not add real identities/data, direct component database access, floating-point money, browser admin/provider keys, public storage, wildcard origins, user-editable roles, or AI mutations. New sensitive tables require explicit grants, forced RLS, allow/deny tests, retention classification, and threat-model review.
