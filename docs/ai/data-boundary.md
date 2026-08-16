# Care Copilot data boundary

The server constructs model input only from authorized deterministic tool results. The input-field manifest is validated before provider use.

Allowed classes include structured event type/time/neutral label, roster/attendance exception counts, configured policy version, deterministic invoice preview, opaque record IDs, and approved policy excerpts.

Blocked classes include allergies, medication, diagnosis, restricted incident notes, safeguarding notes, authorized-pickup private notes, guardian message bodies, unrestricted documents, contact details, credentials, and any cross-tenant/cross-family record.

No model/provider key is public. No raw prompt, provider request/response, child narrative, or chain-of-thought enters logs/audit. AI run metadata is content-free. The deterministic product remains usable with `AI_ENABLED=false`.

See `docs/security/ai-data-boundary.md` for the broader security boundary.
