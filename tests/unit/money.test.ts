import {
  addMoney,
  money,
  multiplyRatio,
  roundHalfUp,
  signedMoney,
  subtractMoney,
} from "@/domain/money/money";

describe("money", () => {
  it("uses integer minor units and deterministic half-up rounding", () => {
    expect(roundHalfUp(5n, 2n)).toBe(3n);
    expect(roundHalfUp(-5n, 2n)).toBe(-3n);
    expect(multiplyRatio(money(1_005n), 15n, 100n).amountMinor).toBe(151n);
  });

  it("adds and subtracts only matching currencies", () => {
    expect(addMoney(money(100n, "CAD"), money(25n, "CAD")).amountMinor).toBe(125n);
    expect(subtractMoney(money(100n), money(125n)).amountMinor).toBe(-25n);
    expect(() => addMoney(money(100n, "CAD"), money(100n, "USD"))).toThrow("Currency mismatch");
    expect(signedMoney(-10n).amountMinor).toBe(-10n);
  });

  it("rejects negative unsigned values", () => {
    expect(() => money(-1n)).toThrow(RangeError);
  });
});
