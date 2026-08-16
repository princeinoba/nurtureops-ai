import {
  canConsumeInvitation,
  createInvitation,
  hashInvitationToken,
  invitationTokenMatches,
} from "@/features/identity/invitations";

describe("invitation tokens", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stores only a hash and binds consumption to normalized email and expiry", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-15T12:00:00.000Z"));
    const invitation = createInvitation(" Director@Synthetic.Invalid ", 60);

    expect(invitation.token).not.toBe(invitation.record.tokenHash);
    expect(invitation.record.tokenHash).toBe(hashInvitationToken(invitation.token));
    expect(invitation.record.emailNormalized).toBe("director@synthetic.invalid");
    expect(
      canConsumeInvitation(
        invitation.record,
        invitation.token,
        "DIRECTOR@SYNTHETIC.INVALID",
        new Date("2026-08-15T12:59:00.000Z"),
      ),
    ).toBe(true);
    expect(
      canConsumeInvitation(
        invitation.record,
        invitation.token,
        "other@synthetic.invalid",
        new Date("2026-08-15T12:59:00.000Z"),
      ),
    ).toBe(false);
    expect(
      canConsumeInvitation(
        invitation.record,
        invitation.token,
        "director@synthetic.invalid",
        new Date("2026-08-15T13:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("uses constant-time-safe matching semantics and rejects consumed or revoked links", () => {
    const invitation = createInvitation("director@synthetic.invalid");
    expect(invitationTokenMatches(invitation.token, invitation.record.tokenHash)).toBe(true);
    expect(invitationTokenMatches("wrong-token", invitation.record.tokenHash)).toBe(false);
    expect(
      canConsumeInvitation(
        { ...invitation.record, consumedAt: new Date().toISOString() },
        invitation.token,
        invitation.record.emailNormalized,
      ),
    ).toBe(false);
    expect(
      canConsumeInvitation(
        { ...invitation.record, revokedAt: new Date().toISOString() },
        invitation.token,
        invitation.record.emailNormalized,
      ),
    ).toBe(false);
  });

  it("rejects unsafe invitation lifetimes", () => {
    expect(() => createInvitation("director@synthetic.invalid", 1)).toThrow(RangeError);
  });
});
