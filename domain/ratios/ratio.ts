export type RatioPolicyVersion = Readonly<{
  id: string;
  label: string;
  maxChildrenPerStaff: number;
  roomCapacity: number;
  effectiveFrom: string;
  reviewedBy?: string;
}>;

export type RatioObservation = Readonly<{
  childrenPresent: number;
  qualifiedStaffPresent: number;
  requiredStaff: number;
  withinConfiguredRatio: boolean;
  withinConfiguredCapacity: boolean;
  explanation: string;
  policyVersionId: string;
}>;

export function observeRatio(
  childrenPresent: number,
  qualifiedStaffPresent: number,
  policy: RatioPolicyVersion,
): RatioObservation {
  for (const [label, value] of [
    ["childrenPresent", childrenPresent],
    ["qualifiedStaffPresent", qualifiedStaffPresent],
    ["maxChildrenPerStaff", policy.maxChildrenPerStaff],
    ["roomCapacity", policy.roomCapacity],
  ] as const) {
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${label} is invalid.`);
  }
  if (policy.maxChildrenPerStaff === 0) throw new RangeError("Configured ratio cannot be zero.");
  const requiredStaff = Math.ceil(childrenPresent / policy.maxChildrenPerStaff);
  const withinConfiguredRatio = qualifiedStaffPresent >= requiredStaff;
  const withinConfiguredCapacity = childrenPresent <= policy.roomCapacity;
  return {
    childrenPresent,
    qualifiedStaffPresent,
    requiredStaff,
    withinConfiguredRatio,
    withinConfiguredCapacity,
    explanation: `${childrenPresent} present / ${qualifiedStaffPresent} qualified staff; configured requirement is ${requiredStaff} staff under policy ${policy.label}. This is an operational aid, not a legal compliance certification.`,
    policyVersionId: policy.id,
  };
}
