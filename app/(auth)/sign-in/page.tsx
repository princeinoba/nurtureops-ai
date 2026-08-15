import { ArrowRight, GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Callout } from "@/components/ui/primitives";

export default function SignInPage() {
  return (
    <main className="auth-card">
      <Link className="brand-lockup" href="/">
        <span className="brand-mark" aria-hidden="true">
          n
        </span>
        <span>
          <strong>NurtureOps</strong>
          <small>AI</small>
        </span>
      </Link>
      <p className="eyebrow">Synthetic portfolio access</p>
      <h1>Choose a demo experience</h1>
      <p>
        Supabase Auth is the only intended production identity system. Public signup is disabled;
        these links open fictional role-scoped views.
      </p>
      <Callout title="No credentials needed">
        Never enter real email addresses, passwords, child information or provider secrets.
      </Callout>
      <div className="auth-links">
        <Link className="button" href="/today">
          <ShieldCheck size={18} /> Director workspace <ArrowRight size={17} />
        </Link>
        <Link className="button-secondary" href="/care-log">
          <GraduationCap size={18} /> Educator workspace
        </Link>
        <Link className="button-secondary" href="/parent">
          <HeartHandshake size={18} /> Guardian portal
        </Link>
      </div>
      <p>
        <Link className="text-button" href="/forgot-password">
          Forgot password
        </Link>
      </p>
    </main>
  );
}
