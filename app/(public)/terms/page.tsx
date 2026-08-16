import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <main className="public-page">
      <p className="eyebrow">Demonstration terms</p>
      <h1>Portfolio software, not operational advice.</h1>
      <p>
        NurtureOps AI is provided as a synthetic-data demonstration. It must not be used to make
        medical, legal, safeguarding, licensing, tax, ratio, pickup or emergency decisions.
      </p>
      <h2>No regulated outcome claims</h2>
      <p>
        Configured ratio alerts are operational aids only. Incident, medication and consent screens
        illustrate bounded workflows and do not certify a centre&apos;s obligations.
      </p>
      <h2>No real transactions</h2>
      <p>
        Payment, email and SMS adapters are disabled. Manual synthetic states must not be
        represented as real payment or delivery success.
      </p>
    </main>
  );
}
