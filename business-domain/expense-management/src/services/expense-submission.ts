/**
 * Expense Submission - Create Expense Reports
 *
 * Handles employee expense report creation:
 * - Multiple line items per report
 * - Receipt attachment
 * - Auto-categorization
 * - Policy validation
 * - Submission workflow
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const expenseCategorySchema = z.enum([
    'airfare',
    'hotel',
    'meals',
    'ground_transportation',
    'mileage',
    'parking',
    'tolls',
    'supplies',
    'entertainment',
    'training',
    'other'
]);

const expenseLineItemSchema = z.object({
    category: expenseCategorySchema,
    amount: z.number(),
    date: z.string(),
    merchant: z.string().optional(),
    description: z.string().optional(),
    receiptUrl: z.string().optional(),
    billable: z.boolean().optional().default(false),
    projectId: z.string().optional()
});

const submitExpenseInputSchema = z.object({
    orgId: z.string(),
    employeeId: z.string(),
    reportName: z.string(),
    purpose: z.string().optional(),
    lineItems: z.array(expenseLineItemSchema)
});

const expenseReportResultSchema = z.object({
    reportId: z.string(),
    employeeId: z.string(),
    reportName: z.string(),
    status: z.enum(['draft', 'submitted', 'approved', 'rejected', 'paid']),
    totalAmount: z.number(),
    submittedAt: z.string(),
    lineItemCount: z.number()
});

export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type ExpenseLineItem = z.infer<typeof expenseLineItemSchema>;
export type SubmitExpenseInput = z.infer<typeof submitExpenseInputSchema>;
export type ExpenseReportResult = z.infer<typeof expenseReportResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submit expense report
 */
export async function submitExpense(
    input: SubmitExpenseInput
): Promise<ExpenseReportResult> {
    const validated = submitExpenseInputSchema.parse(input);

    // TODO: Implement expense submission:
    // 1. Validate employee exists and is active
    // 2. Calculate total amount (sum of line items)
    // 3. For each line item:
    //    - Validate against policy (see policy-validator.ts)
    //    - Check receipt requirement (if amount > threshold)
    //    - Validate date (not future, within allowable period)
    // 4. Create expense_reports record
    // 5. Create expense_line_items records
    // 6. Link receipts (receipts table FK to line items)
    // 7. Change status to 'submitted' (triggers approval workflow)
    // 8. Return expense report summary

    const totalAmount = validated.lineItems.reduce((sum, item) => sum + item.amount, 0);

    return {
        reportId: `exp_${Date.now()}`,
        employeeId: validated.employeeId,
        reportName: validated.reportName,
        status: 'submitted',
        totalAmount,
        submittedAt: new Date().toISOString(),
        lineItemCount: validated.lineItems.length
    };
}
