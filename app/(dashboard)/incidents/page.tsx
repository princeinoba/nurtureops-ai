import { Plus, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";

const incidents = [
  {
    id: "66666666-6666-4666-8666-666666666661",
    reference: "DEMO-INC-014",
    occurred: "Aug 13 - 3:18 PM",
    room: "Willow Room",
    status: "reviewed",
  },
  {
    id: "66666666-6666-4666-8666-666666666662",
    reference: "DEMO-INC-013",
    occurred: "Aug 8 - 10:42 AM",
    room: "Cedar Room",
    status: "guardian acknowledged",
  },
];

export default function IncidentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Incident workflow"
        description="Facts, restricted notes, reviewer decisions and acknowledgement with immutable history."
        actions={
          <button className="button" type="button" disabled>
            <Plus size={17} /> New incident
          </button>
        }
      />
      <Callout title="Bounded demonstration" tone="warning">
        <ShieldAlert size={15} /> No regulatory submission, medical conclusion or safeguarding
        outcome is claimed. AI cannot finalize or approve an incident.
      </Callout>
      <div style={{ height: 16 }} />
      <section className="panel">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Occurred</th>
                <th>Room</th>
                <th>Workflow state</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>
                    <Link href={`/incidents/${incident.id}`}>
                      <strong>{incident.reference}</strong>
                      <small>Synthetic facts only</small>
                    </Link>
                  </td>
                  <td>{incident.occurred}</td>
                  <td>{incident.room}</td>
                  <td>
                    <StatusPill tone="attention">{incident.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
