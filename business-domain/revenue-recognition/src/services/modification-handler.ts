/**
 * Contract Modification Handler
 *
 * Handles changes to contract scope or price after original approval:
 * 1. Separate contract: Distinct goods at SSP
 * 2. Termination + new: Remaining POs + modification as new contract
 * 3. Cumulative catch-up: Adjust revenue for change in estimate
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const modificationTypeSchema = z.enum(['separate_contract', 'termination', 'cumulative_catchup']);

const handleModificationInputSchema = z.object({
    orgId: z.string(),
    contractId: z.string(),
    modificationType: modificationTypeSchema,
    additionalAmount: z.number().optional(),
    newPOs: z.array(z.object({
        productId: z.string(),
        type: z.string(),
        ssp: z.number()
    })).optional(),
    terminatedPOIds: z.array(z.string()).optional(),
    adjustmentAmount: z.number().optional()
});

const modificationResultSchema = z.object({
    originalContractId: z.string(),
    newContractId: z.string().optional(),
    modificationType: modificationTypeSchema,
    adjustments: z.array(z.object({
        poId: z.string(),
        originalAmount: z.number(),
        newAmount: z.number(),
        adjustment: z.number()
    }))
});

export type ModificationType = z.infer<typeof modificationTypeSchema>;
export type HandleModificationInput = z.infer<typeof handleModificationInputSchema>;
export type ModificationResult = z.infer<typeof modificationResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Handle contract modifications per ASC 606-25-10 through 25-13
 */
export async function handleModification(
    input: HandleModificationInput
): Promise<ModificationResult> {
    const validated = handleModificationInputSchema.parse(input);

    // TODO: Implement modification handling:
    // 1. Separate contract: New distinct goods at SSP → create new contract
    // 2. Termination: Close original contract, create new for remaining + modifications
    // 3. Cumulative catch-up: Adjust existing PO allocations, book catch-up adjustment
    // 4. Update revenue_contracts and performance_obligations tables
    // 5. Generate adjustment entries (if cumulative catch-up)
    // 6. Return modification summary

    const adjustments = [];

    if (validated.modificationType === 'separate_contract') {
        // Create new contract for additional goods
        const newContractId = `${validated.contractId}_mod_${Date.now()}`;
        return {
            originalContractId: validated.contractId,
            newContractId,
            modificationType: validated.modificationType,
            adjustments: []
        };
    }

    return {
        originalContractId: validated.contractId,
        modificationType: validated.modificationType,
        adjustments
    };
}
