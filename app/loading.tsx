export default function Loading() {
  return (
    <main className="main-content" aria-busy="true" aria-live="polite">
      <div className="panel panel-body">
        <p className="eyebrow">Loading</p>
        <h1>Preparing the workspace...</h1>
      </div>
    </main>
  );
}
