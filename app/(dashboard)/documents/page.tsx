import { FileCheck2, LockKeyhole, Upload } from "lucide-react";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";

const documents = [
  {
    name: "Synthetic enrolment consent",
    state: "signed",
    visibility: "director + related guardians",
  },
  { name: "Emergency contact authorization", state: "current", visibility: "assigned staff" },
  {
    name: "Medication authorization model",
    state: "demo hold",
    visibility: "restricted reviewers",
  },
];

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documents & consent"
        title="Private by default"
        description="Versioned consent history, private storage and short-lived authorized downloads."
        actions={
          <button className="button" type="button" disabled>
            <Upload size={17} /> Upload
          </button>
        }
      />
      <Callout title="Operational hold" tone="warning">
        Medication support is modelled as authorization + administration + review only. It offers no
        dosage or clinical advice and awaits jurisdictional policy approval.
      </Callout>
      <div style={{ height: 16 }} />
      <section className="panel">
        <div>
          {documents.map((document) => (
            <div className="list-row" key={document.name}>
              <span className="child-avatar">
                <FileCheck2 size={18} />
              </span>
              <span className="list-row-main">
                <strong>{document.name}</strong>
                <span>
                  <LockKeyhole size={12} /> {document.visibility}
                </span>
              </span>
              <StatusPill tone={document.state === "demo hold" ? "attention" : "positive"}>
                {document.state}
              </StatusPill>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
