import "server-only";

import { tool } from "ai";
import { z } from "zod";

import { careCopilotProposalSchema, type CareCopilotProposal } from "@/features/ai/schemas";

export type AuthorizedActor = Readonly<{
  actorId: string;
  organizationId: string;
  locationIds: readonly string[];
  roles: readonly string[];
}>;

export interface CareCopilotDataSource {
  getDailyRoster(actor: AuthorizedActor, locationId: string): Promise<unknown>;
  getRoomRatioStatus(actor: AuthorizedActor, roomId: string): Promise<unknown>;
  getChildAuthorizedCareSummary(actor: AuthorizedActor, childId: string): Promise<unknown>;
  getAttendanceExceptions(actor: AuthorizedActor, locationId: string): Promise<unknown>;
  calculateInvoicePreview(actor: AuthorizedActor, contractId: string): Promise<unknown>;
  getCentrePolicyExcerpt(actor: AuthorizedActor, policyId: string): Promise<unknown>;
  draftProposal(
    actor: AuthorizedActor,
    input: Readonly<{
      kind: CareCopilotProposal["kind"];
      recordId: string;
      instruction: string;
    }>,
  ): Promise<CareCopilotProposal>;
}

const scopedId = z.object({ id: z.string().uuid() });

export function createCareCopilotTools(dataSource: CareCopilotDataSource, actor: AuthorizedActor) {
  return {
    getDailyRoster: tool({
      description: "Read the minimum authorized daily roster for one assigned location.",
      inputSchema: z.object({ locationId: z.string().uuid() }),
      execute: ({ locationId }) => dataSource.getDailyRoster(actor, locationId),
    }),
    getRoomRatioStatus: tool({
      description: "Read a deterministic ratio observation and its configured policy version.",
      inputSchema: z.object({ roomId: z.string().uuid() }),
      execute: ({ roomId }) => dataSource.getRoomRatioStatus(actor, roomId),
    }),
    getChildAuthorizedCareSummary: tool({
      description:
        "Read a minimum authorized care summary. Allergy, medication, incident, and safeguarding narratives are excluded.",
      inputSchema: z.object({ childId: z.string().uuid() }),
      execute: ({ childId }) => dataSource.getChildAuthorizedCareSummary(actor, childId),
    }),
    getAttendanceExceptions: tool({
      description: "Read unresolved attendance exceptions for one assigned location.",
      inputSchema: z.object({ locationId: z.string().uuid() }),
      execute: ({ locationId }) => dataSource.getAttendanceExceptions(actor, locationId),
    }),
    calculateInvoicePreview: tool({
      description: "Return a deterministic, versioned invoice preview. The model does no math.",
      inputSchema: z.object({ contractId: z.string().uuid() }),
      execute: ({ contractId }) => dataSource.calculateInvoicePreview(actor, contractId),
    }),
    getCentrePolicyExcerpt: tool({
      description: "Read a cited excerpt from an approved centre policy.",
      inputSchema: z.object({ policyId: z.string().uuid() }),
      execute: ({ policyId }) => dataSource.getCentrePolicyExcerpt(actor, policyId),
    }),
    draftParentUpdate: proposalTool("parent_update", dataSource, actor),
    summarizeDailyNotes: proposalTool("daily_note_summary", dataSource, actor),
    proposeScheduleChange: proposalTool("schedule_change", dataSource, actor),
    draftIncidentSummary: proposalTool("incident_summary", dataSource, actor),
    draftInvoiceExplanation: proposalTool("invoice_explanation", dataSource, actor),
    proposeAttendanceCorrection: proposalTool("attendance_correction", dataSource, actor),
  };
}

function proposalTool(
  kind: CareCopilotProposal["kind"],
  dataSource: CareCopilotDataSource,
  actor: AuthorizedActor,
) {
  return tool({
    description:
      "Create a typed review proposal only. This tool cannot send, publish, issue, approve, or mutate records.",
    inputSchema: scopedId.extend({
      instruction: z.string().trim().min(1).max(500),
    }),
    outputSchema: careCopilotProposalSchema,
    execute: ({ id, instruction }) =>
      dataSource.draftProposal(actor, { kind, recordId: id, instruction }),
  });
}
