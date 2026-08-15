# Role access matrix

RLS is authoritative. This matrix summarizes intended server/database access; it is not a substitute for policy tests.

| Capability                     |              Owner |            Director |                      Staff |             Billing manager |                     Guardian |                Auditor |
| ------------------------------ | -----------------: | ------------------: | -------------------------: | --------------------------: | ---------------------------: | ---------------------: |
| Organization/location read     |                Yes |                 Yes |                     Scoped |                      Scoped |                           No |                    Yes |
| Membership/role administration |  Yes + recent auth |        Read/limited |                         No |                          No |                           No |                   Read |
| Child directory                |         All tenant | All tenant/location |          Assigned location |             Billing purpose |           Related child only |                   Read |
| Attendance read                |         All tenant | All tenant/location |          Assigned location |             Billing purpose |           Related child only |                   Read |
| Attendance event/correction    |             Manage |      Manage/correct |             Assigned event |                          No |                           No |                   Read |
| Care entry draft               |             Manage |      Manage/approve |              Assigned room |                          No |       Published related only |                   Read |
| Restricted incident/medication |                Yes |                 Yes | Workflow-specific deferred |                          No |        Reviewed release only |                   Read |
| Messaging                      |  Admin/participant |   Admin/participant |                Participant |     Participant if assigned |                  Participant |                  Audit |
| Billing/contracts/invoices     |                Yes |                 Yes |                         No |                         Yes | Related billing relationship |                   Read |
| Audit/security events          |                Yes |                 Yes |                         No |                          No |                           No |                    Yes |
| Export/deletion                |  Yes + recent auth |   Yes + recent auth |                         No | Scoped export + recent auth |    Subject workflow deferred |                   Read |
| AI proposals                   | Authorized purpose |  Authorized purpose |           Assigned purpose |             Billing purpose |    Related published purpose | Evaluate/read metadata |

Additional rules:

- No role bypasses tenant scope.
- Staff require an active location assignment.
- Guardians require an active dated relationship and per-purpose visibility/billing flag.
- Revoked/suspended memberships and revoked grants confer no access.
- Privileged mutations require server-side validation; recent-auth/MFA hooks must be completed before real activation.
- Service role is not an application user role and must never enter the browser.
