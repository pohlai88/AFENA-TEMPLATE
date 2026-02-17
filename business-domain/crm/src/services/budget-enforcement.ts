import { and, eq, budgets, budgetCommitments, sql } from 'afenda-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Budget check result.
 */
export interface BudgetCheckResult {
  budgetId: string;
  budgetAmountMinor: number;
  committedAmountMinor: number;
  actualAmountMinor: number;
  availableMinor: number;
  requestedMinor: number;
  enforcementMode: 'advisory' | 'hard_stop';
  allowed: boolean;
  warning?: string;
}

/**
 * Check if a spending request is within budget.
 *
 * PRD G0.18 + Phase E #22:
 * - Checks budget_amount - committed - actual >= requested
 * - enforcement_mode: 'advisory' (warn but allow) or 'hard_stop' (reject)
 * - Returns available amount and whether the request is allowed
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param params - Budget check parameters
 */
export async function checkBudget(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    companyId: string;
    fiscalPeriodId: string;
    accountId: string;
    costCenterId?: string;
    projectId?: string;
    requestedMinor: number;
  },
): Promise<BudgetCheckResult | null> {
  const {
    companyId,
    fiscalPeriodId,
    accountId,
    costCenterId,
    projectId,
    requestedMinor,
  } = params;

  // Find matching budget
  const conditions = [
    eq(budgets.orgId, orgId),
    eq(budgets.companyId, companyId),
    eq(budgets.fiscalPeriodId, fiscalPeriodId),
    eq(budgets.accountId, accountId),
    eq(budgets.isActive, true),
  ];

  if (costCenterId) {
    conditions.push(eq(budgets.costCenterId, costCenterId));
  } else {
    conditions.push(sql`${budgets.costCenterId} IS NULL`);
  }

  if (projectId) {
    conditions.push(eq(budgets.projectId, projectId));
  } else {
    conditions.push(sql`${budgets.projectId} IS NULL`);
  }

  const [budget] = await (db as any)
    .select({
      id: budgets.id,
      budgetAmountMinor: budgets.budgetAmountMinor,
      committedAmountMinor: budgets.committedAmountMinor,
      actualAmountMinor: budgets.actualAmountMinor,
      enforcementMode: budgets.enforcementMode,
    })
    .from(budgets)
    .where(and(...conditions));

  // No budget defined — no enforcement
  if (!budget) return null;

  const available =
    Number(budget.budgetAmountMinor) -
    Number(budget.committedAmountMinor) -
    Number(budget.actualAmountMinor);

  const allowed =
    budget.enforcementMode === 'advisory' || requestedMinor <= available;

  const warning =
    requestedMinor > available
      ? `Requested ${requestedMinor} exceeds available budget ${available} (mode: ${budget.enforcementMode})`
      : undefined;

  return {
    budgetId: budget.id,
    budgetAmountMinor: Number(budget.budgetAmountMinor),
    committedAmountMinor: Number(budget.committedAmountMinor),
    actualAmountMinor: Number(budget.actualAmountMinor),
    availableMinor: available,
    requestedMinor,
    enforcementMode: budget.enforcementMode as 'advisory' | 'hard_stop',
    allowed,
    warning,
  };
}

/**
 * Record a budget commitment.
 *
 * PRD G0.18 + Phase E #22:
 * - Creates a commitment record (e.g., PO approval reserves budget)
 * - Updates budget.committed_amount_minor
 * - Returns commitment ID
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param params - Commitment parameters
 */
export async function commitBudget(
  tx: NeonHttpDatabase,
  orgId: string,
  params: {
    budgetId: string;
    amountMinor: number;
    sourceDocType: string;
    sourceDocId: string;
    memo?: string;
  },
): Promise<string> {
  const { budgetId, amountMinor, sourceDocType, sourceDocId, memo } = params;

  // Insert commitment
  const [commitment] = await (tx as any)
    .insert(budgetCommitments)
    .values({
      orgId,
      budgetId,
      amountMinor,
      sourceDocType,
      sourceDocId,
      memo: memo ?? null,
      status: 'active',
    })
    .returning({ id: budgetCommitments.id });

  // Update budget committed_amount_minor
  await (tx as any)
    .update(budgets)
    .set({
      committedAmountMinor: sql`${budgets.committedAmountMinor} + ${amountMinor}`,
    })
    .where(eq(budgets.id, budgetId));

  return commitment.id;
}

/**
 * Release a budget commitment.
 *
 * PRD G0.18 + Phase E #22:
 * - Marks commitment as released
 * - Decrements budget.committed_amount_minor
 * - Optionally records actual spend
 *
 * @param tx - Transaction handle
 * @param commitmentId - Commitment ID to release
 * @param actualMinor - Actual amount spent (if different from committed)
 */
export async function releaseBudgetCommitment(
  tx: NeonHttpDatabase,
  commitmentId: string,
  actualMinor?: number,
): Promise<void> {
  // Get commitment details
  const [commitment] = await (tx as any)
    .select({
      budgetId: budgetCommitments.budgetId,
      amountMinor: budgetCommitments.amountMinor,
    })
    .from(budgetCommitments)
    .where(eq(budgetCommitments.id, commitmentId));

  if (!commitment) {
    throw new Error(`Budget commitment ${commitmentId} not found`);
  }

  // Mark as released
  await (tx as any)
    .update(budgetCommitments)
    .set({ status: 'released' })
    .where(eq(budgetCommitments.id, commitmentId));

  // Decrement committed amount
  await (tx as any)
    .update(budgets)
    .set({
      committedAmountMinor: sql`${budgets.committedAmountMinor} - ${commitment.amountMinor}`,
    })
    .where(eq(budgets.id, commitment.budgetId));

  // If actual amount provided, update actual_amount_minor
  if (actualMinor !== undefined) {
    await (tx as any)
      .update(budgets)
      .set({
        actualAmountMinor: sql`${budgets.actualAmountMinor} + ${actualMinor}`,
      })
      .where(eq(budgets.id, commitment.budgetId));
  }
}
