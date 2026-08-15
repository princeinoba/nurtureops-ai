import {
  applyAttendanceEvent,
  emptyAttendance,
  type AttendanceAggregate,
} from "@/domain/attendance/attendance";

function value(result: ReturnType<typeof applyAttendanceEvent>): AttendanceAggregate {
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("attendance state machine", () => {
  it("is idempotent and preserves append-only history", () => {
    const event = {
      type: "check_in" as const,
      idempotencyKey: "check-in-1",
      actorId: "staff-1",
      roomId: "room-1",
      occurredAt: "2026-08-14T12:12:00.000Z",
    };
    const checkedIn = value(applyAttendanceEvent(emptyAttendance, event));
    expect(checkedIn.status).toBe("present");
    expect(checkedIn.version).toBe(1);

    const duplicate = value(applyAttendanceEvent(checkedIn, event));
    expect(duplicate).toBe(checkedIn);
    expect(duplicate.history).toHaveLength(1);
  });

  it("rejects invalid transitions and supports explicit corrections", () => {
    const invalid = applyAttendanceEvent(emptyAttendance, {
      type: "check_out",
      idempotencyKey: "bad-out",
      actorId: "staff-1",
      occurredAt: "2026-08-14T15:00:00.000Z",
    });
    expect(invalid).toMatchObject({ ok: false, error: { code: "INVALID_TRANSITION" } });

    const checkedIn = value(
      applyAttendanceEvent(emptyAttendance, {
        type: "check_in",
        idempotencyKey: "in",
        actorId: "staff-1",
        roomId: "room-1",
        occurredAt: "2026-08-14T12:00:00.000Z",
      }),
    );
    const corrected = value(
      applyAttendanceEvent(checkedIn, {
        type: "correct",
        idempotencyKey: "correction",
        actorId: "director-1",
        occurredAt: "2026-08-14T19:00:00.000Z",
        reason: "Synthetic authorized correction",
        correctedCheckOut: "2026-08-14T18:30:00.000Z",
      }),
    );
    expect(corrected.status).toBe("checked_out");
    expect(corrected.history.map((event) => event.type)).toEqual(["check_in", "correct"]);
  });

  it("marks missing checkout as review-required with a reason", () => {
    const checkedIn = value(
      applyAttendanceEvent(emptyAttendance, {
        type: "check_in",
        idempotencyKey: "in-review",
        actorId: "staff-1",
        roomId: "room-1",
        occurredAt: "2026-08-14T12:00:00.000Z",
      }),
    );
    const review = value(
      applyAttendanceEvent(checkedIn, {
        type: "mark_missing_checkout",
        idempotencyKey: "missing",
        actorId: "director-1",
        occurredAt: "2026-08-14T23:00:00.000Z",
        reason: "Closing review",
      }),
    );
    expect(review.status).toBe("review_required");
  });
});
