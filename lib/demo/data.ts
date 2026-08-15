import { asChildId, asLocationId, asOrganizationId, type ChildId } from "@/domain/identifiers";

export const demoOrganization = {
  id: asOrganizationId("11111111-1111-4111-8111-111111111111"),
  name: "Harbour Sprouts Childcare",
  timezone: "America/Toronto",
  currency: "CAD" as const,
  location: {
    id: asLocationId("22222222-2222-4222-8222-222222222222"),
    name: "Lakeshore Centre",
  },
};

export type DemoChild = Readonly<{
  id: ChildId;
  initials: string;
  displayName: string;
  ageGroup: string;
  room: string;
  status: "present" | "expected" | "checked_out";
  guardianNames: readonly string[];
  pickupStatus: "authorized" | "review";
  lastEvent: string;
}>;

export const demoChildren: readonly DemoChild[] = [
  {
    id: asChildId("33333333-3333-4333-8333-333333333331"),
    initials: "MC",
    displayName: "Maya Chen",
    ageGroup: "Preschool",
    room: "Willow Room",
    status: "present",
    guardianNames: ["Avery Chen", "Morgan Chen"],
    pickupStatus: "authorized",
    lastEvent: "Morning snack recorded at 9:42 AM",
  },
  {
    id: asChildId("33333333-3333-4333-8333-333333333332"),
    initials: "LE",
    displayName: "Leo Evans",
    ageGroup: "Toddler",
    room: "Cedar Room",
    status: "expected",
    guardianNames: ["Jordan Evans"],
    pickupStatus: "authorized",
    lastEvent: "Expected at 10:00 AM",
  },
  {
    id: asChildId("33333333-3333-4333-8333-333333333333"),
    initials: "SN",
    displayName: "Sofia Novak",
    ageGroup: "Preschool",
    room: "Willow Room",
    status: "checked_out",
    guardianNames: ["Taylor Novak"],
    pickupStatus: "review",
    lastEvent: "Checked out at 12:08 PM",
  },
  {
    id: asChildId("33333333-3333-4333-8333-333333333334"),
    initials: "OP",
    displayName: "Owen Patel",
    ageGroup: "School age",
    room: "Maple Room",
    status: "present",
    guardianNames: ["Riley Patel", "Sam Patel"],
    pickupStatus: "authorized",
    lastEvent: "Activity recorded at 11:15 AM",
  },
];

export const demoRooms = [
  {
    id: "44444444-4444-4444-8444-444444444441",
    name: "Willow Room",
    present: 7,
    expected: 8,
    staff: 2,
    requiredStaff: 2,
    capacity: 12,
    status: "within configured policy",
  },
  {
    id: "44444444-4444-4444-8444-444444444442",
    name: "Cedar Room",
    present: 4,
    expected: 6,
    staff: 2,
    requiredStaff: 2,
    capacity: 10,
    status: "within configured policy",
  },
  {
    id: "44444444-4444-4444-8444-444444444443",
    name: "Maple Room",
    present: 5,
    expected: 7,
    staff: 1,
    requiredStaff: 2,
    capacity: 14,
    status: "review staffing",
  },
] as const;

export const demoInvoices = [
  {
    id: "55555555-5555-4555-8555-555555555551",
    number: "DEMO-2026-0042",
    family: "Chen family",
    period: "Aug 3-Aug 9, 2026",
    amountMinor: 84250n,
    status: "issued",
    calculationVersion: "nurtureops-billing-v1",
  },
  {
    id: "55555555-5555-4555-8555-555555555552",
    number: "DEMO-2026-0041",
    family: "Evans family",
    period: "Aug 3-Aug 9, 2026",
    amountMinor: 61500n,
    status: "draft",
    calculationVersion: "nurtureops-billing-v1",
  },
] as const;

export const demoCareTimeline = [
  { time: "8:12 AM", type: "arrival", detail: "Checked in to Willow Room", visible: true },
  { time: "9:42 AM", type: "meal", detail: "Morning snack - most eaten", visible: true },
  { time: "10:20 AM", type: "activity", detail: "Garden colour hunt", visible: true },
  { time: "12:06 PM", type: "meal", detail: "Lunch - some eaten", visible: true },
  { time: "1:02 PM", type: "nap", detail: "Nap started", visible: false },
] as const;

export function findDemoChild(childId: string): DemoChild | undefined {
  return demoChildren.find((child) => child.id === childId);
}

export function findDemoInvoice(invoiceId: string) {
  return demoInvoices.find((invoice) => invoice.id === invoiceId);
}
