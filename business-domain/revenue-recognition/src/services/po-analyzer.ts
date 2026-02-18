/**
 * Performance Obligation Analyzer - ASC 606 Step 2
 *
 * Identifies distinct performance obligations within a contract:
 * - Capable of being distinct (customer can benefit)
 * - Distinct within context (separately identifiable)
 * - Point-in-time vs. over-time classification
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const lineItemSchema = z.object({
    productId: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    amount: z.number(),
    type: z.enum([
        'software_license',
        'saas_subscription',
        'maintenance',
        'professional_services',
        'training',
        'hardware',
        'consulting',
        'implementation'
    ])
});

const analyzePerformanceObligationsInputSchema = z.object({
    orgId: z.string(),
    contractId: z.string(),
    lineItems: z.array(lineItemSchema)
});

const performanceObligationSchema = z.object({
    poId: z.string(),
    productId: z.string(),
    description: z.string(),
    isDistinct: z.boolean(),
    recognitionPattern: z.enum(['point_in_time', 'over_time']),
    overTimeMethod: z.enum(['time_based', 'milestone', 'percentage_of_completion', 'none']),
    amount: z.number(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
});

export type LineItem = z.infer<typeof lineItemSchema>;
export type AnalyzePerformanceObligationsInput = z.infer<typeof analyzePerformanceObligationsInputSchema>;
export type PerformanceObligation = z.infer<typeof performanceObligationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze contract to identify distinct performance obligations
 */
export async function analyzePerformanceObligations(
    input: AnalyzePerformanceObligationsInput
): Promise<PerformanceObligation[]> {
    const validated = analyzePerformanceObligationsInputSchema.parse(input);

    // TODO: Implement performance obligation identification:
    // 1. For each line item, determine if distinct (capable of being distinct + distinct in context)
    // 2. Bundle non-distinct items (e.g., installation that only works with specific software)
    // 3. Classify recognition pattern:
    //    - Point in time: Software license, hardware (control transfers at delivery)
    //    - Over time: SaaS (time-based), services (milestone/time), construction (% complete)
    // 4. Create performance_obligations records
    // 5. Return array of distinct POs

    const pos: PerformanceObligation[] = validated.lineItems.map((item, index) => ({
        poId: `po_${validated.contractId}_${index + 1}`,
        productId: item.productId,
        description: item.description || item.type,
        isDistinct: true,
        recognitionPattern: item.type === 'saas_subscription' || item.type === 'maintenance' || item.type === 'professional_services'
            ? 'over_time'
            : 'point_in_time',
        overTimeMethod: item.type === 'saas_subscription' || item.type === 'maintenance'
            ? 'time_based'
            : item.type === 'professional_services'
            ? 'milestone'
            : 'none',
        amount: item.amount
    }));

    return pos;
}
