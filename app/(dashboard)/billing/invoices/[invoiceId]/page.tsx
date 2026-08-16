import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatMoney, money } from "@/domain/money/money";
import { Callout, PageHeader, StatusPill } from "@/components/ui/primitives";
import { findDemoInvoice } from "@/lib/demo/data";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const invoice = findDemoInvoice(invoiceId);
  if (!invoice) notFound();

  return (
    <>
      <Link className="text-button" href="/billing">
        <ArrowLeft size={15} /> Billing
      </Link>
      <PageHeader
        eyebrow={invoice.family}
        title={invoice.number}
        description={`${invoice.period} / deterministic ${invoice.calculationVersion}`}
        actions={
          <StatusPill tone={invoice.status === "issued" ? "positive" : "attention"}>
            {invoice.status}
          </StatusPill>
        }
      />
      <section className="detail-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Immutable line snapshot</h2>
              <p>Generated from reviewed synthetic attendance</p>
            </div>
            <Link className="button-secondary" href={`/api/invoices/${invoice.id}/pdf`}>
              <Download size={16} /> PDF
            </Link>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Childcare attendance - Aug 2-7</td>
                  <td>2,280 min</td>
                  <td>{formatMoney(money(invoice.amountMinor, "CAD"))}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td />
                  <td>
                    <strong>{formatMoney(money(invoice.amountMinor, "CAD"))}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        <aside className="stack">
          <Callout title="Payment adapter disabled">
            This is not a paid state and no payment processor has been contacted.
          </Callout>
          <Callout title="Server generated">
            <ShieldCheck size={15} /> The PDF endpoint renders approved immutable fields without
            browser bank credentials.
          </Callout>
        </aside>
      </section>
    </>
  );
}
