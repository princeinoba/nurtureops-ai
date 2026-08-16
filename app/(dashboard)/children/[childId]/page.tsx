import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoCareTimeline, findDemoChild } from "@/lib/demo/data";

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findDemoChild(childId);
  if (!child) notFound();

  return (
    <>
      <Link className="text-button" href="/children">
        <ArrowLeft size={15} /> All children
      </Link>
      <PageHeader
        eyebrow={child.room}
        title={child.displayName}
        description="Synthetic enrolment summary with purpose-limited visibility."
        actions={
          <StatusPill tone={child.status === "present" ? "positive" : "neutral"}>
            {child.status}
          </StatusPill>
        }
      />
      <section className="detail-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Today&apos;s private timeline</h2>
              <p>Only published entries become guardian-visible</p>
            </div>
            <FileText size={20} />
          </div>
          <div className="panel-body timeline">
            {demoCareTimeline.map((event) => (
              <div className="timeline-item" key={`${event.time}-${event.type}`}>
                <span className="timeline-time">{event.time}</span>
                <span className="timeline-dot" aria-hidden="true" />
                <div className="timeline-content">
                  <strong>{event.type}</strong>
                  <p>{event.detail}</p>
                  <StatusPill tone={event.visible ? "positive" : "attention"}>
                    {event.visible ? "approved" : "private draft"}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </article>
        <aside className="stack">
          <article className="panel panel-body">
            <h2>Relationships</h2>
            <dl>
              <div className="key-value">
                <dt>Guardians</dt>
                <dd>{child.guardianNames.join(", ")}</dd>
              </div>
              <div className="key-value">
                <dt>Pickup</dt>
                <dd>{child.pickupStatus}</dd>
              </div>
              <div className="key-value">
                <dt>Age group</dt>
                <dd>{child.ageGroup}</dd>
              </div>
            </dl>
          </article>
          <Callout title="Sensitive safety boundary" tone="warning">
            Allergy, medication, incident and safeguarding narratives are hidden from this general
            profile and excluded from Care Copilot by default.
          </Callout>
          <Callout title="Synthetic identity">
            <ShieldCheck size={15} /> This person is fictional and exists only for demonstration.
          </Callout>
        </aside>
      </section>
    </>
  );
}
