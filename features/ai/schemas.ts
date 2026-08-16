import { z } from "zod";

export const proposalKindSchema = z.enum([
  "parent_update",
  "daily_note_summary",
  "schedule_change",
  "incident_summary",
  "invoice_explanation",
  "attendance_correction",
]);

export const careCopilotProposalSchema = z.object({
  proposalId: z.string().min(8),
  kind: proposalKindSchema,
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(1_500),
  evidence: z.array(
    z.object({
      sourceType: z.enum(["attendance", "care_event", "invoice", "roster", "policy", "ratio"]),
      sourceId: z.string().min(1),
      label: z.string().min(1).max(160),
    }),
  ),
  warnings: z.array(z.string().max(300)).max(8),
  inputFieldManifest: z.array(z.string()).max(30),
  expectedRecordVersion: z.number().int().nonnegative(),
  canMutate: z.literal(false),
});

export type CareCopilotProposal = z.infer<typeof careCopilotProposalSchema>;

const blockedFields = new Set([
  "allergies",
  "medication",
  "diagnosis",
  "incident_restricted_notes",
  "safeguarding_notes",
  "authorized_pickup_private_notes",
  "guardian_message_body",
]);

export function validateAiFieldManifest(fields: readonly string[]): {
  allowed: boolean;
  blocked: readonly string[];
} {
  const blocked = fields.filter((field) => blockedFields.has(field));
  return { allowed: blocked.length === 0, blocked };
}

export const proposalApprovalSchema = z.object({
  proposalId: z.string().min(8),
  expectedRecordVersion: z.number().int().nonnegative(),
  approvedBy: z.string().uuid(),
  approvedAt: z.string().datetime(),
  editedSummary: z.string().trim().min(1).max(1_500),
  acknowledgement: z.literal(true),
});

export type ProposalApproval = z.infer<typeof proposalApprovalSchema>;
