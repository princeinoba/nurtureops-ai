import Link from "next/link";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-shell">
      <header className="public-nav">
        <Link className="brand-lockup" href="/">
          <span className="brand-mark" aria-hidden="true">
            n
          </span>
          <span>
            <strong>NurtureOps</strong>
            <small>AI</small>
          </span>
        </Link>
        <nav aria-label="Public navigation">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link className="button-secondary" href="/sign-in">
            Explore demo
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
