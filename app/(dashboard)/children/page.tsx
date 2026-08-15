import { Plus, Search } from "lucide-react";
import Link from "next/link";

import { PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoChildren } from "@/lib/demo/data";

export default function ChildrenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enrolment"
        title="Children"
        description="Minimum necessary records, guardian relationships and pickup authorization."
        actions={
          <button className="button" type="button" disabled title="Synthetic demo only">
            <Plus size={17} /> Add child
          </button>
        }
      />
      <section className="panel">
        <div className="panel-header">
          <div className="field" style={{ width: "min(360px, 100%)" }}>
            <label className="eyebrow" htmlFor="child-search">
              Search synthetic directory
            </label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: 14 }} />
              <input id="child-search" placeholder="Name or room" style={{ paddingLeft: 38 }} />
            </div>
          </div>
          <StatusPill>{demoChildren.length} synthetic records</StatusPill>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Child</th>
                <th>Room</th>
                <th>Guardians</th>
                <th>Attendance</th>
                <th>Pickup</th>
              </tr>
            </thead>
            <tbody>
              {demoChildren.map((child) => (
                <tr key={child.id}>
                  <td>
                    <Link href={`/children/${child.id}`}>
                      <strong>{child.displayName}</strong>
                      <small>{child.ageGroup}</small>
                    </Link>
                  </td>
                  <td>{child.room}</td>
                  <td>{child.guardianNames.join(", ")}</td>
                  <td>
                    <StatusPill tone={child.status === "present" ? "positive" : "neutral"}>
                      {child.status.replace("_", " ")}
                    </StatusPill>
                  </td>
                  <td>
                    <StatusPill
                      tone={child.pickupStatus === "authorized" ? "positive" : "attention"}
                    >
                      {child.pickupStatus}
                    </StatusPill>
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
