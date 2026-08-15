import { ArrowLeft, History, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";

const allowedIds = new Set([
  "66666666-6666-4666-8666-666666666661",
  "66666666-6666-4666-8666-666666666662",
]);

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;
  if (!allowedIds.has(incidentId)) notFound();

  return (
    <>
      <Link className="text-button" href="/incidents">
        <ArrowLeft size={15} /> Incident list
      </Link>
      <PageHeader
        eyebrow="Synthetic safety record - DEMO-INC-014"
        title="Reviewed incident"
        description="Role-restricted facts and content-free audit metadata."
        actions={<StatusPill tone="attention">reviewed</StatusPill>}
      />
      <section className="detail-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Recorded facts</h2>
              <p>Fictional and intentionally minimal</p>
            </div>
            <LockKeyhole size={20} />
          </div>
          <div className="panel-body">
            <dl>
              <div className="key-value">
                <dt>Occurred</dt>
                <dd>August 13, 2026 at 3:18 PM</dd>
              </div>
              <div className="key-value">
                <dt>Location</dt>
                <dd>Willow Room activity area</dd>
              </div>
              <div className="key-value">
                <dt>Immediate response</dt>
                <dd>Standard centre review workflow started</dd>
              </div>
              <div className="key-value">
                <dt>Reviewer</dt>
                <dd>Restricted synthetic safety reviewer</dd>
              </div>
            </dl>
          </div>
        </article>
        <aside className="stack">
          <article className="panel panel-body">
            <History size={22} />
            <h2>Immutable history</h2>
            <p>Draft / submitted / reviewed</p>
            <p>Guardian acknowledgement remains pending.</p>
          </article>
          <Callout title="Restricted narrative">
            Sensitive notes are excluded from this general demo view, ordinary logs and Care Copilot
            inputs.
          </Callout>
        </aside>
      </section>
    </>
  );
}
