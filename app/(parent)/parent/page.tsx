import { CalendarCheck2, CreditCard, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

import { MetricCard, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoCareTimeline, demoChildren, demoInvoices } from "@/lib/demo/data";

const child = demoChildren[0];
const invoice = demoInvoices[0];

export default function ParentHomePage() {
  if (!child || !invoice) return null;
  return (
    <>
      <PageHeader
        eyebrow="Family portal - related child only"
        title="Hello, Avery."
        description="Approved updates, attendance and invoices for your active synthetic relationship."
      />
      <section className="metric-grid">
        <MetricCard
          label="Maya today"
          value="Here"
          detail="checked in at 8:12 AM"
          tone="positive"
        />
        <MetricCard label="Updates" value="4" detail="approved for your view" />
        <MetricCard
          label="Invoice"
          value="$842.50"
          detail="issued synthetic invoice"
          tone="attention"
        />
        <MetricCard label="Messages" value="0" detail="provider disabled" />
      </section>
      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Today with Maya</h2>
              <p>Only educator-approved entries</p>
            </div>
            <Link className="text-button" href={`/parent/children/${child.id}`}>
              Full timeline
            </Link>
          </div>
          <div className="panel-body timeline">
            {demoCareTimeline
              .filter((event) => event.visible)
              .map((event) => (
                <div className="timeline-item" key={`${event.time}-${event.type}`}>
                  <span className="timeline-time">{event.time}</span>
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <strong>{event.type}</strong>
                    <p>{event.detail}</p>
                  </div>
                </div>
              ))}
          </div>
        </article>
        <aside className="stack">
          <Link className="panel panel-body" href={`/parent/children/${child.id}`}>
            <Sparkles size={22} />
            <h2>Daily report</h2>
            <p>Four reviewed moments are ready.</p>
            <StatusPill tone="positive">published</StatusPill>
          </Link>
          <Link className="panel panel-body" href="/parent/invoices">
            <CreditCard size={22} />
            <h2>{invoice.number}</h2>
            <p>View the immutable synthetic invoice.</p>
          </Link>
          <article className="panel panel-body">
            <MessageCircle size={22} />
            <h2>Messages unavailable</h2>
            <p>No provider is connected, so the demo does not show a fake sent state.</p>
          </article>
        </aside>
      </section>
      <div className="offline-status">
        <CalendarCheck2 size={15} /> Attendance: checked in 8:12 AM / Willow Room
      </div>
    </>
  );
}
