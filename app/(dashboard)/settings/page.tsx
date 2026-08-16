import { BotOff, Database, KeyRound, ShieldCheck } from "lucide-react";

import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Demo environment"
        description="Safe public/server separation with honest provider availability."
      />
      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Connections</h2>
              <p>Names and states only; secret values are never rendered</p>
            </div>
            <KeyRound size={20} />
          </div>
          <div>
            <div className="list-row">
              <Database size={20} />
              <span className="list-row-main">
                <strong>Supabase Auth + PostgreSQL</strong>
                <span>Local schema committed; remote project not connected</span>
              </span>
              <StatusPill tone="attention">not configured</StatusPill>
            </div>
            <div className="list-row">
              <BotOff size={20} />
              <span className="list-row-main">
                <strong>AI Gateway</strong>
                <span>Deterministic synthetic fallback active</span>
              </span>
              <StatusPill>disabled</StatusPill>
            </div>
            <div className="list-row">
              <ShieldCheck size={20} />
              <span className="list-row-main">
                <strong>Email, SMS & payments</strong>
                <span>Adapter boundaries only</span>
              </span>
              <StatusPill>disabled</StatusPill>
            </div>
          </div>
        </article>
        <aside className="stack">
          <Callout title="No browser credentials" tone="success">
            The UI cannot enter, reveal, test, migrate or reset a database. Service-role, AI,
            provider and signing secrets are server-only.
          </Callout>
          <Callout title="Destructive operations">
            Real deletion requires recent authentication, preview, authorization, reconciliation
            across Auth/Postgres/Storage/providers and an auditable job.
          </Callout>
        </aside>
      </section>
    </>
  );
}
