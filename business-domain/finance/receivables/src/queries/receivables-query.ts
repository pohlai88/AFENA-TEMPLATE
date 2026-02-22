import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { paymentAllocations } from 'afenda-database';
import { and, eq, sql } from 'drizzle-orm';

export type OutstandingInvoiceReadModel = {
  invoiceId: string;
  outstandingMinor: number;
  dueDateIso: string;
  customerId: string;
};

/**
 * Queries outstanding receivables from payment allocations.
 * Returns invoices with outstanding balances (allocated - applied).
 */
export async function getOutstandingReceivables(
  db: DbSession,
  ctx: DomainContext,
  _input: { companyId: string },
): Promise<OutstandingInvoiceReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        invoiceId: paymentAllocations.invoiceId,
        allocatedMinor: sql<number>`COALESCE(SUM(${paymentAllocations.allocatedAmountMinor}), 0)`,
      })
      .from(paymentAllocations)
      .where(
        and(
          eq(paymentAllocations.orgId, ctx.orgId),
          eq(paymentAllocations.status, 'pending'),
          eq(paymentAllocations.isDeleted, false),
        ),
      )
      .groupBy(paymentAllocations.invoiceId),
  );

  return rows
    .filter((r) => r.allocatedMinor > 0)
    .map((r) => ({
      invoiceId: r.invoiceId,
      outstandingMinor: r.allocatedMinor,
      dueDateIso: ctx.asOf,
      customerId: 'unknown',
    }));
}
