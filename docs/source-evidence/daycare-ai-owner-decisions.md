# Daycare AI — Owner Decision Register

These decisions are required before implementation or Production activation.

## Product

1. Approve working name:
   - NurtureOps AI
   - KinderLedger
   - CareCanvas AI
   - BrightNest Ops
   - keep Daycare AI temporarily

2. Initial customer:
   - single nanny/childminder
   - small daycare centre
   - multi-centre operator

3. Initial roles:
   - owner/admin
   - educator/nanny
   - parent/guardian
   - bookkeeper
   - restricted safety reviewer

4. Parent portal in first release:
   - yes/no

5. Mobile strategy:
   - PWA first
   - Expo simultaneously
   - Expo later

## Legal, jurisdiction, and finance

6. Launch country/province/state.
7. Currency and tax/invoice rules.
8. Childcare ratio/capacity authority and version.
9. Required attendance, incident, medication, and retention records.
10. Payment provider and whether payment collection is in Release 1.
11. Subsidy/credit requirements.
12. Public privacy/terms reviewer.
13. Data residency requirements.

## Source and licence

14. Confirm Folk Care is pattern-only unless an AGPL strategy is approved.
15. Obtain NannyBill licence confirmation or approve clean-room-only use.
16. Confirm no copied demo data, assets, credentials, or embedded Git history.

## AI

17. Approve first AI features.
18. Approve provider/gateway and budget.
19. Approve exact child/family fields that may be sent, defaulting to none.
20. Approve retention/training terms.
21. Approve human review and audit policy.
22. Approve whether policy-document RAG is included.

## Infrastructure

23. Approve Supabase as authoritative database/auth/storage.
24. Approve Vercel Preview; Production requires separate authorization.
25. Approve email provider.
26. Approve monitoring provider.
27. Decide stable Postgres outbox versus accepting Vercel Queues beta.
28. Approve backup, RPO/RTO, and deletion reconciliation.

## Production holds

Production remains blocked until:

- source/licence decisions recorded
- privacy/legal review completed
- clean install/test/build/e2e pass
- RLS and cross-tenant tests pass
- no client-exposed secrets
- backup/restore tested
- child-data logging/AI scans pass
- exact-commit Preview verified
- owner separately authorizes Production
