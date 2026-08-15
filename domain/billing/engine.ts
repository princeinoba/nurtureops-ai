import { formatMoney, money, roundHalfUp, type Currency } from "@/domain/money/money";
import { durationMinutes, localDateKey } from "@/domain/time/time";

export const BILLING_CALCULATION_VERSION = "nurtureops-billing-v1";

export type AttendanceInterval = Readonly<{
  id: string;
  checkInAt: string;
  checkOutAt: string;
  lateMinutes?: number;
}>;

export type RatePlan = Readonly<{
  type: "hourly" | "fixed_daily";
  currency: Currency;
  hourlyRateMinor?: bigint;
  fixedDailyRateMinor?: bigint;
  dailyCapMinor?: bigint;
  graceMinutes: number;
  latePickupRateMinorPerMinute: bigint;
}>;

export type BillingAdjustment = Readonly<{
  id: string;
  label: string;
  amountMinor: bigint;
}>;

export type BillingInput = Readonly<{
  timezone: string;
  period: Readonly<{ start: string; end: string }>;
  attendance: readonly AttendanceInterval[];
  ratePlan: RatePlan;
  subsidies: readonly BillingAdjustment[];
  credits: readonly BillingAdjustment[];
}>;

export type InvoiceLineDraft = Readonly<{
  sourceId: string;
  serviceDate: string;
  description: string;
  quantityMinutes: number;
  amountMinor: bigint;
}>;

export type BillingResult = Readonly<{
  calculationVersion: typeof BILLING_CALCULATION_VERSION;
  currency: Currency;
  lines: readonly InvoiceLineDraft[];
  subtotalMinor: bigint;
  subsidiesMinor: bigint;
  creditsMinor: bigint;
  totalMinor: bigint;
  explanation: readonly string[];
}>;

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative safe integer.`);
  }
}

function validateRatePlan(ratePlan: RatePlan): void {
  assertNonNegativeInteger(ratePlan.graceMinutes, "Grace minutes");
  if (ratePlan.latePickupRateMinorPerMinute < 0n) {
    throw new RangeError("Late pickup rate cannot be negative.");
  }
  if (ratePlan.type === "hourly" && ratePlan.hourlyRateMinor === undefined) {
    throw new RangeError("Hourly plans require an hourly rate.");
  }
  if (ratePlan.type === "fixed_daily" && ratePlan.fixedDailyRateMinor === undefined) {
    throw new RangeError("Fixed daily plans require a daily rate.");
  }
}

function sumAdjustments(adjustments: readonly BillingAdjustment[]): bigint {
  return adjustments.reduce((sum, adjustment) => {
    if (adjustment.amountMinor < 0n) throw new RangeError("Adjustments cannot be negative.");
    return sum + adjustment.amountMinor;
  }, 0n);
}

export function calculateBilling(input: BillingInput): BillingResult {
  validateRatePlan(input.ratePlan);
  const periodStart = new Date(input.period.start);
  const periodEnd = new Date(input.period.end);
  if (
    Number.isNaN(periodStart.valueOf()) ||
    Number.isNaN(periodEnd.valueOf()) ||
    periodEnd < periodStart
  ) {
    throw new RangeError("Billing period is invalid.");
  }

  const byDay = new Map<string, AttendanceInterval[]>();
  for (const interval of input.attendance) {
    const checkIn = new Date(interval.checkInAt);
    const checkOut = new Date(interval.checkOutAt);
    if (checkIn < periodStart || checkOut > periodEnd) {
      throw new RangeError("Attendance falls outside the billing period.");
    }
    const day = localDateKey(interval.checkInAt, input.timezone);
    const entries = byDay.get(day) ?? [];
    entries.push(interval);
    byDay.set(day, entries);
  }

  const lines: InvoiceLineDraft[] = [];
  const explanation: string[] = [];

  for (const [serviceDate, intervals] of [...byDay.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const sorted = [...intervals].sort(
      (left, right) => new Date(left.checkInAt).valueOf() - new Date(right.checkInAt).valueOf(),
    );
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      if (previous && current && new Date(current.checkInAt) < new Date(previous.checkOutAt)) {
        throw new RangeError(`Overlapping attendance on ${serviceDate} requires review.`);
      }
    }

    const attendedMinutes = sorted.reduce(
      (sum, interval) => sum + durationMinutes(interval.checkInAt, interval.checkOutAt),
      0,
    );
    const billableMinutes = Math.max(0, attendedMinutes - input.ratePlan.graceMinutes);
    const lateMinutes = sorted.reduce((sum, interval) => {
      const value = interval.lateMinutes ?? 0;
      assertNonNegativeInteger(value, "Late minutes");
      return sum + value;
    }, 0);

    let baseMinor: bigint;
    if (input.ratePlan.type === "hourly") {
      baseMinor = roundHalfUp(
        (input.ratePlan.hourlyRateMinor ?? 0n) * BigInt(billableMinutes),
        60n,
      );
      if (input.ratePlan.dailyCapMinor !== undefined && baseMinor > input.ratePlan.dailyCapMinor) {
        baseMinor = input.ratePlan.dailyCapMinor;
        explanation.push(`${serviceDate}: the configured daily cap was applied.`);
      }
    } else {
      baseMinor = attendedMinutes > 0 ? (input.ratePlan.fixedDailyRateMinor ?? 0n) : 0n;
    }

    const lateMinor = input.ratePlan.latePickupRateMinorPerMinute * BigInt(lateMinutes);
    const amountMinor = baseMinor + lateMinor;
    lines.push({
      sourceId: sorted.map((interval) => interval.id).join(","),
      serviceDate,
      description:
        lateMinutes > 0
          ? `Childcare attendance plus ${lateMinutes} late pickup minute(s)`
          : "Childcare attendance",
      quantityMinutes: attendedMinutes,
      amountMinor,
    });
    explanation.push(
      `${serviceDate}: ${attendedMinutes} attended minute(s), ${billableMinutes} base billable minute(s), ${formatMoney(money(amountMinor, input.ratePlan.currency))}.`,
    );
  }

  const subtotalMinor = lines.reduce((sum, line) => sum + line.amountMinor, 0n);
  const subsidiesMinor = sumAdjustments(input.subsidies);
  const creditsMinor = sumAdjustments(input.credits);
  const totalMinor = [subtotalMinor - subsidiesMinor - creditsMinor, 0n].reduce((max, value) =>
    value > max ? value : max,
  );

  return {
    calculationVersion: BILLING_CALCULATION_VERSION,
    currency: input.ratePlan.currency,
    lines,
    subtotalMinor,
    subsidiesMinor,
    creditsMinor,
    totalMinor,
    explanation,
  };
}
