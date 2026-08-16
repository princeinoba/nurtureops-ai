import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoRooms } from "@/lib/demo/data";

export default function RoomsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rooms & schedule"
        title="Coverage at a glance"
        description="Planned versus present counts under a reviewed, versioned configuration."
        actions={
          <button className="button-secondary" type="button">
            <SlidersHorizontal size={17} /> Policy versions
          </button>
        }
      />
      <Callout title="Operational aid - not legal certification">
        Ratios and capacity rules must be approved for the launch jurisdiction. This synthetic
        policy is illustrative only.
      </Callout>
      <div style={{ height: 16 }} />
      <section className="metric-grid">
        {demoRooms.map((room) => (
          <Link href={`/rooms/${room.id}`} key={room.id}>
            <article className="metric-card">
              <p>{room.name}</p>
              <strong>
                {room.present}
                <small> / {room.capacity}</small>
              </strong>
              <StatusPill tone={room.staff < room.requiredStaff ? "attention" : "positive"}>
                {room.staff} staff / {room.requiredStaff} configured
              </StatusPill>
            </article>
          </Link>
        ))}
      </section>
    </>
  );
}
