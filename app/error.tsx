"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="auth-card" role="alert">
      <p className="eyebrow">Safe error</p>
      <h1>We could not load this view.</h1>
      <p>The error was redacted. Try again or return to a known route.</p>
      <button className="button" type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
