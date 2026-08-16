# Screenshot manifest

Production screenshots are release evidence only when captured from the stable public URL after the exact-main deployment and every mandatory gate passes. Do not substitute local images, the older protected Preview, or a different SHA. The merged release pull request is the external ledger for the final deployment SHA, image SHA-256 values, and capture acceptance so evidence updates do not change the deployed source commit.

Stable URL: <https://nurtureops-ai.vercel.app>

| Required view     | Route/state                              | Viewport          | Evidence file                      | Repository status        |
| ----------------- | ---------------------------------------- | ----------------- | ---------------------------------- | ------------------------ |
| Public landing    | `/`                                      | Desktop 1440x1000 | `production-public-landing.png`    | Capture after Production |
| Director Today    | `/today`                                 | Desktop 1440x1000 | `production-director-today.png`    | Capture after Production |
| Educator Today    | `/care-log`                              | Mobile 390x844    | `production-educator-mobile.png`   | Capture after Production |
| Parent timeline   | `/parent/children/:synthetic-id`         | Desktop 1440x1000 | `production-parent-timeline.png`   | Capture after Production |
| Attendance        | `/attendance`, receipt/offline states    | Desktop 1440x1000 | `production-attendance.png`        | Capture after Production |
| Billing/invoice   | `/billing/invoices/:synthetic-id`        | Desktop 1440x1000 | `production-billing-invoice.png`   | Capture after Production |
| Care Copilot      | `/today#care-copilot`, proposal/approval | Desktop 1440x1000 | `production-care-copilot.png`      | Capture after Production |
| Offline/sync      | attendance queued state/offline shell    | Mobile 390x844    | `production-offline-queue.png`     | Capture after Production |
| Mobile navigation | director/educator/parent shell           | Mobile 320x800    | `production-mobile-navigation.png` | Capture after Production |

Before capture, verify no real data/secrets, visible synthetic-demo label, noindex, correct SHA metadata, no serious/critical Axe finding, no overflow, and no active bypass credential. Record the nine image hashes and exact Production deployment in the merged release pull request.
