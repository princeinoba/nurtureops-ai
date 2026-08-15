export const SUPPORTED_CURRENCIES = ["CAD", "USD", "GBP"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export type Money = Readonly<{
  amountMinor: bigint;
  currency: Currency;
}>;

export function money(amountMinor: bigint, currency: Currency = "CAD"): Money {
  if (amountMinor < 0n) {
    throw new RangeError("Money cannot be negative in this domain value.");
  }
  return { amountMinor, currency };
}

export function signedMoney(amountMinor: bigint, currency: Currency = "CAD"): Money {
  return { amountMinor, currency };
}

function assertSameCurrency(left: Money, right: Money): void {
  if (left.currency !== right.currency) {
    throw new RangeError("Currency mismatch.");
  }
}

export function addMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return signedMoney(left.amountMinor + right.amountMinor, left.currency);
}

export function subtractMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return signedMoney(left.amountMinor - right.amountMinor, left.currency);
}

export function minMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return left.amountMinor <= right.amountMinor ? left : right;
}

export function roundHalfUp(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new RangeError("Denominator must be positive.");
  if (numerator < 0n) return -roundHalfUp(-numerator, denominator);
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  return remainder * 2n >= denominator ? quotient + 1n : quotient;
}

export function multiplyRatio(value: Money, numerator: bigint, denominator: bigint): Money {
  return signedMoney(roundHalfUp(value.amountMinor * numerator, denominator), value.currency);
}

export function formatMoney(value: Money, locale = "en-CA"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: value.currency,
  }).format(Number(value.amountMinor) / 100);
}
