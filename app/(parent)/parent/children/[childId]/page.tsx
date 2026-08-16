import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoCareTimeline, demoChildren } from "@/lib/demo/data";

const authorizedChild = demoChildren[0];

export default async function ParentChildPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  if (!authorizedChild || childId !== authorizedChild.id) notFound();

  return (
    <>
      <Link className="text-button" href="/parent">
        <ArrowLeft size={15} /> Family home
      </Link>
      <PageHeader
        eyebrow="Approved child timeline"
        title={authorizedChild.displayName}
        description="Relationship-scoped, educator-reviewed synthetic updates."
        actions={<StatusPill tone="positive">active relationship</StatusPill>}
      />
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Friday, August 14</h2>
            <p>Published moments only</p>
          </div>
          <LockKeyhole size={20} />
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
                  <StatusPill tone="positive">educator approved</StatusPill>
                </div>
              </div>
            ))}
        </div>
      </section>
      <div style={{ height: 16 }} />
      <Callout title="Cross-family protection">
        A guardian route requires an active database relationship in addition to organization scope.
        Unrelated child identifiers return the same not-found response.
      </Callout>
    </>
  );
}
