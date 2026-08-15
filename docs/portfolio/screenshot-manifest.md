# Screenshot manifest

Screenshots are release evidence only when captured from the exact deployed Preview SHA after all gates pass. Do not substitute local images or an older deployment.

| Required view     | Route/state                              | Viewport          | Exact SHA | Deployment URL | File    | Status       |
| ----------------- | ---------------------------------------- | ----------------- | --------- | -------------- | ------- | ------------ |
| Director Today    | `/today`                                 | Desktop 1440x1000 | Pending   | Pending        | Pending | Not captured |
| Educator Today    | `/care-log`                              | Mobile 390x844    | Pending   | Pending        | Pending | Pending      |
| Parent timeline   | `/parent/children/:synthetic-id`         | Desktop           | Pending   | Pending        | Pending | Pending      |
| Attendance        | `/attendance`, receipt/offline states    | Desktop + mobile  | Pending   | Pending        | Pending | Pending      |
| Billing/invoice   | `/billing/invoices/:synthetic-id`        | Desktop           | Pending   | Pending        | Pending | Pending      |
| Care Copilot      | `/today#care-copilot`, proposal/approval | Desktop           | Pending   | Pending        | Pending | Pending      |
| Offline/sync      | attendance queued state/offline shell    | Mobile            | Pending   | Pending        | Pending | Pending      |
| Mobile navigation | director/educator/parent shell           | 320-390px         | Pending   | Pending        | Pending | Pending      |

Before capture, verify no real data/secrets, visible synthetic-demo label, noindex, correct SHA metadata, no serious/critical Axe finding, no overflow, and no active bypass credential. Record image SHA-256 after capture.
