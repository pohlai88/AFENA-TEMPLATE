import type { CalculatorResult } from 'afenda-canon';

export type ExpenseClaim = {
  categoryCode: string;
  amountMinor: number;
  currency: string;
  dateIso: string;
  receiptAttached: boolean;
};

export type ExpensePolicy = {
  maxAmountMinor: number;
  requiresReceipt: boolean;
  allowedCategories: string[];
};

export type PolicyCheckResult = { compliant: boolean; violations: string[] };

export function validateExpense(
  expense: ExpenseClaim,
  policy: ExpensePolicy,
): CalculatorResult<PolicyCheckResult> {
  const violations: string[] = [];

  if (expense.amountMinor > policy.maxAmountMinor) {
    violations.push(`Amount ${expense.amountMinor} exceeds limit ${policy.maxAmountMinor}`);
  }
  if (policy.requiresReceipt && !expense.receiptAttached) {
    violations.push('Receipt is required');
  }
  if (
    policy.allowedCategories.length > 0 &&
    !policy.allowedCategories.includes(expense.categoryCode)
  ) {
    violations.push(`Category ${expense.categoryCode} is not allowed`);
  }

  return {
    result: { compliant: violations.length === 0, violations },
    inputs: { expense, policy },
    explanation:
      violations.length === 0
        ? 'Expense compliant with policy'
        : `Policy violations: ${violations.join('; ')}`,
  };
}
