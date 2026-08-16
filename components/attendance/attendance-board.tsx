"use client";

import { Check, CloudOff, LoaderCircle, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { StatusPill } from "@/components/ui/primitives";
import {
  enqueueAttendanceEvent,
  readAttendanceQueue,
  removeQueuedAttendanceEvent,
  type QueuedAttendanceEvent,
} from "@/features/attendance/offline-queue";
import type { DemoChild } from "@/lib/demo/data";

type SyncState = "idle" | "queued" | "syncing" | "receipt" | "failed";

async function validateQueuedAttendanceEvent(event: QueuedAttendanceEvent): Promise<void> {
  const response = await fetch("/api/attendance/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) throw new Error("Synthetic validation failed.");
}

export function AttendanceBoard({ records }: { records: readonly DemoChild[] }) {
  const [queue, setQueue] = useState<QueuedAttendanceEvent[]>(readAttendanceQueue);
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [announcement, setAnnouncement] = useState("Attendance demo ready.");

  useEffect(() => {
    let cancelled = false;

    async function replayQueue(): Promise<void> {
      const pending = readAttendanceQueue();
      if (pending.length === 0) return;

      setSyncState("syncing");
      setAnnouncement("Revalidating queued synthetic attendance events after reconnect.");
      try {
        for (const event of pending) {
          await validateQueuedAttendanceEvent(event);
          removeQueuedAttendanceEvent(event.idempotencyKey);
        }
        if (cancelled) return;
        setQueue(readAttendanceQueue());
        setSyncState("receipt");
        setAnnouncement(
          "Queued synthetic attendance events were revalidated after reconnect. No operational record was changed.",
        );
      } catch {
        if (cancelled) return;
        setQueue(readAttendanceQueue());
        setSyncState("failed");
        setAnnouncement(
          "Reconnect replay failed safely. The bounded events remain queued for retry.",
        );
      }
    }

    function handleOnline(): void {
      void replayQueue();
    }

    window.addEventListener("online", handleOnline);
    if (navigator.onLine && readAttendanceQueue().length > 0) void replayQueue();

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  async function queueEvent(child: DemoChild): Promise<void> {
    const type = child.status === "present" ? "check_out" : "check_in";
    const event = enqueueAttendanceEvent({
      childId: child.id,
      type,
      occurredAt: new Date().toISOString(),
      expectedVersion: 1,
      idempotencyKey: crypto.randomUUID(),
    });
    setQueue(readAttendanceQueue());
    setSyncState("queued");
    setAnnouncement(
      `${type === "check_in" ? "Check-in" : "Check-out"} queued locally with a synthetic child identifier only.`,
    );

    if (!navigator.onLine) return;
    setSyncState("syncing");
    try {
      await validateQueuedAttendanceEvent(event);
      removeQueuedAttendanceEvent(event.idempotencyKey);
      setQueue(readAttendanceQueue());
      setSyncState("receipt");
      setAnnouncement(
        "Server validated a synthetic demo receipt. No operational record was changed.",
      );
    } catch {
      setSyncState("failed");
      setAnnouncement("Sync failed safely. The bounded event remains queued for retry.");
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Live attendance</h2>
          <p>Minimal offline queue; server authorization rechecked on replay</p>
        </div>
        <StatusPill tone={queue.length ? "attention" : "positive"}>
          {queue.length ? `${queue.length} queued` : "Queue clear"}
        </StatusPill>
      </div>
      <div className="offline-status" aria-live="polite">
        {syncState === "syncing" ? <LoaderCircle size={15} aria-hidden="true" /> : null}
        {syncState === "queued" || syncState === "failed" ? (
          <CloudOff size={15} aria-hidden="true" />
        ) : null}
        {syncState === "receipt" ? <Check size={15} aria-hidden="true" /> : null}
        {announcement}
      </div>
      <div>
        {records.map((child) => (
          <div className="list-row" key={child.id}>
            <span className="child-avatar" aria-hidden="true">
              {child.initials}
            </span>
            <span className="list-row-main">
              <strong>{child.displayName}</strong>
              <span>
                {child.room} / {child.lastEvent}
              </span>
            </span>
            <StatusPill tone={child.status === "present" ? "positive" : "neutral"}>
              {child.status.replace("_", " ")}
            </StatusPill>
            <button
              className="button-secondary"
              type="button"
              onClick={() => void queueEvent(child)}
              aria-label={`${child.status === "present" ? "Check out" : "Check in"} ${child.displayName}`}
            >
              {child.status === "present" ? <LogOut size={16} /> : <LogIn size={16} />}
              {child.status === "present" ? "Check out" : "Check in"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
