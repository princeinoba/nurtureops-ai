"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";

import { StatusPill } from "@/components/ui/primitives";

const eventTypes = ["meal", "nap", "toileting", "activity", "observation", "mood"] as const;

export function CareLogDemo() {
  const [events, setEvents] = useState<
    { id: string; type: (typeof eventTypes)[number]; detail: string; state: "draft" }[]
  >([]);
  const [type, setType] = useState<(typeof eventTypes)[number]>("meal");
  const [detail, setDetail] = useState("");
  const [announcement, setAnnouncement] = useState("No unpublished events added.");

  function addEvent(): void {
    const normalized = detail.trim();
    if (!normalized) {
      setAnnouncement("Add a short structured detail before saving.");
      return;
    }
    setEvents((current) => [
      ...current,
      { id: crypto.randomUUID(), type, detail: normalized, state: "draft" },
    ]);
    setDetail("");
    setAnnouncement("Synthetic event saved as a private draft. It has not been published.");
  }

  return (
    <section className="content-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Structured care event</h2>
            <p>Minimum free text; guardian visibility requires staff publication</p>
          </div>
        </div>
        <div className="panel-body form-grid">
          <div className="field">
            <label htmlFor="event-type">Event type</label>
            <select
              id="event-type"
              value={type}
              onChange={(event) => setType(event.target.value as (typeof eventTypes)[number])}
            >
              {eventTypes.map((eventType) => (
                <option value={eventType} key={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
          </div>
          <div className="field field--full">
            <label htmlFor="event-detail">Neutral structured detail</label>
            <textarea
              id="event-detail"
              value={detail}
              maxLength={280}
              onChange={(event) => setDetail(event.target.value)}
              placeholder="Example: Morning snack - most eaten"
            />
            <small>Do not enter medical, incident, safeguarding or real child information.</small>
          </div>
          <button className="button" type="button" onClick={addEvent}>
            <Plus size={17} /> Save private draft
          </button>
          <p aria-live="polite">{announcement}</p>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Today&apos;s drafts</h2>
            <p>Not visible to guardians</p>
          </div>
          <StatusPill>{events.length} draft</StatusPill>
        </div>
        <div>
          {events.length === 0 ? (
            <div className="empty-state">
              <Check size={28} />
              <h2>No new drafts</h2>
              <p>Structured events will appear here for educator review.</p>
            </div>
          ) : (
            events.map((event) => (
              <div className="list-row" key={event.id}>
                <span className="list-row-main">
                  <strong>{event.type}</strong>
                  <span>{event.detail}</span>
                </span>
                <StatusPill tone="attention">private draft</StatusPill>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
