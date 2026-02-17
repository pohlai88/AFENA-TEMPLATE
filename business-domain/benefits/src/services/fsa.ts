import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const ContributeFSAParams = z.object({
  employeeId: z.string(),
  accountType: z.enum(['healthcare', 'dependent_care']),
  amountMinor: z.number(),
  payPeriodId: z.string(),
});

export interface FSAContribution {
  contributionId: string;
  employeeId: string;
  accountType: string;
  amountMinor: number;
  balanceMinor: number;
}

export async function contributeFSA(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ContributeFSAParams>,
): Promise<Result<FSAContribution>> {
  const validated = ContributeFSAParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ contributionId: 'fsa-contrib-1', employeeId: validated.data.employeeId, accountType: validated.data.accountType, amountMinor: validated.data.amountMinor, balanceMinor: 150000 });
}

export const ReimburseExpenseParams = z.object({
  employeeId: z.string(),
  accountType: z.enum(['healthcare', 'dependent_care']),
  expenseAmountMinor: z.number(),
  expenseDate: z.date(),
  receiptUrl: z.string().optional(),
});

export interface ExpenseReimbursement {
  reimbursementId: string;
  employeeId: string;
  amountMinor: number;
  status: 'approved' | 'pending' | 'denied';
  remainingBalanceMinor: number;
}

export async function reimburseExpense(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ReimburseExpenseParams>,
): Promise<Result<ExpenseReimbursement>> {
  const validated = ReimburseExpenseParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ reimbursementId: 'reimb-1', employeeId: validated.data.employeeId, amountMinor: validated.data.expenseAmountMinor, status: 'approved', remainingBalanceMinor: 50000 });
}
