# Testing and acceptance

The test pyramid separates pure deterministic logic, route integration, static migration contracts, live PostgreSQL policy probes, PWA safety, and browser behavior.

| Layer       | Command                  | Coverage                                                                                                                                                     |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit        | `pnpm test`              | Money, rounding, rate/cap/credits, DST, attendance/idempotency/correction, invoice states, permissions, ratios, invitations, AI schemas                      |
| Integration | `pnpm test:integration`  | Attendance-to-billing vertical slice and typed demo route contracts                                                                                          |
| RLS static  | `pnpm test:rls`          | All 62 tables in forced-RLS loop, explicit grants, hardened helpers, immutability, private storage, synthetic seed                                           |
| RLS live    | `supabase/tests/rls.sql` | No anonymous child access, cross-tenant isolation, guardian relationship, staff location, billing/restricted incident boundaries, invoice/audit immutability |
| PWA         | `pnpm test:pwa`          | Cache exclusions, bounded minimal queue, synthetic offline shell                                                                                             |
| Browser     | `pnpm test:e2e`          | Public/director/parent shells, attendance receipt, private care draft, AI approval, PDF, accessibility, mobile overflow                                      |
| Security    | `pnpm security:scan`     | Secret/token/private key, real email, public secret names, sensitive local storage, float money                                                              |
| Build       | `pnpm build`             | Production compilation and route generation                                                                                                                  |

Automated accessibility uses Axe serious/critical findings as a hard stop. Color contrast is reviewed separately rather than hidden as a product claim. Keyboard, focus-visible, reduced motion, forced colors, 320px layout, and touch targets require browser/manual review.

Test fixtures use reserved synthetic identities only. A passing local test does not establish legal compliance, provider reliability, production performance, or a backup/restore SLA.
