import { BILLING_CALCULATION_VERSION, calculateBilling } from "@/domain/billing/engine";

const baseInput = {
  timezone: "America/Toronto",
  period: {
    start: "2026-08-03T00:00:00.000Z",
    end: "2026-08-10T00:00:00.000Z",
  },
  attendance: [
    {
      id: "attendance-1",
      checkInAt: "2026-08-04T12:00:00.000Z",
      checkOutAt: "2026-08-04T14:00:00.000Z",
      lateMinutes: 5,
    },
  ],
  ratePlan: {
    type: "hourly" as const,
    currency: "CAD" as const,
    hourlyRateMinor: 1_500n,
    dailyCapMinor: 2_500n,
    graceMinutes: 15,
    latePickupRateMinorPerMinute: 100n,
  },
  subsidies: [{ id: "subsidy-1", label: "Synthetic subsidy", amountMinor: 500n }],
  credits: [{ id: "credit-1", label: "Synthetic credit", amountMinor: 250n }],
};

describe("billing engine", () => {
  it("applies grace, cap, late fees, adjustments, and a calculation version", () => {
    const result = calculateBilling(baseInput);
    expect(result.calculationVersion).toBe(BILLING_CALCULATION_VERSION);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]).toMatchObject({
      serviceDate: "2026-08-04",
      quantityMinutes: 120,
      amountMinor: 3_000n,
    });
    expect(result.subtotalMinor).toBe(3_000n);
    expect(result.totalMinor).toBe(2_250n);
    expect(result.explanation.join(" ")).toContain("daily cap");
  });

  it("never produces a negative invoice total", () => {
    const result = calculateBilling({
      ...baseInput,
      subsidies: [{ id: "large", label: "Synthetic subsidy", amountMinor: 99_999n }],
      credits: [],
    });
    expect(result.totalMinor).toBe(0n);
  });

  it("rejects overlapping attendance before calculation", () => {
    expect(() =>
      calculateBilling({
        ...baseInput,
        attendance: [
          ...baseInput.attendance,
          {
            id: "attendance-2",
            checkInAt: "2026-08-04T13:00:00.000Z",
            checkOutAt: "2026-08-04T15:00:00.000Z",
          },
        ],
      }),
    ).toThrow("Overlapping attendance");
  });

  it("supports fixed daily plans without floating point arithmetic", () => {
    const result = calculateBilling({
      ...baseInput,
      ratePlan: {
        type: "fixed_daily",
        currency: "CAD",
        fixedDailyRateMinor: 8_250n,
        graceMinutes: 0,
        latePickupRateMinorPerMinute: 0n,
      },
      subsidies: [],
      credits: [],
    });
    expect(result.totalMinor).toBe(8_250n);
  });
});
