import { BadgeCheck, Plus, UserRoundCog } from "lucide-react";

import { PageHeader, StatusPill } from "@/components/ui/primitives";

const staff = [
  { name: "Jordan Lee", role: "Director", room: "Centre-wide", qualification: "reviewed" },
  { name: "Alex Rivera", role: "Room lead", room: "Willow Room", qualification: "current" },
  { name: "Casey Brooks", role: "Educator", room: "Cedar Room", qualification: "current" },
  { name: "Robin Singh", role: "Educator", room: "Maple Room", qualification: "review soon" },
];

export default function StaffPage() {
  return (
    <>
      <PageHeader
        eyebrow="People & coverage"
        title="Staff"
        description="Location assignments, role grants, qualifications and shift coverage."
        actions={
          <button className="button" type="button" disabled>
            <Plus size={17} /> Invite staff
          </button>
        }
      />
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Synthetic team</h2>
            <p>Role grants never come from editable profile metadata</p>
          </div>
          <UserRoundCog size={20} />
        </div>
        <div>
          {staff.map((member) => (
            <div className="list-row" key={member.name}>
              <span className="child-avatar">
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="list-row-main">
                <strong>{member.name}</strong>
                <span>
                  {member.role} / {member.room}
                </span>
              </span>
              <StatusPill tone={member.qualification === "review soon" ? "attention" : "positive"}>
                <BadgeCheck size={13} /> {member.qualification}
              </StatusPill>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
