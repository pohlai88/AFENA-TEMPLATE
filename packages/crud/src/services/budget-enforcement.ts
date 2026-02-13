import { and, eq, budgets, budgetCommitments, sql } from 'afena-database';

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
 * Record a budget commitment (encumbrance) from a PO/PR/contract.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param budgetId - Budget UUID
 * @param params - Commitment parameters
 */
export async function commitBudget(
  tx: NeonHttpDatabase,
  orgId: string,
  budgetId: string,
  params: {
    sourceType: 'purchase_order' | 'purchase_request' | 'contract';
    sourceId: string;
    amountMinor: number;
    memo?: string;
  },
): Promise<{ commitmentId: string }> {
  const { sourceType, sourceId, amountMinor, memo } = params;

  // Insert commitment
  const [row] = await (tx as any)
    .insert(budgetCommitments)
    .values({
      orgId,
      budgetId,
      sourceType,
      sourceId,
      amountMinor,
      status: 'committed',
      memo,
    })
    .returning({ id: budgetCommitments.id });

  // Update budget committed total
  await (tx as any)
    .update(budgets)
    .set({
      committedAmountMinor: sql`${budgets.committedAmountMinor} + ${amountMinor}`,
    })
    .where(
      and(
        eq(budgets.orgId, orgId),
        eq(budgets.id, budgetId),
      ),
    );

  return { commitmentId: row.id };
}

/**
 * Release a budget commitment (e.g., when PO is cancelled or fulfilled).
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param commitmentId - Commitment UUID
 */
export async function releaseBudgetCommitment(
  tx: NeonHttpDatabase,
  orgId: string,
  commitmentId: string,
): Promise<void> {
  // Get commitment details
  const [commitment] = await (tx as any)
    .select({
      budgetId: budgetCommitments.budgetId,
      amountMinor: budgetCommitments.amountMinor,
      status: budgetCommitments.status,
    })
    .from(budgetCommitments)
    .where(
      and(
        eq(budgetCommitments.orgId, orgId),
        eq(budgetCommitments.id, commitmentId),
        eq(budgetCommitments.status, 'committed'),
      ),
    );

  if (!commitment) return;

  // Mark as released
  await (tx as any)
    .update(budgetCommitments)
    .set({ status: 'released' })
    .where(
      and(
        eq(budgetCommitments.orgId, orgId),
        eq(budgetCommitments.id, commitmentId),
      ),
    );

  // Reduce committed total
  await (tx as any)
    .update(budgets)
    .set({
      committedAmountMinor: sql`GREATEST(${budgets.committedAmountMinor} - ${Number(commitment.amountMinor)}, 0)`,
    })
    .where(
      and(
        eq(budgets.orgId, orgId),
        eq(budgets.id, commitment.budgetId),
      ),
    );
}
