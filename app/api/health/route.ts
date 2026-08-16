export function GET() {
  return Response.json(
    {
      status: "ok",
      product: "nurtureops-ai",
      mode: "synthetic-demo",
      liveProviders: false,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
