import { POST as attendancePost } from "@/app/api/attendance/events/route";
import { POST as aiPost } from "@/app/api/ai/proposals/route";
import { applyAttendanceEvent, emptyAttendance } from "@/domain/attendance/attendance";
import { calculateBilling } from "@/domain/billing/engine";
import { transitionInvoice } from "@/domain/billing/invoice-state";

describe("attendance to invoice vertical slice", () => {
  it("keeps deterministic state and proposal workflows separate", () => {
    const checkedIn = applyAttendanceEvent(emptyAttendance, {
      type: "check_in",
      idempotencyKey: "slice-in",
      actorId: "staff-1",
      roomId: "room-1",
      occurredAt: "2026-08-14T12:00:00.000Z",
    });
    expect(checkedIn.ok).toBe(true);
    if (!checkedIn.ok) return;

    const checkedOut = applyAttendanceEvent(checkedIn.value, {
      type: "check_out",
      idempotencyKey: "slice-out",
      actorId: "staff-1",
      occurredAt: "2026-08-14T14:00:00.000Z",
    });
    expect(checkedOut.ok).toBe(true);

    const invoice = calculateBilling({
      timezone: "America/Toronto",
      period: {
        start: "2026-08-14T00:00:00.000Z",
        end: "2026-08-15T00:00:00.000Z",
      },
      attendance: [
        {
          id: "slice-attendance",
          checkInAt: "2026-08-14T12:00:00.000Z",
          checkOutAt: "2026-08-14T14:00:00.000Z",
        },
      ],
      ratePlan: {
        type: "hourly",
        currency: "CAD",
        hourlyRateMinor: 1_500n,
        graceMinutes: 0,
        latePickupRateMinorPerMinute: 0n,
      },
      subsidies: [],
      credits: [],
    });
    expect(invoice.totalMinor).toBe(3_000n);
    expect(transitionInvoice("draft", "issue")).toEqual({ ok: true, value: "issued" });
  });

  it("returns a non-persisting attendance receipt", async () => {
    const response = await attendancePost(
      new Request("http://localhost/api/attendance/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          schemaVersion: 1,
          idempotencyKey: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          childId: "33333333-3333-4333-8333-333333333331",
          type: "check_in",
          occurredAt: "2026-08-14T12:00:00.000Z",
          expectedVersion: 1,
          createdAt: "2026-08-14T12:00:00.000Z",
        }),
      }),
    );
    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toMatchObject({
      persisted: false,
      mode: "synthetic_demo",
    });
  });

  it("returns a typed, non-mutating AI proposal", async () => {
    const response = await aiPost(
      new Request("http://localhost/api/ai/proposals", {
        method: "POST",
        body: JSON.stringify({
          kind: "parent_update",
          recordId: "33333333-3333-4333-8333-333333333331",
          instruction: "Draft from the structured event.",
        }),
      }),
    );
    expect(response.headers.get("x-nurtureops-ai-mode")).toBe("synthetic-deterministic");
    await expect(response.json()).resolves.toMatchObject({ canMutate: false });
  });
});
