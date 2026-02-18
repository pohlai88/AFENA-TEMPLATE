/**
 * Standalone Selling Price (SSP) Calculator - ASC 606 Step 3
 *
 * Calculates SSP using acceptable methods:
 * 1. Observable prices (from standalone sales)
 * 2. Adjusted market assessment (competitor pricing)
 * 3. Expected cost plus margin
 * 4. Residual approach (limited use - only if SSP highly variable)
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const sspMethodSchema = z.enum([
    'observable',
    'adjusted_market',
    'cost_plus_margin',
    'residual'
]);

const historicalSaleSchema = z.object({
    date: z.string(),
    price: z.number(),
    quantity: z.number()
});

const calculateSSPInputSchema = z.object({
    orgId: z.string(),
    productId: z.string(),
    method: sspMethodSchema,
    historicalSales: z.array(historicalSaleSchema).optional(),
    marketPrices: z.array(z.number()).optional(),
    cost: z.number().optional(),
    targetMargin: z.number().optional()
});

const sspResultSchema = z.object({
    productId: z.string(),
    ssp: z.number(),
    confidence: z.enum(['high', 'medium', 'low']),
    method: sspMethodSchema,
    dataPoints: z.number(),
    range: z.object({
        min: z.number(),
        max: z.number()
    }).optional()
});

export type SSPMethod = z.infer<typeof sspMethodSchema>;
export type HistoricalSale = z.infer<typeof historicalSaleSchema>;
export type CalculateSSPInput = z.infer<typeof calculateSSPInputSchema>;
export type SSPResult = z.infer<typeof sspResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate standalone selling price using ASC 606 approved methods
 */
export async function calculateSSP(
    input: CalculateSSPInput
): Promise<SSPResult> {
    const validated = calculateSSPInputSchema.parse(input);

    // TODO: Implement SSP calculation:
    // 1. Observable method: Median/mode of recent standalone sales (last 12 months)
    // 2. Adjusted market: Compare with competitor pricing (adjust for brand/features)
    // 3. Cost plus margin: Full cost + target margin (manufacturing, services)
    // 4. Residual: Total contract price - sum of observable SSPs (rarely used)
    // 5. Query ssp_history table for product
    // 6. Calculate confidence based on data recency and consistency
    // 7. Store calculated SSP in ssp_history
    // 8. Return SSP with confidence level

    let ssp = 10000; // Default
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    let dataPoints = 0;

    if (validated.method === 'observable' && validated.historicalSales) {
        const prices = validated.historicalSales.map(s => s.price);
        ssp = prices.reduce((a, b) => a + b, 0) / prices.length; // Simple average
        dataPoints = prices.length;
        confidence = dataPoints >= 10 ? 'high' : dataPoints >= 5 ? 'medium' : 'low';
    } else if (validated.method === 'cost_plus_margin' && validated.cost && validated.targetMargin) {
        ssp = validated.cost * (1 + validated.targetMargin);
        confidence = 'high';
        dataPoints = 1;
    }

    return {
        productId: validated.productId,
        ssp,
        confidence,
        method: validated.method,
        dataPoints,
        range: {
            min: ssp * 0.8,
            max: ssp * 1.2
        }
    };
}
