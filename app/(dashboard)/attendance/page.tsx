import { Download, TriangleAlert } from "lucide-react";

import { AttendanceBoard } from "@/components/attendance/attendance-board";
import { Callout, MetricCard, PageHeader } from "@/components/ui/primitives";
import { demoChildren } from "@/lib/demo/data";

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Attendance & handoff"
        title="Check in and out"
        description="Idempotent events, explicit handoff, reviewable corrections and bounded offline replay."
        actions={
          <button className="button-secondary" type="button" disabled>
            <Download size={17} /> Export requires recent auth
          </button>
        }
      />
      <section className="metric-grid">
        <MetricCard label="Present" value="16" detail="across 3 rooms" tone="positive" />
        <MetricCard label="Expected" value="21" detail="5 yet to arrive" />
        <MetricCard label="Review" value="1" detail="missing check-out" tone="attention" />
        <MetricCard label="Offline queue" value="0" detail="bounded to 24 hours" />
      </section>
      <Callout title="Demo receipt, not a real check-in" tone="warning">
        <TriangleAlert size={15} /> Buttons below validate an offline-safe synthetic event and
        return a non-persisted receipt. They do not change operational attendance.
      </Callout>
      <div style={{ height: 14 }} />
      <AttendanceBoard records={demoChildren} />
    </>
  );
}
