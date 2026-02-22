import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { supplierInvoices } from 'afenda-database';
import { and, eq, lte } from 'drizzle-orm';

export type OpenInvoiceReadModel = {
  invoiceId: string;
  invoiceNo: string;
  supplierId: string;
  grossAmountMinor: number;
  paidAmountMinor: number;
  outstandingMinor: number;
  dueDate: string;
  currencyCode: string;
};

export async function getOpenSupplierInvoices(
  db: DbSession,
  ctx: DomainContext,
  input: { dueBefore?: string },
): Promise<OpenInvoiceReadModel[]> {
  const conditions = [
    eq(supplierInvoices.orgId, ctx.orgId),
    eq(supplierInvoices.companyId, ctx.companyId),
    eq(supplierInvoices.paymentStatus, 'unpaid'),
    eq(supplierInvoices.isDeleted, false),
  ];

  if (input.dueBefore) {
    conditions.push(lte(supplierInvoices.dueDate, input.dueBefore));
  }

  const rows = await db.read((tx) =>
    tx
      .select({
        invoiceId: supplierInvoices.id,
        invoiceNo: supplierInvoices.invoiceNo,
        supplierId: supplierInvoices.supplierId,
        grossAmountMinor: supplierInvoices.grossAmountMinor,
        paidAmountMinor: supplierInvoices.paidAmountMinor,
        dueDate: supplierInvoices.dueDate,
        currencyCode: supplierInvoices.currencyCode,
      })
      .from(supplierInvoices)
      .where(and(...conditions)),
  );

  return rows.map((r) => ({
    ...r,
    dueDate: String(r.dueDate),
    outstandingMinor: r.grossAmountMinor - r.paidAmountMinor,
  }));
}
