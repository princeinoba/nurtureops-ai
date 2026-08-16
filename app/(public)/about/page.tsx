import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="public-page">
      <p className="eyebrow">About the portfolio demonstration</p>
      <h1>A calmer operating layer for childcare teams.</h1>
      <p>
        NurtureOps AI is a clean-room portfolio build informed by childcare attendance and billing
        workflows, operational care patterns, and published AI tooling. No source application was
        merged into this product.
      </p>
      <h2>Three role-correct experiences</h2>
      <p>
        Directors see centre operations and financial review. Educators get a mobile-first roster,
        attendance and structured care log. Guardians see only approved information for children
        with an active relationship.
      </p>
      <h2>AI stays in the proposal lane</h2>
      <p>
        Care Copilot reads minimum authorized synthetic fields through deterministic tools. It can
        draft or explain, but it cannot check a child in, publish a report, send a message, issue an
        invoice, approve an incident, or change safety data.
      </p>
      <h2>Honest limits</h2>
      <p>
        This deployment is not a compliance certification, legal service, medical tool, emergency
        service, or production childcare system. Jurisdiction, privacy, safeguarding, retention,
        provider, backup and operational reviews remain required before real data can be used.
      </p>
    </main>
  );
}
