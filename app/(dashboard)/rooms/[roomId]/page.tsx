import { ArrowLeft, CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoChildren, demoRooms } from "@/lib/demo/data";

export default async function RoomDetailPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const room = demoRooms.find((candidate) => candidate.id === roomId);
  if (!room) notFound();
  const children = demoChildren.filter((child) => child.room === room.name);

  return (
    <>
      <Link className="text-button" href="/rooms">
        <ArrowLeft size={15} /> All rooms
      </Link>
      <PageHeader
        eyebrow="Room roster"
        title={room.name}
        description="Assigned synthetic children, planned coverage and deterministic policy explanation."
        actions={
          <StatusPill tone={room.staff < room.requiredStaff ? "attention" : "positive"}>
            {room.status}
          </StatusPill>
        }
      />
      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Roster</h2>
              <p>
                {room.present} present / {room.expected} expected
              </p>
            </div>
            <Users size={20} />
          </div>
          <div>
            {children.map((child) => (
              <Link className="list-row" href={`/children/${child.id}`} key={child.id}>
                <span className="child-avatar">{child.initials}</span>
                <span className="list-row-main">
                  <strong>{child.displayName}</strong>
                  <span>{child.lastEvent}</span>
                </span>
                <StatusPill tone={child.status === "present" ? "positive" : "neutral"}>
                  {child.status}
                </StatusPill>
              </Link>
            ))}
          </div>
        </article>
        <aside className="stack">
          <article className="panel panel-body">
            <CalendarDays size={22} />
            <h2>Coverage</h2>
            <p>
              {room.staff} qualified staff present; {room.requiredStaff} required by synthetic
              policy DEMO-POLICY-2026-01.
            </p>
          </article>
          <Callout title="Configurable, versioned, reviewed">
            Current observation records the policy version, present counts and explanation. It does
            not certify licensing compliance.
          </Callout>
        </aside>
      </section>
    </>
  );
}
