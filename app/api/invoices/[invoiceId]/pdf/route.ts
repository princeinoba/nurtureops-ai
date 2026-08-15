import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { formatMoney, money } from "@/domain/money/money";
import { findDemoInvoice } from "@/lib/demo/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;
  const invoice = findDemoInvoice(invoiceId);
  if (!invoice) return Response.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const document = await PDFDocument.create();
  const page = document.addPage([612, 792]);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  page.drawText("NurtureOps AI - SYNTHETIC DEMO INVOICE", {
    x: 54,
    y: 728,
    size: 14,
    font: bold,
    color: rgb(0.09, 0.36, 0.27),
  });
  page.drawText(invoice.number, { x: 54, y: 682, size: 26, font: bold });
  page.drawText(`${invoice.family} / ${invoice.period}`, {
    x: 54,
    y: 654,
    size: 11,
    font: regular,
  });
  page.drawText("Childcare attendance", { x: 54, y: 590, size: 12, font: regular });
  page.drawText(formatMoney(money(invoice.amountMinor, "CAD")), {
    x: 450,
    y: 590,
    size: 12,
    font: bold,
  });
  page.drawText("No live payment processor. No real family or banking data.", {
    x: 54,
    y: 90,
    size: 10,
    font: regular,
    color: rgb(0.36, 0.42, 0.39),
  });
  const bytes = await document.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${invoice.number}.pdf"`,
      "cache-control": "private, no-store",
    },
  });
}
