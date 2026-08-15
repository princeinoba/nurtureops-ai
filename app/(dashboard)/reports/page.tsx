import { BarChart3, Download, LockKeyhole } from "lucide-react";

import { Callout, MetricCard, PageHeader, StatusPill } from "@/components/ui/primitives";

const reports = [
  ["Attendance summary", "Daily and period attendance with exception review", "available"],
  ["Room utilization", "Present and scheduled counts by configured capacity", "available"],
  ["Staffing coverage", "Planned and observed coverage under policy versions", "available"],
  ["Billing summary", "Draft, issued and outstanding minor-unit totals", "available"],
  ["Incident summary", "Restricted counts only; narrative excluded", "restricted"],
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reports & export"
        title="Evidence without overexposure"
        description="Purpose-limited operational views and recent-auth, expiring export jobs."
      />
      <section className="metric-grid">
        <MetricCard label="Attendance today" value="76%" detail="16 of 21 expected" />
        <MetricCard label="Room utilization" value="53%" detail="16 of 30 configured" />
        <MetricCard
          label="Outstanding"
          value="$842.50"
          detail="synthetic manual state"
          tone="attention"
        />
        <MetricCard
          label="Open export jobs"
          value="0"
          detail="signed links expire"
          tone="positive"
        />
      </section>
      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Report catalogue</h2>
              <p>Role and purpose restrictions apply</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div>
            {reports.map(([name, detail, state]) => (
              <div className="list-row" key={name}>
                <span className="list-row-main">
                  <strong>{name}</strong>
                  <span>{detail}</span>
                </span>
                <StatusPill tone={state === "restricted" ? "attention" : "positive"}>
                  {state}
                </StatusPill>
              </div>
            ))}
          </div>
        </article>
        <aside className="stack">
          <article className="panel panel-body">
            <LockKeyhole size={22} />
            <h2>Organization export</h2>
            <p>Recent authentication, authorization and an asynchronous job are required.</p>
            <button className="button-secondary" type="button" disabled>
              <Download size={16} /> Start export
            </button>
          </article>
          <Callout title="Export lifecycle">
            Versioned JSON + human-readable HTML + data dictionary / short-lived signed download /
            expiry/deletion audit. Exports are never emailed as attachments.
          </Callout>
        </aside>
      </section>
    </>
  );
}
