# Release evidence

Release-candidate verification began on 2026-08-15 on branch `codex/nurtureops-ai-clean-room-rebuild` and continued after its normal merge into `main`. These measurements describe one repository and its synthetic portfolio environments; they are not production SLAs or real childcare-operation claims.

## Integrity and dependency evidence

- All user-supplied archive hashes were recomputed before inspection and match the recorded inventory.
- No archive source code was copied into the clean-room implementation.
- `pnpm install --frozen-lockfile`: passed.
- `pnpm audit --audit-level high`: no known vulnerabilities.
- Audited native package exception: `unrs-resolver@1.12.2`, declared in `pnpm-workspace.yaml`.
- Repository security scan: passed across 148 tracked and candidate files.

## Application verification

- `pnpm verify`: passed.
- Formatting: passed.
- ESLint: passed with zero warnings.
- Strict TypeScript: passed.
- Unit: 19/19 passed.
- Integration: 3/3 passed.
- Static RLS/migration contracts: 5/5 passed.
- PWA contracts: 3/3 passed.
- Optimized Next.js 16.3.1 build: passed; 32 pages generated and 38 application routes listed, plus Proxy.
- `pnpm test:e2e`: 19 passed, 1 intentional desktop skip for the mobile-only overflow assertion.
- E2E engines: Chromium and WebKit mobile emulation.
- Automated accessibility: no serious or critical Axe findings on public, director Today, attendance, and parent routes in both projects. The color-contrast rule is intentionally handled by visual/manual review and is not included in this automated claim.
- Browser visual review: desktop landing and director Today plus 320x800 director Today.
- 320px check: document scroll width 320px for a 320px viewport after the responsive room-row correction.
- Production browser: no page errors and no console errors.
- PWA: one production service-worker registration observed.

## Database verification

- Clean local Supabase reset from the migration and synthetic seed: passed.
- `supabase db lint --local --level warning`: no schema errors.
- Live PostgreSQL RLS probe: passed for anonymous denial, guardian relationship access, staff location scope, owner cross-tenant denial, restricted incidents, issued-invoice immutability, and audit immutability.
- All 62 public tables are covered by forced RLS and explicit grants.
- Free remote Supabase project `qawvosbqbomlqitgqhfj` is ACTIVE_HEALTHY in `ca-central-1`.
- Remote migrations are limited to the initial NurtureOps schema and synthetic demo seed.
- Remote verification found 62/62 public tables with RLS enabled and forced, zero non-synthetic Auth identities, zero non-demo organizations, and zero non-demo payment providers.

## Local production measurements

Browser vitals on `/today`, optimized local production server, Chromium, 1440x1000:

| Metric |                                                              Result |
| ------ | ------------------------------------------------------------------: |
| TTFB   |                                                             11.3 ms |
| FCP    |                                                              124 ms |
| LCP    |                                                        124 ms, `h1` |
| CLS    |                                                                   0 |
| INP    | Not collected; the sampled navigation had no qualifying interaction |

JavaScript evidence:

| Measure                         |                   Result |
| ------------------------------- | -----------------------: |
| Route JavaScript resources      |                       11 |
| Route transfer bytes            |            211,650 bytes |
| Route encoded body bytes        |            208,350 bytes |
| All generated JavaScript chunks | 17 files / 910,399 bytes |

Thirty warm production-mode local samples per synthetic endpoint:

| Endpoint                      |  Median |     p95 |  Maximum |
| ----------------------------- | ------: | ------: | -------: |
| Attendance validation receipt | 2.06 ms | 5.00 ms | 14.55 ms |
| AI proposal first status      | 2.54 ms | 5.66 ms |  5.85 ms |

The production response includes CSP, Referrer-Policy, nosniff, frame denial, Permissions-Policy, COOP, and CORP headers. `upgrade-insecure-requests` is production-only so HTTP local development also works in WebKit.

## Remote release evidence

- Canonical repository: `princeinoba/nurtureops-ai`.
- Feature SHA `50503c24b669f6ea29665e667935813997efd82f` passed `quality-gates` run `31906804915`.
- PR #1 merged normally; merged-main SHA `d25da252b20a60dccbc8521d7be96e713116dcaa` passed `quality-gates` run `31916791811`.
- Existing protected Preview `dpl_FCZBXHMEmkgmBcbJiQKkwWmBHnmq` remains the retained pre-Production rollback artifact.
- Vercel project `prj_lG1v7j4nABaMQ4yHjivZdMScJaRS` remains on the Hobby plan with the canonical GitHub repository and `main` Production branch.
- Approved stable Production URL: <https://nurtureops-ai.vercel.app>.

## Evidence holds

- Final Production deployment ID, exact release SHA, public route results, runtime log scan, and nine screenshot hashes must be recorded on the merged release pull request after those checks actually pass.
- A remote backup/restore exercise remains deferred; no destructive Supabase reset is authorized.
- Performance budgets are baseline observations, not guarantees.
