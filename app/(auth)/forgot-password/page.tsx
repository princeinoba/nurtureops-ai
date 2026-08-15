import Link from "next/link";

import { Callout } from "@/components/ui/primitives";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-card">
      <p className="eyebrow">Account recovery</p>
      <h1>Recovery is disabled in demo mode.</h1>
      <Callout title="Honest unavailable state">
        No email provider or live Auth project is connected, so this demo does not pretend a
        recovery message was sent.
      </Callout>
      <Link className="button-secondary" href="/sign-in">
        Return to demo access
      </Link>
    </main>
  );
}
