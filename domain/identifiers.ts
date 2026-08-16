export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type OrganizationId = Brand<string, "OrganizationId">;
export type LocationId = Brand<string, "LocationId">;
export type ChildId = Brand<string, "ChildId">;
export type GuardianId = Brand<string, "GuardianId">;
export type AttendanceSessionId = Brand<string, "AttendanceSessionId">;
export type InvoiceId = Brand<string, "InvoiceId">;

export function asOrganizationId(value: string): OrganizationId {
  return value as OrganizationId;
}

export function asLocationId(value: string): LocationId {
  return value as LocationId;
}

export function asChildId(value: string): ChildId {
  return value as ChildId;
}
