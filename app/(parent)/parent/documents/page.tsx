import { FileLock2 } from "lucide-react";

import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";

export default function ParentDocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Family documents"
        title="Documents"
        description="Only files granted through the active child relationship appear here."
      />
      <section className="panel panel-body">
        <FileLock2 size={28} aria-hidden="true" />
        <EmptyState
          title="No shared documents"
          description="The private storage bucket contains no seeded child files."
        />
      </section>
      <div style={{ height: 16 }} />
      <Callout title="Private by default">
        Signed access is authorized at request time; public storage URLs are not used.
      </Callout>
    </>
  );
}
