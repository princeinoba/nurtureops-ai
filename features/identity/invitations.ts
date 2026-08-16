import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export type InvitationRecord = Readonly<{
  tokenHash: string;
  emailNormalized: string;
  expiresAt: string;
  revokedAt?: string;
  consumedAt?: string;
}>;

export function createInvitation(
  email: string,
  ttlMinutes = 60,
): {
  token: string;
  record: InvitationRecord;
} {
  if (!Number.isSafeInteger(ttlMinutes) || ttlMinutes < 5 || ttlMinutes > 10_080) {
    throw new RangeError("Invitation lifetime is outside the allowed range.");
  }
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();
  return {
    token,
    record: {
      tokenHash: hashInvitationToken(token),
      emailNormalized: email.trim().toLowerCase(),
      expiresAt,
    },
  };
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function invitationTokenMatches(token: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashInvitationToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function canConsumeInvitation(
  record: InvitationRecord,
  token: string,
  email: string,
  now = new Date(),
): boolean {
  return (
    !record.revokedAt &&
    !record.consumedAt &&
    new Date(record.expiresAt) > now &&
    record.emailNormalized === email.trim().toLowerCase() &&
    invitationTokenMatches(token, record.tokenHash)
  );
}
