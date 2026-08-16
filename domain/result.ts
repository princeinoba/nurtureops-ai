export type DomainErrorCode =
  | "AUTHORIZATION_DENIED"
  | "CONFLICT"
  | "DUPLICATE"
  | "INVALID_INPUT"
  | "INVALID_TRANSITION"
  | "NOT_FOUND"
  | "STALE_VERSION";

export type DomainError = Readonly<{
  code: DomainErrorCode;
  message: string;
  requestId?: string;
}>;

export type Result<T> =
  Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: DomainError }>;

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const err = (code: DomainErrorCode, message: string): Result<never> => ({
  ok: false,
  error: { code, message },
});
