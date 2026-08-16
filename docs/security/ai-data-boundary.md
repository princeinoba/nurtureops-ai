# AI data boundary

Care Copilot is synthetic-only or disabled. It is not a generic chatbot and has no direct database mutation capability.

Allowed by default:

- Opaque organization/location/record IDs after authorization.
- Structured roster counts, configured ratio observations, attendance exception classes, deterministic invoice previews, approved policy excerpts, and neutral structured care-event labels.
- Tool/model/version, duration, token/cost class, field manifest, evidence IDs, warning class, approval actor/time, and result class.

Excluded by default:

- Names when an opaque identifier suffices.
- Allergies, diagnoses, medication, safeguarding, restricted incidents, pickup-private notes, guardian message bodies, credentials, contact details, documents, and unrestricted free text.
- Raw provider bodies, system/user prompts, chain-of-thought, and child/family narrative logs.

Every factual claim must come from an authorized deterministic read tool. Output is a typed `canMutate: false` proposal. A person must edit/approve, then a separate deterministic command must re-check role, relationship, current version, invariants, and idempotency before any transaction. AI cannot send, publish, charge, issue, check in/out, approve incidents, authorize pickup, change roles, or modify safety data.
