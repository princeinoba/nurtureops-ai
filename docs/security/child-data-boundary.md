# Child-data boundary

Child and family information is high-impact data even when it is not legally classified as medical data. Collect the minimum field for a named purpose and default to denial.

## Allowed paths

- Server-validated forms and commands.
- PostgreSQL rows protected by organization/location/relationship RLS.
- Non-public storage with short-lived authorized access.
- Content-free audit metadata using opaque entity IDs.
- Bounded offline attendance queue with synthetic/opaque child ID, event type, times, version, and idempotency key.
- AI deterministic tools only after actor authorization and field-manifest filtering.

## Prohibited paths

- Public URLs, query strings, filenames, public buckets, analytics, client error reporting, console logs, screenshots, fixtures, issue/PR text, or demo videos containing real data.
- Browser storage of profiles, allergies, medication, incidents, safeguarding notes, messages, invoices, or documents.
- Service-role/database/provider secrets in client code.
- AI access to allergy, medication, diagnosis, restricted incident, safeguarding, pickup-private, or message-body fields by default.
- Silent correction, cascade deletion, or unaudited bulk export.

## Demo rule

Only fictional names and reserved `@synthetic.invalid` identities may be used. A real-data finding is a release hard stop: contain, remove from history/evidence through an approved process, rotate exposed secrets, assess notification obligations, and rerun every contamination scan.
