import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { expenseReports } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type ExpenseClaimReadModel = {
  claimId: string;
  employeeId: string;
  amountMinor: number;
  currency: string;
  status: string;
  submittedDateIso: string;
};

export async function getExpenseClaim(
  db: DbSession,
  ctx: DomainContext,
  claimId: string,
): Promise<ExpenseClaimReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        claimId: expenseReports.id,
        employeeId: expenseReports.employeeId,
        amountMinor: expenseReports.totalAmountMinor,
        currency: expenseReports.currency,
        status: expenseReports.docStatus,
        submittedDateIso: expenseReports.reportDate,
      })
      .from(expenseReports)
      .where(
        and(
          eq(expenseReports.orgId, ctx.orgId),
          eq(expenseReports.id, claimId),
          eq(expenseReports.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Expense claim not found: ${claimId}`, { claimId });
  }

  const r = rows[0]!;
  return {
    claimId: r.claimId,
    employeeId: r.employeeId,
    amountMinor: r.amountMinor,
    currency: r.currency,
    status: r.status ?? 'draft',
    submittedDateIso: String(r.submittedDateIso),
  };
}
