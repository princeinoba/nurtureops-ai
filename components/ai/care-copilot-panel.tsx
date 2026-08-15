"use client";

import { Bot, Check, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import { Callout, StatusPill } from "@/components/ui/primitives";
import { careCopilotProposalSchema, type CareCopilotProposal } from "@/features/ai/schemas";

export function CareCopilotPanel() {
  const [proposal, setProposal] = useState<CareCopilotProposal | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "review" | "approved" | "error">("idle");
  const [announcement, setAnnouncement] = useState("Care Copilot demo is ready.");

  async function generateProposal(): Promise<void> {
    setState("loading");
    setAnnouncement("Generating a deterministic synthetic proposal.");
    try {
      const response = await fetch("/api/ai/proposals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "parent_update",
          recordId: "33333333-3333-4333-8333-333333333331",
          instruction: "Draft a neutral update from today's structured activity event.",
        }),
      });
      const parsed = careCopilotProposalSchema.parse(await response.json());
      setProposal(parsed);
      setState("review");
      setAnnouncement("Proposal ready for human review. No record was changed.");
    } catch {
      setState("error");
      setAnnouncement("Care Copilot is unavailable. Core workflows remain usable.");
    }
  }

  function approveForValidation(): void {
    setState("approved");
    setAnnouncement(
      "Review approval captured in the demo. No publication or database mutation occurred.",
    );
  }

  return (
    <section className="panel copilot" id="care-copilot">
      <div className="panel-header">
        <div className="copilot-header">
          <span className="copilot-mark" aria-hidden="true">
            <Bot size={21} />
          </span>
          <div>
            <h2>Care Copilot</h2>
            <p>Authorized evidence / typed proposals / human review</p>
          </div>
        </div>
        <StatusPill tone="info">Synthetic mode</StatusPill>
      </div>
      <div className="panel-body stack">
        {!proposal ? (
          <>
            <p>
              Draft a neutral parent update from the fictional structured care events on this page.
              Sensitive fields are excluded.
            </p>
            <Callout title="Bounded by design">
              The assistant cannot send, publish, check in/out, charge, issue, approve an incident
              or change safety data.
            </Callout>
            <button
              className="button"
              type="button"
              onClick={() => void generateProposal()}
              disabled={state === "loading"}
            >
              {state === "loading" ? <LoaderCircle size={17} /> : <Sparkles size={17} />}
              {state === "loading" ? "Preparing proposal..." : "Create review proposal"}
            </button>
          </>
        ) : (
          <div className="copilot-proposal">
            <div>
              <p className="eyebrow">Proposal - no mutation</p>
              <h3>{proposal.title}</h3>
              <p>{proposal.summary}</p>
            </div>
            <div className="copilot-evidence">
              <strong>Evidence</strong>
              {proposal.evidence.map((item) => (
                <span key={item.sourceId}>
                  {item.label} / {item.sourceType}
                </span>
              ))}
              <span>Input fields: {proposal.inputFieldManifest.join(", ")}</span>
            </div>
            {proposal.warnings.map((warning) => (
              <Callout title="Review boundary" key={warning}>
                {warning}
              </Callout>
            ))}
            <div className="page-actions">
              <button className="button" type="button" onClick={approveForValidation}>
                {state === "approved" ? <Check size={17} /> : <ShieldCheck size={17} />}
                {state === "approved" ? "Approved for validation" : "Approve for validation"}
              </button>
              <button className="button-secondary" type="button" onClick={() => setProposal(null)}>
                Reject
              </button>
            </div>
          </div>
        )}
        <p aria-live="polite">{announcement}</p>
      </div>
    </section>
  );
}
