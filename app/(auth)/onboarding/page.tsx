import Link from "next/link";

import { Callout } from "@/components/ui/primitives";

export default function OnboardingPage() {
  return (
    <main className="auth-card">
      <p className="eyebrow">Role-aware onboarding</p>
      <h1>Set up a centre, not a database token.</h1>
      <div className="stack">
        <Callout title="1. Centre profile">
          Name, timezone, currency and approved jurisdiction.
        </Callout>
        <Callout title="2. Team">Invite staff with one-use, expiring, email-bound links.</Callout>
        <Callout title="3. Rooms">Add operating hours and reviewed ratio policy versions.</Callout>
        <Callout title="4. First family">
          Enrol a synthetic child and guardian relationship.
        </Callout>
      </div>
      <Link className="button" href="/today">
        Continue with synthetic centre
      </Link>
    </main>
  );
}
