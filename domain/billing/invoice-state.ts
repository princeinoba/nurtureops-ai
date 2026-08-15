import { err, ok, type Result } from "@/domain/result";

export type InvoiceStatus = "draft" | "issued" | "paid" | "void" | "refunded" | "credited";
export type InvoiceAction = "issue" | "mark_paid" | "void" | "refund" | "credit";

const transitions: Record<InvoiceStatus, Partial<Record<InvoiceAction, InvoiceStatus>>> = {
  draft: { issue: "issued", void: "void" },
  issued: { mark_paid: "paid", void: "void", credit: "credited" },
  paid: { refund: "refunded", credit: "credited" },
  void: {},
  refunded: {},
  credited: {},
};

export function transitionInvoice(
  status: InvoiceStatus,
  action: InvoiceAction,
): Result<InvoiceStatus> {
  const next = transitions[status][action];
  return next
    ? ok(next)
    : err("INVALID_TRANSITION", `Cannot ${action} an invoice in ${status} state.`);
}

export function issuedInvoiceIsImmutable(status: InvoiceStatus): boolean {
  return status !== "draft";
}
