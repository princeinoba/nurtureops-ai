# Care Copilot approval contract

Approval is permission to submit an edited proposal to deterministic validation; it is not proof that a business action completed.

1. Server authenticates actor and derives tenant/role/location/relationship scope.
2. Authorized read tools return minimum deterministic evidence.
3. Field manifest rejects blocked sensitive classes.
4. Model returns a typed `canMutate: false` proposal with evidence, warnings, and expected record version.
5. UI shows proposal and review boundary; user may edit, reject, or explicitly acknowledge/approve.
6. Server re-authenticates and re-checks membership/grant, purpose, relationship/assignment, recent-auth requirement, current record version, idempotency, and domain invariants.
7. A separate deterministic command performs one transaction.
8. Only after commit may UI state success; a content-free audit event records actor/request/entity/result/model-tool metadata.
9. Conflict, denial, timeout, provider outage, or stale version produces a safe error and no mutation.

AI can never directly send, publish, charge, issue/void/refund, check in/out, authorize pickup, change roles, approve/close incidents, decide medication, or alter safety data.
