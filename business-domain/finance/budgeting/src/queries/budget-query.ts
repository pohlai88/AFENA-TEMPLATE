import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { budgets } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type BudgetReadModel = {
  budgetId: string;
  fiscalYear: number;
  department: string;
  amountMinor: number;
  currency: string;
  status: string;
};

export async function getBudget(
  db: DbSession,
  ctx: DomainContext,
  budgetId: string,
): Promise<BudgetReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        budgetId: budgets.id,
        fiscalYear: budgets.fiscalYear,
        department: budgets.department,
        amountMinor: budgets.totalAmountMinor,
        currency: budgets.currency,
        status: budgets.docStatus,
      })
      .from(budgets)
      .where(
        and(eq(budgets.orgId, ctx.orgId), eq(budgets.id, budgetId), eq(budgets.isDeleted, false)),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Budget not found: ${budgetId}`, { budgetId });
  }

  const r = rows[0]!;
  return {
    budgetId: r.budgetId,
    fiscalYear: r.fiscalYear,
    department: r.department ?? '',
    amountMinor: r.amountMinor ?? 0,
    currency: r.currency,
    status: r.status,
  };
}
