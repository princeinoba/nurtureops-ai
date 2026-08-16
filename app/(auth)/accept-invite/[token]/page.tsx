import Link from "next/link";

import { Callout } from "@/components/ui/primitives";

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const looksSynthetic = token === "synthetic-invite";
  return (
    <main className="auth-card">
      <p className="eyebrow">Invitation</p>
      <h1>{looksSynthetic ? "Synthetic invitation preview" : "Invitation unavailable"}</h1>
      <Callout title={looksSynthetic ? "Safe demo state" : "Enumeration-safe response"}>
        {looksSynthetic
          ? "A real flow stores only the token hash and consumes it atomically after email binding and expiry checks."
          : "This link is invalid, expired, consumed or revoked. For privacy, no additional detail is disclosed."}
      </Callout>
      <Link className="button-secondary" href="/sign-in">
        Return to sign in
      </Link>
    </main>
  );
}
