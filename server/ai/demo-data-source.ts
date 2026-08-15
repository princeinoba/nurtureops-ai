import "server-only";

import { randomUUID } from "node:crypto";

import type { CareCopilotProposal } from "@/features/ai/schemas";
import type { AuthorizedActor, CareCopilotDataSource } from "@/server/ai/tools";

function requireOrganization(actor: AuthorizedActor): void {
  if (!actor.organizationId) throw new Error("Authorization context is missing.");
}

export class SyntheticCareCopilotDataSource implements CareCopilotDataSource {
  async getDailyRoster(actor: AuthorizedActor, locationId: string): Promise<unknown> {
    requireOrganization(actor);
    if (!actor.locationIds.includes(locationId)) throw new Error("Authorization denied.");
    return { locationId, childrenExpected: 14, present: 11, fields: ["display_name", "room"] };
  }

  async getRoomRatioStatus(actor: AuthorizedActor, roomId: string): Promise<unknown> {
    requireOrganization(actor);
    return {
      roomId,
      childrenPresent: 7,
      qualifiedStaffPresent: 2,
      requiredStaff: 2,
      policyVersion: "DEMO-POLICY-2026-01",
      complianceClaim: false,
    };
  }

  async getChildAuthorizedCareSummary(actor: AuthorizedActor, childId: string): Promise<unknown> {
    requireOrganization(actor);
    return {
      childId,
      displayName: "Maya Chen",
      room: "Willow Room",
      excludedFields: ["allergies", "medication", "incidents", "safeguarding"],
    };
  }

  async getAttendanceExceptions(actor: AuthorizedActor, locationId: string): Promise<unknown> {
    requireOrganization(actor);
    if (!actor.locationIds.includes(locationId)) throw new Error("Authorization denied.");
    return [{ exceptionId: "demo-exception-01", type: "missing_checkout", status: "review" }];
  }

  async calculateInvoicePreview(actor: AuthorizedActor, contractId: string): Promise<unknown> {
    requireOrganization(actor);
    return {
      contractId,
      calculationVersion: "nurtureops-billing-v1",
      currency: "CAD",
      totalMinor: "84250",
      authoritativeSource: "deterministic_billing_engine",
    };
  }

  async getCentrePolicyExcerpt(actor: AuthorizedActor, policyId: string): Promise<unknown> {
    requireOrganization(actor);
    return {
      policyId,
      citation: "Synthetic Centre Handbook, demo section 4.2",
      excerpt: "Daily reports are reviewed by an educator before guardian publication.",
    };
  }

  async draftProposal(
    actor: AuthorizedActor,
    input: Readonly<{
      kind: CareCopilotProposal["kind"];
      recordId: string;
      instruction: string;
    }>,
  ): Promise<CareCopilotProposal> {
    requireOrganization(actor);
    return {
      proposalId: randomUUID(),
      kind: input.kind,
      title: "Review-ready synthetic proposal",
      summary: input.instruction,
      evidence: [
        {
          sourceType: input.kind === "invoice_explanation" ? "invoice" : "care_event",
          sourceId: input.recordId,
          label: "Authorized synthetic demonstration record",
        },
      ],
      warnings: [
        "No record has been changed.",
        "A deterministic server command must revalidate authorization and record version.",
      ],
      inputFieldManifest: ["record_id", "structured_event_type", "occurred_at"],
      expectedRecordVersion: 1,
      canMutate: false,
    };
  }
}
