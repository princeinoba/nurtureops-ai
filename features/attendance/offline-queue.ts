import { z } from "zod";

export const queuedAttendanceEventSchema = z.object({
  schemaVersion: z.literal(1),
  idempotencyKey: z.string().uuid(),
  childId: z.string().uuid(),
  type: z.enum(["check_in", "check_out"]),
  occurredAt: z.string().datetime(),
  expectedVersion: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export type QueuedAttendanceEvent = z.infer<typeof queuedAttendanceEventSchema>;

const STORAGE_KEY = "nurtureops-demo-attendance-queue-v1";
const MAX_EVENTS = 50;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function readAttendanceQueue(now = Date.now()): QueuedAttendanceEvent[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = z.array(queuedAttendanceEventSchema).parse(JSON.parse(raw));
    const retained = parsed.filter(
      (event) => now - new Date(event.createdAt).valueOf() <= MAX_AGE_MS,
    );
    if (retained.length !== parsed.length) writeAttendanceQueue(retained);
    return retained;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function enqueueAttendanceEvent(
  event: Omit<QueuedAttendanceEvent, "schemaVersion" | "createdAt">,
): QueuedAttendanceEvent {
  const queued = queuedAttendanceEventSchema.parse({
    ...event,
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
  });
  const current = readAttendanceQueue();
  const deduplicated = current.filter(
    (candidate) => candidate.idempotencyKey !== queued.idempotencyKey,
  );
  writeAttendanceQueue([...deduplicated, queued].slice(-MAX_EVENTS));
  return queued;
}

export function removeQueuedAttendanceEvent(idempotencyKey: string): void {
  writeAttendanceQueue(
    readAttendanceQueue().filter((event) => event.idempotencyKey !== idempotencyKey),
  );
}

function writeAttendanceQueue(events: readonly QueuedAttendanceEvent[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }
}
