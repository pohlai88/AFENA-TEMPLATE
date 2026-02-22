import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { BudgetVarianceResult } from '../calculators/budget-variance';
import { computeBudgetVariance } from '../calculators/budget-variance';
import type { ReforecastMethod, ReforecastResult } from '../calculators/reforecast';
import { reforecast } from '../calculators/reforecast';
import { buildBudgetCommitIntent } from '../commands/budget-intent';
import { getBudget } from '../queries/budget-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getBudgetVariance(
  _db: DbSession,
  _ctx: DomainContext,
  input: { budgetMinor: number; actualMinor: number; onTargetThreshold?: number },
): Promise<DomainResult<BudgetVarianceResult>> {
  const calc = computeBudgetVariance(input.budgetMinor, input.actualMinor, input.onTargetThreshold);
  return { kind: 'read', data: calc.result };
}

export async function getReforecast(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    ytdActualMinor: number;
    ytdBudgetMinor: number;
    elapsedPeriods: number;
    totalPeriods: number;
    method: ReforecastMethod;
  },
): Promise<DomainResult<ReforecastResult>> {
  const calc = reforecast(
    input.ytdActualMinor,
    input.ytdBudgetMinor,
    input.elapsedPeriods,
    input.totalPeriods,
    input.method,
  );
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Load budget from DB, compute variance against actuals, and emit
 * a `budget.commit` intent for the period.
 */
export async function commitBudgetPeriod(
  db: DbSession,
  ctx: DomainContext,
  input: { budgetId: string; periodKey: string; accountId: string; actualMinor: number },
): Promise<DomainResult<BudgetVarianceResult>> {
  const budget = await getBudget(db, ctx, input.budgetId);
  const calc = computeBudgetVariance(budget.amountMinor, input.actualMinor);

  const intent = buildBudgetCommitIntent(
    {
      budgetVersionId: budget.budgetId,
      periodKey: input.periodKey,
      accountId: input.accountId,
      amountMinor: budget.amountMinor,
    },
    stableCanonicalJson({
      type: 'budget.commit',
      budgetId: budget.budgetId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}
