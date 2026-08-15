import { readFileSync } from "node:fs";
import { join } from "node:path";

import { queuedAttendanceEventSchema } from "@/features/attendance/offline-queue";

describe("PWA and offline safety contract", () => {
  const serviceWorker = readFileSync(join(process.cwd(), "public", "sw.js"), "utf8");
  const offlineShell = readFileSync(join(process.cwd(), "public", "offline.html"), "utf8");

  it("never caches API or Next data responses", () => {
    expect(serviceWorker).toContain('url.pathname.startsWith("/api/")');
    expect(serviceWorker).toContain('url.pathname.startsWith("/_next/data/")');
    expect(serviceWorker).not.toMatch(/cache\.put\(request/);
  });

  it("uses a bounded, versioned, minimal queue schema", () => {
    const parsed = queuedAttendanceEventSchema.parse({
      schemaVersion: 1,
      idempotencyKey: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      childId: "33333333-3333-4333-8333-333333333331",
      type: "check_out",
      occurredAt: "2026-08-14T20:00:00.000Z",
      expectedVersion: 2,
      createdAt: "2026-08-14T20:00:00.000Z",
    });
    expect(Object.keys(parsed).sort()).toEqual([
      "childId",
      "createdAt",
      "expectedVersion",
      "idempotencyKey",
      "occurredAt",
      "schemaVersion",
      "type",
    ]);
  });

  it("labels the offline shell as synthetic and avoids private content", () => {
    expect(offlineShell).toContain("Synthetic demo");
    expect(offlineShell).not.toMatch(/Maya|allerg|medication|invoice/i);
  });
});
