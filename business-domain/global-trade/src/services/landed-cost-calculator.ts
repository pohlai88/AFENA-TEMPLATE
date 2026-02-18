import { z } from 'zod';

const inputSchema = z.object({
    orgId: z.string(),
    productCost: z.number().positive(),
    freight: z.number().nonnegative(),
    insurance: z.number().nonnegative(),
    hsCode: z.string(),
    originCountry: z.string().length(2),
    destinationCountry: z.string().length(2),
    quantity: z.number().positive().optional()
});

const resultSchema = z.object({
    landedCost: z.number(),
    breakdown: z.object({
        product: z.number(),
        freight: z.number(),
        insurance: z.number(),
        duty: z.number(),
        merchandiseProcessingFee: z.number().optional(),
        harborMaintenanceFee: z.number().optional(),
        otherFees: z.number().optional()
    }),
    unitLandedCost: z.number().optional()
});

export type CalculateLandedCostInput = z.infer<typeof inputSchema>;
export type LandedCostResult = z.infer<typeof resultSchema>;

/**
 * Calculates total landed cost including all fees.
 * 
 * Landed Cost = Product Cost + Freight + Insurance + Duties + Fees
 * 
 * Components:
 * - Product cost: FOB price from supplier
 * - Freight: Ocean/air freight charges
 * - Insurance: Cargo insurance (usually 1% of product cost)
 * - Duty: Customs duty (calculated separately)
 * - MPF: Merchandise Processing Fee (US: 0.3464% of entry value, min $31.67, max $614.35)
 * - HMF: Harbor Maintenance Fee (US: 0.125% of cargo value for ocean shipments)
 * - Other: Customs broker fees, drayage, etc.
 * 
 * Critical for:
 * - Purchase price comparison (China vs. Vietnam vs. Mexico)
 * - Sales pricing (ensure profitability)
 * - Transfer pricing (arm's length price)
 * - Make vs. buy decisions
 * 
 * @param input - Product cost, freight, insurance, HS code, origin, destination
 * @returns Total landed cost with detailed breakdown
 */
export async function calculateLandedCost(input: CalculateLandedCostInput): Promise<LandedCostResult> {
    const validated = inputSchema.parse(input);

    // TODO: Implement landed cost calculation:
    // 1. Calculate customs value (CIF or FOB + freight + insurance)
    // 2. Calculate duty using duty-calculator
    // 3. Calculate MPF (0.3464% of entry value, min $31.67, max $614.35 for US)
    // 4. Calculate HMF (0.125% of cargo value for US ocean shipments)
    // 5. Add all fees to get total landed cost
    // 6. Calculate unit landed cost if quantity provided
    // 7. Return detailed breakdown

    const customsValue = validated.productCost + validated.freight + validated.insurance;

    return {
        landedCost: customsValue,
        breakdown: {
            product: validated.productCost,
            freight: validated.freight,
            insurance: validated.insurance,
            duty: 0,
            merchandiseProcessingFee: 0,
            harborMaintenanceFee: 0
        },
        unitLandedCost: validated.quantity ? customsValue / validated.quantity : undefined
    };
}
