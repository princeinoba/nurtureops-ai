import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="auth-card">
      <p className="eyebrow">404</p>
      <h1>That page is not part of this demo.</h1>
      <Link className="button" href="/today">
        Return to Today
      </Link>
    </main>
  );
}
