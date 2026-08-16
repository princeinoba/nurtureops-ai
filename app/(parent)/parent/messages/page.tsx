import { MessageCircleOff } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/ui/primitives";

export default function ParentMessagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Family messages"
        title="Messages"
        description="Communication is relationship-scoped and provider-backed in operational mode."
      />
      <section className="panel panel-body">
        <MessageCircleOff size={28} aria-hidden="true" />
        <EmptyState
          title="Messaging provider not connected"
          description="This portfolio demo will not present a synthetic message as sent or delivered."
        />
      </section>
    </>
  );
}
