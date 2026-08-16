export const ROLES = [
  "organization_owner",
  "director",
  "staff",
  "billing_manager",
  "guardian",
  "auditor",
] as const;

export type Role = (typeof ROLES)[number];
export type Resource =
  | "organization"
  | "child_directory"
  | "care_entries"
  | "incident_restricted"
  | "attendance"
  | "billing"
  | "audit"
  | "roles"
  | "exports";
export type Action = "read" | "create" | "update" | "approve" | "export" | "delete";

export type AuthorizationContext = Readonly<{
  roles: readonly Role[];
  sameOrganization: boolean;
  assignedLocation?: boolean;
  activeGuardianRelationship?: boolean;
  recentAuthentication?: boolean;
}>;

const roleCapabilities: Record<Role, readonly `${Resource}:${Action}`[]> = {
  organization_owner: [
    "organization:read",
    "organization:update",
    "child_directory:read",
    "child_directory:create",
    "child_directory:update",
    "attendance:read",
    "attendance:update",
    "care_entries:read",
    "incident_restricted:read",
    "billing:read",
    "billing:create",
    "billing:update",
    "audit:read",
    "roles:read",
    "roles:update",
    "exports:export",
  ],
  director: [
    "organization:read",
    "child_directory:read",
    "child_directory:create",
    "child_directory:update",
    "attendance:read",
    "attendance:create",
    "attendance:update",
    "care_entries:read",
    "care_entries:approve",
    "incident_restricted:read",
    "incident_restricted:approve",
    "billing:read",
    "billing:create",
    "billing:update",
    "audit:read",
    "roles:read",
    "exports:export",
  ],
  staff: [
    "child_directory:read",
    "attendance:read",
    "attendance:create",
    "attendance:update",
    "care_entries:read",
    "care_entries:create",
    "care_entries:update",
  ],
  billing_manager: [
    "child_directory:read",
    "attendance:read",
    "billing:read",
    "billing:create",
    "billing:update",
    "exports:export",
  ],
  guardian: ["child_directory:read", "attendance:read", "care_entries:read", "billing:read"],
  auditor: ["organization:read", "attendance:read", "audit:read", "billing:read"],
};

export function isAuthorized(
  context: AuthorizationContext,
  resource: Resource,
  action: Action,
): boolean {
  if (!context.sameOrganization) return false;
  const capability = `${resource}:${action}` as const;
  if (!context.roles.some((role) => roleCapabilities[role].includes(capability))) return false;
  if (context.roles.includes("guardian") && !context.activeGuardianRelationship) return false;
  if (context.roles.includes("staff") && !context.assignedLocation) return false;
  if (
    (resource === "roles" || resource === "exports") &&
    (action === "update" || action === "export") &&
    !context.recentAuthentication
  ) {
    return false;
  }
  return true;
}
