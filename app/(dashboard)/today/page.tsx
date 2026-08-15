import { ArrowRight, CalendarClock, Plus, UserRoundCheck } from "lucide-react";
import Link from "next/link";

import { CareCopilotPanel } from "@/components/ai/care-copilot-panel";
import { MetricCard, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoChildren, demoRooms } from "@/lib/demo/data";

export default function TodayPage() {
  const present = demoChildren.filter((child) => child.status === "present").length + 14;
  return (
    <>
      <PageHeader
        eyebrow="Lakeshore Centre - Friday"
        title="Good morning, Jordan."
        description="A calm view of attendance, room coverage, reviews and family-facing work."
        actions={
          <>
            <Link className="button-secondary" href="/reports">
              <CalendarClock size={17} /> Daily brief
            </Link>
            <Link className="button" href="/children">
              <Plus size={17} /> Enrol synthetic child
            </Link>
          </>
        }
      />
      <section className="metric-grid" aria-label="Today at a glance">
        <MetricCard
          label="Children present"
          value={String(present)}
          detail="of 21 expected"
          tone="positive"
        />
        <MetricCard label="Staff on floor" value="6" detail="one change at 2:00 PM" />
        <MetricCard
          label="Needs review"
          value="2"
          detail="attendance and pickup"
          tone="attention"
        />
        <MetricCard label="Family updates" value="9" detail="4 ready to publish" />
      </section>
      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Room pulse</h2>
              <p>Present, planned and configured staffing policy</p>
            </div>
            <Link className="text-button" href="/rooms">
              All rooms <ArrowRight size={15} />
            </Link>
          </div>
          <div>
            {demoRooms.map((room) => (
              <Link className="list-row room-list-row" href={`/rooms/${room.id}`} key={room.id}>
                <span className="child-avatar" aria-hidden="true">
                  {room.name.slice(0, 1)}
                </span>
                <span className="list-row-main">
                  <strong>{room.name}</strong>
                  <span>
                    {room.present} present / {room.expected} expected / {room.staff} staff
                  </span>
                </span>
                <StatusPill tone={room.requiredStaff > room.staff ? "attention" : "positive"}>
                  {room.status}
                </StatusPill>
              </Link>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Arrivals & handoffs</h2>
              <p>Recent synthetic activity</p>
            </div>
            <UserRoundCheck size={20} />
          </div>
          <div>
            {demoChildren.slice(0, 3).map((child) => (
              <Link className="list-row" href={`/children/${child.id}`} key={child.id}>
                <span className="child-avatar">{child.initials}</span>
                <span className="list-row-main">
                  <strong>{child.displayName}</strong>
                  <span>{child.lastEvent}</span>
                </span>
              </Link>
            ))}
          </div>
        </article>
      </section>
      <div style={{ height: 20 }} />
      <CareCopilotPanel />
    </>
  );
}
