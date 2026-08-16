# Architecture

NurtureOps AI is a clean-room Next.js 16 App Router application designed as a synthetic portfolio demonstration. Its operational architecture is server-authoritative even where the demo route currently returns a non-persisting receipt.

## Request boundary

```text
route or component
  -> typed command/query or schema
  -> server authentication, tenancy, role, relationship and version validation
  -> deterministic domain service
  -> transaction/repository
  -> PostgreSQL with forced RLS
  -> content-free audit metadata
```

React components do not access PostgreSQL directly. Browser code may use the Supabase publishable client for Auth/session behavior only. The service-role client lives in a `server-only` module and is not imported by UI code.

## Layers

| Layer                   | Location                      | Responsibility                                                       |
| ----------------------- | ----------------------------- | -------------------------------------------------------------------- |
| Routes and shells       | `app/`                        | Public, auth, director, educator, parent, and bounded route handlers |
| UI                      | `components/`                 | Accessible presentation and small interaction islands                |
| Features                | `features/`                   | Offline queue, invitations, AI schemas                               |
| Deterministic domain    | `domain/`                     | Attendance, billing, money, permissions, ratios, time                |
| Server boundary         | `server/`, `lib/supabase/`    | AI tools, data sources, cookies, admin client                        |
| Persistence contract    | `supabase/`                   | PostgreSQL 17 migration, seed, config, live RLS probes               |
| Evidence and operations | `docs/`, `tests/`, `scripts/` | Provenance, runbooks, quality gates                                  |

## Identity and authorization

Supabase Auth is the only intended identity system. Public signup is disabled. Invitations use one-use random tokens; only SHA-256 hashes are stored, with normalized email, expiry, revocation, and consumption state.

Authorization is layered:

1. Proxy refreshes Supabase cookies and uses `getClaims()`, never an unverified client session, in operational mode.
2. Server commands validate organization, location, role, guardian relationship, and recent authentication as applicable.
3. PostgreSQL grants begin revoked and are explicitly restored per table/action.
4. All 62 public application tables enable and force RLS.
5. Security-definer helpers use an empty `search_path` and expose only required execute privileges.

## Deterministic operations

- Attendance is an append-only event state machine with idempotency keys, optimistic versions, explicit missing-checkout review, and corrections that preserve history.
- Billing uses bigint minor units, timezone-aware service dates, deterministic half-up rounding, rate/cap/grace/late-fee rules, adjustments, and a calculation version.
- Issued invoices and invoice lines are protected by state checks and database triggers.
- Ratio observations cite a reviewed policy version and explicitly avoid legal-compliance claims.
- The PostgreSQL outbox is the future provider-delivery seam. No email, SMS, payment, or webhook provider is connected.

## PWA boundary

The service worker caches only the static offline shell and icon. It excludes API and Next data responses. The browser queue contains only a schema version, synthetic child identifier, event type, timestamps, expected version, and idempotency key; it is capped at 50 events and 24 hours. Replay still requires server authorization and version checks.

## Care Copilot

The agent accepts an injected `LanguageModel`, so no provider is hard-coded. Six read tools supply authorized deterministic facts. Six proposal tools require user approval and return a typed, non-mutating object with evidence, warnings, input-field manifest, and expected record version. The model never performs financial math or database mutations. A deterministic command must reauthorize and revalidate after human approval.

## Deployment posture

The repository is ready for a Vercel Preview/portfolio deployment with noindex, restrictive security headers, synthetic data, AI disabled by default, and no live providers. Remote Supabase/Vercel creation remains an owner decision because organization/team/region selections are not unambiguous.
