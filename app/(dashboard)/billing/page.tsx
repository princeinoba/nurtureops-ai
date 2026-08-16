import { ArrowRight, FilePlus2, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { formatMoney, money } from "@/domain/money/money";
import { Callout, MetricCard, PageHeader, StatusPill } from "@/components/ui/primitives";
import { demoInvoices } from "@/lib/demo/data";

export default function BillingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Billing"
        title="Review before issue"
        description="Versioned minor-unit calculations, immutable issued lines and separate payment state."
        actions={
          <button className="button" type="button" disabled>
            <FilePlus2 size={17} /> Create draft
          </button>
        }
      />
      <section className="metric-grid">
        <MetricCard label="Draft total" value="$615.00" detail="one invoice awaiting review" />
        <MetricCard
          label="Issued"
          value="$842.50"
          detail="immutable invoice snapshot"
          tone="positive"
        />
        <MetricCard
          label="Outstanding"
          value="$842.50"
          detail="manual synthetic state"
          tone="attention"
        />
        <MetricCard label="Payment provider" value="Off" detail="no live processor" />
      </section>
      <Callout title="Financial correctness boundary">
        <LockKeyhole size={15} /> Authoritative amounts use BIGINT minor units. Issued invoices are
        never deleted or silently recalculated; corrections use void or credit-note workflows.
      </Callout>
      <div style={{ height: 16 }} />
      <section className="panel">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Family</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {demoInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.number}</strong>
                    <small>{invoice.calculationVersion}</small>
                  </td>
                  <td>{invoice.family}</td>
                  <td>{invoice.period}</td>
                  <td>{formatMoney(money(invoice.amountMinor, "CAD"))}</td>
                  <td>
                    <StatusPill tone={invoice.status === "issued" ? "positive" : "attention"}>
                      {invoice.status}
                    </StatusPill>
                  </td>
                  <td>
                    <Link className="text-button" href={`/billing/invoices/${invoice.id}`}>
                      Review <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
