import { randomUUID } from "node:crypto";

import { queuedAttendanceEventSchema } from "@/features/attendance/offline-queue";

export async function POST(request: Request) {
  const parsed = queuedAttendanceEventSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: { code: "INVALID_INPUT", message: "Attendance event was rejected." } },
      { status: 400 },
    );
  }
  return Response.json(
    {
      receiptId: randomUUID(),
      idempotencyKey: parsed.data.idempotencyKey,
      mode: "synthetic_demo",
      persisted: false,
      message: "Validated only; no operational attendance record was changed.",
    },
    { status: 202 },
  );
}
