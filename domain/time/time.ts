const DATE_KEY_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  const existing = DATE_KEY_FORMATTERS.get(timeZone);
  if (existing) return existing;
  const created = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  DATE_KEY_FORMATTERS.set(timeZone, created);
  return created;
}

export function toUtcInstant(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new RangeError("Invalid ISO instant.");
  return parsed;
}

export function durationMinutes(startIso: string, endIso: string): number {
  const start = toUtcInstant(startIso).valueOf();
  const end = toUtcInstant(endIso).valueOf();
  if (end < start) throw new RangeError("End cannot precede start.");
  return Math.floor((end - start) / 60_000);
}

export function localDateKey(instantIso: string, timeZone: string): string {
  const parts = formatter(timeZone).formatToParts(toUtcInstant(instantIso));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}
