import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero">
      <section className="hero-copy">
        <p className="eyebrow">Human-centred childcare operations</p>
        <h1>
          More time for care. <em>Less operational noise.</em>
        </h1>
        <p>
          Attendance, room planning, family updates, safety workflows and financially correct
          billing in one calm workspace, with AI proposals that always wait for a person.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/sign-in">
            Open synthetic demo <ArrowRight size={18} />
          </Link>
          <Link className="button-secondary" href="/about">
            See how it works
          </Link>
        </div>
        <div className="hero-note">
          <ShieldCheck size={15} aria-hidden="true" /> Synthetic identities only; no real child
          data; no live payments
        </div>
      </section>
      <section className="hero-preview" aria-label="NurtureOps director dashboard preview">
        <div className="preview-window">
          <div className="preview-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-content">
            <div className="preview-greeting">
              <small>Friday at Lakeshore Centre</small>
              <strong>Good morning, Jordan.</strong>
            </div>
            <div className="preview-metrics">
              <div>
                <small>Present</small>
                <strong>16</strong>
              </div>
              <div>
                <small>Rooms</small>
                <strong>3</strong>
              </div>
              <div>
                <small>To review</small>
                <strong>2</strong>
              </div>
            </div>
            <div className="preview-list">
              <div>
                <span />
                <p>
                  Willow Room
                  <small>
                    <CheckCircle2 size={11} /> Within configured policy
                  </small>
                </p>
              </div>
              <div>
                <span />
                <p>
                  Care Copilot
                  <small>
                    <Sparkles size={11} /> One review-ready draft
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
