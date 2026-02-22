import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { ExpenseClaim, ExpensePolicy, PolicyCheckResult } from '../calculators/expense-policy';
import { validateExpense } from '../calculators/expense-policy';
import type { ApprovedClaim, FxRate, ReimbursementResult } from '../calculators/reimbursement';
import { computeReimbursement } from '../calculators/reimbursement';
import { buildExpenseReimburseIntent } from '../commands/expense-intent';
import { getExpenseClaim } from '../queries/expense-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function validateExpenseClaim(
  _db: DbSession,
  _ctx: DomainContext,
  input: { expense: ExpenseClaim; policy: ExpensePolicy },
): Promise<DomainResult<PolicyCheckResult>> {
  const calc = validateExpense(input.expense, input.policy);
  return { kind: 'read', data: calc.result };
}

export async function getReimbursement(
  _db: DbSession,
  _ctx: DomainContext,
  input: { claims: ApprovedClaim[]; homeCurrency: string; fxRates: FxRate[] },
): Promise<DomainResult<ReimbursementResult>> {
  const calc = computeReimbursement(input.claims, input.homeCurrency, input.fxRates);
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Load an expense claim from DB, compute reimbursement, and emit
 * an `expense.reimburse` intent.
 */
export async function reimburseExpenseClaim(
  db: DbSession,
  ctx: DomainContext,
  input: { claimId: string; homeCurrency: string; fxRates: FxRate[]; effectiveAt: string },
): Promise<DomainResult<ReimbursementResult>> {
  const claim = await getExpenseClaim(db, ctx, input.claimId);

  const approved: ApprovedClaim = {
    claimId: claim.claimId,
    amountMinor: claim.amountMinor,
    currency: claim.currency,
  };

  const calc = computeReimbursement([approved], input.homeCurrency, input.fxRates);

  const intent = buildExpenseReimburseIntent(
    {
      expenseReportId: claim.claimId,
      employeeId: claim.employeeId,
      effectiveAt: input.effectiveAt,
      amountMinor: calc.result.totalMinor,
      currency: calc.result.currency,
    },
    stableCanonicalJson({ type: 'expense.reimburse', claimId: claim.claimId }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}
