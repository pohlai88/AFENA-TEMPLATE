/**
 * Transaction Price Allocation Engine - ASC 606 Step 4
 *
 * Allocates transaction price to performance obligations based on relative SSP:
 * PO allocation = (SSP_PO / Total_SSP) × Transaction_Price
 *
 * Handles discounts (allocated proportionally unless discount relates to specific PO)
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const poSSPSchema = z.object({
    poId: z.string(),
    ssp: z.number()
});

const allocateTransactionPriceInputSchema = z.object({
    orgId: z.string(),
    contractId: z.string(),
    transactionPrice: z.number(),
    performanceObligations: z.array(poSSPSchema),
    specificDiscounts: z.array(z.object({
        poId: z.string(),
        discountAmount: z.number()
    })).optional()
});

const allocatedPOSchema = z.object({
    poId: z.string(),
    ssp: z.number(),
    allocatedAmount: z.number(),
    discount: z.number()
});

const allocationResultSchema = z.object({
    contractId: z.string(),
    transactionPrice: z.number(),
    totalSSP: z.number(),
    totalDiscount: z.number(),
    allocatedPOs: z.array(allocatedPOSchema)
});

export type POSSP = z.infer<typeof poSSPSchema>;
export type AllocateTransactionPriceInput = z.infer<typeof allocateTransactionPriceInputSchema>;
export type AllocatedPO = z.infer<typeof allocatedPOSchema>;
export type AllocationResult = z.infer<typeof allocationResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Allocate transaction price to performance obligations based on relative SSP
 */
export async function allocateTransactionPrice(
    input: AllocateTransactionPriceInput
): Promise<AllocationResult> {
    const validated = allocateTransactionPriceInputSchema.parse(input);

    // TODO: Implement relative SSP allocation:
    // 1. Calculate total SSP (sum of all PO SSPs)
    // 2. Calculate total discount (total SSP - transaction price)
    // 3. For each PO, allocate proportionally:
    //    allocated_amount = (ssp / total_ssp) × transaction_price
    // 4. Handle specific discounts (e.g., discount on support only)
    // 5. Round allocations (ensure sum = transaction price)
    // 6. Store allocations in po_allocations table
    // 7. Return allocation results

    const totalSSP = validated.performanceObligations.reduce((sum, po) => sum + po.ssp, 0);
    const totalDiscount = totalSSP - validated.transactionPrice;

    const allocatedPOs: AllocatedPO[] = validated.performanceObligations.map(po => {
        const allocatedAmount = Math.round((po.ssp / totalSSP) * validated.transactionPrice);
        const discount = po.ssp - allocatedAmount;

        return {
            poId: po.poId,
            ssp: po.ssp,
            allocatedAmount,
            discount
        };
    });

    // Adjust rounding (ensure sum equals transaction price exactly)
    const totalAllocated = allocatedPOs.reduce((sum, po) => sum + po.allocatedAmount, 0);
    if (totalAllocated !== validated.transactionPrice) {
        const adjustment = validated.transactionPrice - totalAllocated;
        allocatedPOs[0].allocatedAmount += adjustment;
        allocatedPOs[0].discount -= adjustment;
    }

    return {
        contractId: validated.contractId,
        transactionPrice: validated.transactionPrice,
        totalSSP,
        totalDiscount,
        allocatedPOs
    };
}
