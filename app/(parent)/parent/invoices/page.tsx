import { Download, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { formatMoney, money } from "@/domain/money/money";
import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoInvoices } from "@/lib/demo/data";

const invoice = demoInvoices[0];

export default function ParentInvoicesPage() {
  if (!invoice) return null;
  return (
    <>
      <PageHeader
        eyebrow="Family invoices"
        title="Invoices"
        description="Immutable issued records for the active synthetic family relationship."
      />
      <section className="panel">
        <div className="list-row">
          <span className="child-avatar">
            <LockKeyhole size={18} />
          </span>
          <span className="list-row-main">
            <strong>{invoice.number}</strong>
            <span>
              {invoice.period} / {invoice.calculationVersion}
            </span>
          </span>
          <strong>{formatMoney(money(invoice.amountMinor, "CAD"))}</strong>
          <StatusPill tone="positive">{invoice.status}</StatusPill>
          <Link className="button-secondary" href={`/api/invoices/${invoice.id}/pdf`}>
            <Download size={16} /> PDF
          </Link>
        </div>
      </section>
      <div style={{ height: 16 }} />
      <Callout title="No live payment state">
        The demo provides no checkout button and does not represent manual synthetic status as a
        provider-confirmed payment.
      </Callout>
    </>
  );
}
