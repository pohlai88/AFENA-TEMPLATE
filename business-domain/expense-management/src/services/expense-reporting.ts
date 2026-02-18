import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ExpenseReport {
  id: string;
  orgId: string;
  reportNumber: string;
  employeeId: string;
  reportDate: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';
  totalAmount: number;
  currency: string;
  purpose: string;
}

export interface ExpenseLineItem {
  id: string;
  reportId: string;
  expenseDate: Date;
  category: string;
  description: string;
  amount: number;
  receiptAttached: boolean;
  billable: boolean;
  projectId?: string;
}

export async function createExpenseReport(
  db: NeonHttpDatabase,
  data: Omit<ExpenseReport, 'id' | 'reportNumber' | 'status'>,
): Promise<ExpenseReport> {
  // TODO: Generate report number and insert with DRAFT status
  throw new Error('Database integration pending');
}

export async function addExpenseLineItem(
  db: NeonHttpDatabase,
  data: Omit<ExpenseLineItem, 'id'>,
): Promise<ExpenseLineItem> {
  // TODO: Insert expense line item
  throw new Error('Database integration pending');
}

export async function submitExpenseReport(
  db: NeonHttpDatabase,
  reportId: string,
): Promise<ExpenseReport> {
  // TODO: Update status to SUBMITTED
  throw new Error('Database integration pending');
}

export async function approveExpenseReport(
  db: NeonHttpDatabase,
  reportId: string,
  approvedBy: string,
): Promise<ExpenseReport> {
  // TODO: Update status to APPROVED
  throw new Error('Database integration pending');
}

export function validateExpensePolicy(
  lineItem: ExpenseLineItem,
  policyRules: Array<{
    category: string;
    maxAmount?: number;
    requiresReceipt?: boolean;
    requiresApproval?: boolean;
  }>,
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const rule = policyRules.find((r) => r.category === lineItem.category);

  if (!rule) {
    violations.push(`No policy found for category: ${lineItem.category}`);
    return { valid: false, violations };
  }

  if (rule.maxAmount && lineItem.amount > rule.maxAmount) {
    violations.push(`Amount ${lineItem.amount} exceeds limit ${rule.maxAmount}`);
  }

  if (rule.requiresReceipt && !lineItem.receiptAttached) {
    violations.push('Receipt required but not attached');
  }

  return { valid: violations.length === 0, violations };
}

export function categorizeExpenses(
  lineItems: ExpenseLineItem[],
): Array<{ category: string; totalAmount: number; count: number }> {
  const categories = new Map<string, { totalAmount: number; count: number }>();

  for (const item of lineItems) {
    const current = categories.get(item.category) || { totalAmount: 0, count: 0 };
    categories.set(item.category, {
      totalAmount: current.totalAmount + item.amount,
      count: current.count + 1,
    });
  }

  return Array.from(categories.entries()).map(([category, data]) => ({
    category,
    totalAmount: data.totalAmount,
    count: data.count,
  }));
}

export function calculateMileageReimbursement(
  miles: number,
  ratePerMile: number = 0.67, // 2026 IRS rate
): number {
  return miles * ratePerMile;
}

export function calculatePerDiem(
  days: number,
  location: string,
  perDiemRates: Map<string, number>,
): number {
  const rate = perDiemRates.get(location) || 0;
  return days * rate;
}
