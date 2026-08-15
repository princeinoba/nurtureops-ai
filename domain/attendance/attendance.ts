import { err, ok, type Result } from "@/domain/result";

export type AttendanceStatus = "not_present" | "present" | "checked_out" | "review_required";

export type AttendanceEvent =
  | Readonly<{
      type: "check_in";
      idempotencyKey: string;
      occurredAt: string;
      actorId: string;
      roomId: string;
    }>
  | Readonly<{
      type: "check_out";
      idempotencyKey: string;
      occurredAt: string;
      actorId: string;
    }>
  | Readonly<{
      type: "mark_missing_checkout";
      idempotencyKey: string;
      occurredAt: string;
      actorId: string;
      reason: string;
    }>
  | Readonly<{
      type: "correct";
      idempotencyKey: string;
      occurredAt: string;
      actorId: string;
      reason: string;
      correctedCheckIn?: string;
      correctedCheckOut?: string;
    }>;

export type AttendanceAggregate = Readonly<{
  status: AttendanceStatus;
  checkInAt?: string;
  checkOutAt?: string;
  roomId?: string;
  version: number;
  appliedIdempotencyKeys: readonly string[];
  history: readonly AttendanceEvent[];
}>;

export const emptyAttendance: AttendanceAggregate = {
  status: "not_present",
  version: 0,
  appliedIdempotencyKeys: [],
  history: [],
};

function validInstant(value: string): boolean {
  return !Number.isNaN(new Date(value).valueOf());
}

export function applyAttendanceEvent(
  aggregate: AttendanceAggregate,
  event: AttendanceEvent,
): Result<AttendanceAggregate> {
  if (aggregate.appliedIdempotencyKeys.includes(event.idempotencyKey)) {
    return ok(aggregate);
  }
  if (!event.idempotencyKey.trim() || !validInstant(event.occurredAt)) {
    return err("INVALID_INPUT", "A valid occurred-at instant and idempotency key are required.");
  }

  let next: Omit<AttendanceAggregate, "version" | "history" | "appliedIdempotencyKeys">;

  switch (event.type) {
    case "check_in":
      if (aggregate.status === "present") {
        return err("INVALID_TRANSITION", "The child already has an active attendance session.");
      }
      next = {
        status: "present",
        checkInAt: event.occurredAt,
        roomId: event.roomId,
      };
      break;
    case "check_out":
      if (aggregate.status !== "present" || !aggregate.checkInAt) {
        return err("INVALID_TRANSITION", "Check-out requires an active check-in.");
      }
      if (new Date(event.occurredAt) < new Date(aggregate.checkInAt)) {
        return err("INVALID_TRANSITION", "Check-out cannot precede check-in.");
      }
      next = {
        status: "checked_out",
        checkInAt: aggregate.checkInAt,
        checkOutAt: event.occurredAt,
        ...(aggregate.roomId ? { roomId: aggregate.roomId } : {}),
      };
      break;
    case "mark_missing_checkout":
      if (aggregate.status !== "present" || !aggregate.checkInAt || !event.reason.trim()) {
        return err(
          "INVALID_TRANSITION",
          "Missing check-out review needs an active session and reason.",
        );
      }
      next = {
        status: "review_required",
        checkInAt: aggregate.checkInAt,
        ...(aggregate.roomId ? { roomId: aggregate.roomId } : {}),
      };
      break;
    case "correct": {
      if (!event.reason.trim()) {
        return err("INVALID_INPUT", "Corrections require a reason.");
      }
      const correctedCheckIn = event.correctedCheckIn ?? aggregate.checkInAt;
      const correctedCheckOut = event.correctedCheckOut ?? aggregate.checkOutAt;
      if (!correctedCheckIn || !correctedCheckOut) {
        return err("INVALID_TRANSITION", "A correction must resolve both attendance instants.");
      }
      if (new Date(correctedCheckOut) < new Date(correctedCheckIn)) {
        return err("INVALID_TRANSITION", "Corrected check-out cannot precede corrected check-in.");
      }
      next = {
        status: "checked_out",
        checkInAt: correctedCheckIn,
        checkOutAt: correctedCheckOut,
        ...(aggregate.roomId ? { roomId: aggregate.roomId } : {}),
      };
      break;
    }
  }

  return ok({
    ...next,
    version: aggregate.version + 1,
    appliedIdempotencyKeys: [...aggregate.appliedIdempotencyKeys, event.idempotencyKey],
    history: [...aggregate.history, event],
  });
}
