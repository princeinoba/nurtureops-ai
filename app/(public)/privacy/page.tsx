import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="public-page">
      <p className="eyebrow">Demo privacy notice</p>
      <h1>No real child or family information belongs here.</h1>
      <p>
        This portfolio demonstration uses fictional people, organizations, attendance events,
        invoices and care updates. Do not enter real child, guardian, staff, medical, incident,
        safeguarding, payment, bank or contact information.
      </p>
      <h2>Local demonstration state</h2>
      <p>
        Theme preference and a minimum synthetic offline event queue may be stored on your device.
        No complete child profile is cached for offline use. Clear site data to remove this local
        state.
      </p>
      <h2>AI state</h2>
      <p>
        Live AI is disabled in the checked-in demo configuration. The demonstration proposal is
        deterministic and synthetic. A future operational release requires provider, retention,
        residency, field-level and subprocessor review.
      </p>
      <h2>Not a production privacy policy</h2>
      <p>
        This notice describes the synthetic demo only. It does not claim PIPEDA, GDPR, COPPA, HIPAA
        or other legal compliance and must be replaced after qualified review for an approved launch
        jurisdiction.
      </p>
    </main>
  );
}
