/**
 * Policy Validator - Enforce Expense Policies
 *
 * Validates expenses against company policies:
 * - Amount limits by category
 * - Receipt requirements
 * - Pre-approval requirements
 * - Category restrictions by employee level
 * - Date range validation
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const validateAgainstPolicyInputSchema = z.object({
    orgId: z.string(),
    employeeId: z.string(),
    lineItem: z.object({
        category: z.string(),
        amount: z.number(),
        date: z.string(),
        receiptUrl: z.string().optional()
    })
});

const policyViolationSchema = z.object({
    code: z.string(),
    message: z.string(),
    severity: z.enum(['error', 'warning', 'info']),
    limit: z.number().optional(),
    actual: z.number().optional()
});

const policyValidationResultSchema = z.object({
    valid: z.boolean(),
    violations: z.array(policyViolationSchema),
    requiresApproval: z.boolean(),
    approvalLevel: z.number().optional()
});

export type ValidateAgainstPolicyInput = z.infer<typeof validateAgainstPolicyInputSchema>;
export type PolicyViolation = z.infer<typeof policyViolationSchema>;
export type PolicyValidationResult = z.infer<typeof policyValidationResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate expense against company policies
 */
export async function validateAgainstPolicy(
    input: ValidateAgainstPolicyInput
): Promise<PolicyValidationResult> {
    const validated = validateAgainstPolicyInputSchema.parse(input);

    // TODO: Implement policy validation:
    // 1. Load expense policies from expense_policies table (filtered by org)
    // 2. Load employee data (level, department) from employees table
    // 3. Check amount limits:
    //    - Hotel: Max per night (e.g., $200)
    //    - Meals: Max per meal (e.g., breakfast $15, lunch $25, dinner $50)
    //    - Entertainment: Max per event (e.g., $100)
    // 4. Check receipt requirements:
    //    - Receipt required if amount > $25
    //    - Receipt required for all airfare/hotels
    // 5. Check pre-approval requirements:
    //    - Expenses over $1,000 require pre-approval
    //    - International travel requires pre-approval
    // 6. Check category restrictions:
    //    - Alcohol not allowed for junior employees
    //    - First-class airfare not allowed (director+ only)
    // 7. Check date validation:
    //    - Expense not more than 90 days old
    //    - Expense not in future
    // 8. Return violations array

    const violations: PolicyViolation[] = [];

    // Example: Hotel limit
    if (validated.lineItem.category === 'hotel' && validated.lineItem.amount > 200) {
        violations.push({
            code: 'HOTEL_OVER_LIMIT',
            message: 'Hotel expense exceeds policy limit of $200 per night',
            severity: 'error',
            limit: 200,
            actual: validated.lineItem.amount
        });
    }

    // Example: Receipt required
    if (validated.lineItem.amount > 25 && !validated.lineItem.receiptUrl) {
        violations.push({
            code: 'RECEIPT_REQUIRED',
            message: 'Receipt required for expenses over $25',
            severity: 'error',
            limit: 25,
            actual: validated.lineItem.amount
        });
    }

    const requiresApproval = validated.lineItem.amount > 1000 || violations.length > 0;

    return {
        valid: violations.filter(v => v.severity === 'error').length === 0,
        violations,
        requiresApproval,
        approvalLevel: requiresApproval ? (validated.lineItem.amount > 5000 ? 3 : 2) : 1
    };
}
