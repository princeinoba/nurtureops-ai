import { transitionInvoice, issuedInvoiceIsImmutable } from "@/domain/billing/invoice-state";
import { isAuthorized } from "@/domain/permissions/permissions";
import { observeRatio } from "@/domain/ratios/ratio";
import { durationMinutes, localDateKey } from "@/domain/time/time";
import {
  careCopilotProposalSchema,
  proposalApprovalSchema,
  validateAiFieldManifest,
} from "@/features/ai/schemas";

describe("policy boundaries", () => {
  it("enforces invoice transitions and issued immutability", () => {
    expect(transitionInvoice("draft", "issue")).toEqual({ ok: true, value: "issued" });
    expect(transitionInvoice("issued", "issue")).toMatchObject({
      ok: false,
      error: { code: "INVALID_TRANSITION" },
    });
    expect(issuedInvoiceIsImmutable("issued")).toBe(true);
  });

  it("requires tenant scope, relationships, assignments, and recent auth", () => {
    expect(
      isAuthorized(
        { roles: ["guardian"], sameOrganization: true, activeGuardianRelationship: true },
        "billing",
        "read",
      ),
    ).toBe(true);
    expect(isAuthorized({ roles: ["guardian"], sameOrganization: true }, "billing", "read")).toBe(
      false,
    );
    expect(
      isAuthorized(
        { roles: ["director"], sameOrganization: true, assignedLocation: true },
        "exports",
        "export",
      ),
    ).toBe(false);
    expect(
      isAuthorized(
        {
          roles: ["director"],
          sameOrganization: true,
          assignedLocation: true,
          recentAuthentication: true,
        },
        "exports",
        "export",
      ),
    ).toBe(true);
  });

  it("reports configured ratios without claiming legal compliance", () => {
    const observation = observeRatio(9, 1, {
      id: "ratio-v1",
      label: "Synthetic reviewed policy",
      maxChildrenPerStaff: 8,
      roomCapacity: 12,
      effectiveFrom: "2026-08-01",
      reviewedBy: "owner",
    });
    expect(observation.requiredStaff).toBe(2);
    expect(observation.withinConfiguredRatio).toBe(false);
    expect(observation.explanation).toContain("not a legal compliance certification");
  });

  it("calculates real elapsed minutes and local dates across DST", () => {
    expect(durationMinutes("2026-03-08T06:30:00.000Z", "2026-03-08T07:30:00.000Z")).toBe(60);
    expect(localDateKey("2026-03-08T04:30:00.000Z", "America/Toronto")).toBe("2026-03-07");
  });
});

describe("Care Copilot contracts", () => {
  it("blocks sensitive field manifests", () => {
    expect(validateAiFieldManifest(["structured_event_type", "allergies"])).toEqual({
      allowed: false,
      blocked: ["allergies"],
    });
  });

  it("requires non-mutating, evidenced proposals and explicit approval", () => {
    const proposal = careCopilotProposalSchema.parse({
      proposalId: "proposal-123",
      kind: "parent_update",
      title: "Synthetic update",
      summary: "A neutral structured observation for review.",
      evidence: [{ sourceType: "care_event", sourceId: "event-1", label: "Structured activity" }],
      warnings: ["Human review required."],
      inputFieldManifest: ["structured_event_type"],
      expectedRecordVersion: 3,
      canMutate: false,
    });
    expect(proposal.canMutate).toBe(false);
    expect(() => careCopilotProposalSchema.parse({ ...proposal, canMutate: true })).toThrow();
    expect(
      proposalApprovalSchema.safeParse({
        proposalId: proposal.proposalId,
        expectedRecordVersion: 3,
        approvedBy: "77777777-7777-4777-8777-777777777777",
        approvedAt: "2026-08-14T16:00:00.000Z",
        editedSummary: proposal.summary,
        acknowledgement: false,
      }).success,
    ).toBe(false);
  });
});
