import { CalendarCheck2, Clock3, MapPin } from "lucide-react";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";

export default function ParentAttendancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Family attendance"
        title="Maya is here"
        description="Attendance visible through the active synthetic guardian relationship."
      />
      <section className="panel">
        <div className="list-row">
          <span className="child-avatar">
            <CalendarCheck2 size={19} />
          </span>
          <span className="list-row-main">
            <strong>Checked in at 8:12 AM</strong>
            <span>Friday, August 14, 2026</span>
          </span>
          <StatusPill tone="positive">present</StatusPill>
        </div>
        <div className="panel-body stack">
          <p>
            <MapPin size={16} aria-hidden="true" /> Willow Room
          </p>
          <p>
            <Clock3 size={16} aria-hidden="true" /> Latest accepted event: check-in
          </p>
        </div>
      </section>
      <div style={{ height: 16 }} />
      <Callout title="Corrections are explicit">
        A corrected attendance event keeps its original history and is never silently overwritten.
      </Callout>
    </>
  );
}
