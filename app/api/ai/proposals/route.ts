import { randomUUID } from "node:crypto";

import { z } from "zod";

import { careCopilotProposalSchema } from "@/features/ai/schemas";

const requestSchema = z.object({
  kind: z.enum([
    "parent_update",
    "daily_note_summary",
    "schedule_change",
    "incident_summary",
    "invoice_explanation",
    "attendance_correction",
  ]),
  recordId: z.string().uuid(),
  instruction: z.string().trim().min(1).max(500),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: { code: "INVALID_INPUT" } }, { status: 400 });
  }

  const proposal = careCopilotProposalSchema.parse({
    proposalId: randomUUID(),
    kind: parsed.data.kind,
    title: "A small moment from today",
    summary:
      "Maya joined the garden colour hunt and helped the group find three shades of green. This draft is ready for an educator to review and edit before publication.",
    evidence: [
      {
        sourceType: "care_event",
        sourceId: parsed.data.recordId,
        label: "Synthetic structured activity - 10:20 AM",
      },
    ],
    warnings: [
      "No record has been changed.",
      "An educator must review; deterministic authorization and version checks run before publish.",
    ],
    inputFieldManifest: ["structured_event_type", "occurred_at", "neutral_activity_label"],
    expectedRecordVersion: 1,
    canMutate: false,
  });

  return Response.json(proposal, {
    headers: { "cache-control": "no-store", "x-nurtureops-ai-mode": "synthetic-deterministic" },
  });
}
