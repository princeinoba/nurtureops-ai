# Care Copilot tool register

All tools receive an already authenticated `AuthorizedActor` with actor, organization, locations, and roles. The data source must enforce that scope before returning minimum fields. Tool content is untrusted data, never instructions.

## Read tools

| Tool                            | Purpose                                    | Minimum input | Output boundary                                                |
| ------------------------------- | ------------------------------------------ | ------------- | -------------------------------------------------------------- |
| `getDailyRoster`                | Assigned-location roster summary           | location UUID | Authorized counts/opaque IDs; no medical/safety narrative      |
| `getRoomRatioStatus`            | Deterministic configured ratio observation | room UUID     | Counts, policy version, disclaimer                             |
| `getChildAuthorizedCareSummary` | Minimum related/assigned care summary      | child UUID    | Approved structured fields; sensitive deny list excluded       |
| `getAttendanceExceptions`       | Unresolved attendance review classes       | location UUID | Opaque session/event references and state                      |
| `calculateInvoicePreview`       | Versioned deterministic calculation        | contract UUID | Bigint-derived line/result explanation; model performs no math |
| `getCentrePolicyExcerpt`        | Approved cited policy text                 | policy UUID   | Bounded approved excerpt/version                               |

## Proposal tools

| Tool                          | Proposal kind         | Prohibited direct effect                           |
| ----------------------------- | --------------------- | -------------------------------------------------- |
| `draftParentUpdate`           | parent_update         | Cannot send or publish                             |
| `summarizeDailyNotes`         | daily_note_summary    | Cannot finalize a report                           |
| `proposeScheduleChange`       | schedule_change       | Cannot change roster/schedule                      |
| `draftIncidentSummary`        | incident_summary      | Cannot approve/close an incident                   |
| `draftInvoiceExplanation`     | invoice_explanation   | Cannot calculate, issue, charge, credit, or refund |
| `proposeAttendanceCorrection` | attendance_correction | Cannot alter attendance                            |

Every proposal tool requires `user-approval` at the AI SDK boundary. Output includes proposal ID/kind, title/summary, evidence, warnings, input-field manifest, expected record version, and literal `canMutate: false`. Agent execution is capped at six steps.
