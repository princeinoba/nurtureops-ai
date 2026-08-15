import { Mail, MessageCircle, Send } from "lucide-react";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoChildren } from "@/lib/demo/data";

export default function FamiliesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Family communication"
        title="Families"
        description="Relationship-scoped drafts, announcements and provider-aware delivery states."
        actions={
          <button className="button" type="button" disabled>
            <MessageCircle size={17} /> New draft
          </button>
        }
      />
      <Callout title="Provider disabled - no fake sent state">
        <Mail size={15} /> Email and SMS adapters are not connected. Synthetic messages remain
        drafts and are never labelled delivered.
      </Callout>
      <div style={{ height: 16 }} />
      <section className="panel">
        <div>
          {demoChildren.map((child) => (
            <div className="list-row" key={child.id}>
              <span className="child-avatar">{child.initials}</span>
              <span className="list-row-main">
                <strong>{child.guardianNames.join(" & ")}</strong>
                <span>{child.displayName} / quiet hours respected</span>
              </span>
              <StatusPill tone="info">relationship active</StatusPill>
              <button className="button-secondary" type="button" disabled>
                <Send size={15} /> Draft only
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
