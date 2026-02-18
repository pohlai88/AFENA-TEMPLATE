/**
 * Deferred Revenue Tracker
 *
 * Tracks contract liabilities (deferred revenue) and contract assets (unbilled revenue):
 * - Deferred revenue: Payment received before performance obligation satisfied
 * - Contract asset: Revenue recognized before invoicing
 * - Revenue waterfall: Recognized vs. remaining deferred
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const trackDeferredRevenueInputSchema = z.object({
    orgId: z.string(),
    contractId: z.string(),
    asOfDate: z.string()
});

const deferredRevenueResultSchema = z.object({
    contractId: z.string(),
    asOfDate: z.string(),
    totalContractValue: z.number(),
    totalRecognized: z.number(),
    totalDeferred: z.number(),
    unbilledRevenue: z.number(),
    billedNotRecognized: z.number(),
    poBreakdown: z.array(z.object({
        poId: z.string(),
        description: z.string(),
        allocatedAmount: z.number(),
        recognizedToDate: z.number(),
        deferredBalance: z.number(),
        nextRecognitionDate: z.string().optional(),
        nextRecognitionAmount: z.number().optional()
    }))
});

export type TrackDeferredRevenueInput = z.infer<typeof trackDeferredRevenueInputSchema>;
export type DeferredRevenueResult = z.infer<typeof deferredRevenueResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track deferred revenue and contract asset balances
 */
export async function trackDeferredRevenue(
    input: TrackDeferredRevenueInput
): Promise<DeferredRevenueResult> {
    const validated = trackDeferredRevenueInputSchema.parse(input);

    // TODO: Implement deferred revenue tracking:
    // 1. Query revenue_contracts for contract details
    // 2. Query performance_obligations for PO allocations
    // 3. Query revenue_schedule for recognized amounts (where recognitionDate <= asOfDate)
    // 4. Calculate balances:
    //    - totalRecognized: Sum of recognized revenue
    //    - totalDeferred: allocatedAmount - totalRecognized
    //    - unbilledRevenue: recognized but not invoiced (contract asset)
    //    - billedNotRecognized: invoiced but not recognized (contract liability)
    // 5. For each PO, get next scheduled recognition
    // 6. Return waterfall breakdown

    return {
        contractId: validated.contractId,
        asOfDate: validated.asOfDate,
        totalContractValue: 120000,
        totalRecognized: 60000,
        totalDeferred: 60000,
        unbilledRevenue: 5000,
        billedNotRecognized: 55000,
        poBreakdown: [
            {
                poId: 'po_1',
                description: 'SaaS Annual Subscription',
                allocatedAmount: 100000,
                recognizedToDate: 50000,
                deferredBalance: 50000,
                nextRecognitionDate: '2026-03-01',
                nextRecognitionAmount: 8333
            },
            {
                poId: 'po_2',
                description: 'Professional Services',
                allocatedAmount: 20000,
                recognizedToDate: 10000,
                deferredBalance: 10000,
                nextRecognitionDate: '2026-03-15',
                nextRecognitionAmount: 5000
            }
        ]
    };
}
