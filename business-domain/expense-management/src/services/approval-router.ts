/**
 * Approval Router - Route Expenses Through Approval Workflow
 *
 * Determines approval routing based on:
 * - Expense amount
 * - Employee hierarchy
 * - Policy violations
 * - Department rules
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const routeForApprovalInputSchema = z.object({
    orgId: z.string(),
    reportId: z.string(),
    totalAmount: z.number(),
    employeeId: z.string(),
    policyViolations: z.array(z.string()).optional()
});

const approvalRoutingResultSchema = z.object({
    reportId: z.string(),
    approvers: z.array(z.string()), // Employee IDs
    level: z.number(), // Approval level (1 = manager, 2 = dept head, 3 = CFO)
    dueDate: z.string(),
    parallel: z.boolean() // True if multiple approvers required simultaneously
});

export type RouteForApprovalInput = z.infer<typeof routeForApprovalInputSchema>;
export type ApprovalRoutingResult = z.infer<typeof approvalRoutingResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Route expense report for approval
 */
export async function routeForApproval(
    input: RouteForApprovalInput
): Promise<ApprovalRoutingResult> {
    const validated = routeForApprovalInputSchema.parse(input);

    // TODO: Implement approval routing:
    // 1. Load employee data (manager, department) from employees table
    // 2. Determine approval level:
    //    - Under $1,000: Manager only (level 1)
    //    - $1,000-$5,000: Department head (level 2)
    //    - Over $5,000: CFO (level 3)
    //    - Policy violations: Add compliance approver
    // 3. Load approval_rules table for special cases:
    //    - Certain categories require additional approvers (e.g., entertainment → compliance)
    //    - Project expenses require project manager approval
    // 4. Build approver chain:
    //    - Sequential: [manager, dept_head, cfo]
    //    - Parallel: [manager, project_manager] (both must approve)
    // 5. Create approval_workflow records
    // 6. Set due date (e.g., 5 business days)
    // 7. Send notification to first approver
    // 8. Return routing details

    let approvers: string[] = [];
    let level = 1;

    if (validated.totalAmount < 1000) {
        approvers = ['mgr_101']; // Manager ID
        level = 1;
    } else if (validated.totalAmount < 5000) {
        approvers = ['mgr_101', 'dept_head_202'];
        level = 2;
    } else {
        approvers = ['mgr_101', 'dept_head_202', 'cfo_303'];
        level = 3;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5); // 5 business days

    return {
        reportId: validated.reportId,
        approvers,
        level,
        dueDate: dueDate.toISOString(),
        parallel: false
    };
}
