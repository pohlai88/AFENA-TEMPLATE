import { z } from 'zod';

const inputSchema = z.object({
    orgId: z.string(),
    vendorId: z.string().optional(),
    vendorCountry: z.string().length(2),
    paymentType: z.enum(['services', 'royalty', 'interest', 'dividend', 'rent']),
    amount: z.number().positive(),
    treatyApplicable: z.boolean().optional(),
    treatyCountry: z.string().length(2).optional()
});

const resultSchema = z.object({
    withholdingAmount: z.number(),
    withholdingRate: z.number(),
    statutoryRate: z.number(),
    treatyRate: z.number().optional(),
    formRequired: z.string().optional(),
    exemptionReason: z.string().optional()
});

export type CalculateWithholdingInput = z.infer<typeof inputSchema>;
export type WithholdingResult = z.infer<typeof resultSchema>;

/**
 * Calculates withholding tax on vendor payments.
 * 
 * US Withholding Tax:
 * 
 * **Domestic Payments (US vendors)**:
 * - 1099 contractors: No withholding (contractor pays estimated tax quarterly)
 * - Backup withholding: 24% when payee doesn't provide TIN
 * - Form W-9: Required from all US vendors
 * 
 * **Foreign Payments (non-US vendors)**:
 * - Statutory rate: 30% on FDAP income (Fixed, Determinable, Annual, Periodic)
 * - Treaty rate: Reduced rate (0-30%) based on tax treaty
 * - Form W-8BEN: Required for treaty benefits (individuals)
 * - Form W-8BEN-E: Required for treaty benefits (entities)
 * 
 * **FDAP Income Subject to Withholding**:
 * - Services performed in US: 30% (or treaty rate)
 * - Royalties: 30% (or treaty rate, often 0-10%)
 * - Interest: 30% (or treaty rate, often 0%)
 * - Dividends: 30% (or treaty rate, often 15%)
 * - Rent: 30% (or treaty rate)
 * 
 * **Common Treaty Rates** (US treaties):
 * - UK: 0% royalties, 0% interest, 15% dividends
 * - Canada: 10% royalties, 0% interest, 15% dividends
 * - India: 15% royalties, 15% interest, 15% dividends
 * - Ireland: 0% royalties, 0% interest, 15% dividends
 * 
 * **Exceptions**:
 * - Services performed outside US: No withholding
 * - Effectively connected income (ECI): No withholding (vendor files US tax return)
 * 
 * **Reporting**:
 * - Form 1042: Annual return (due March 15)
 * - Form 1042-S: Vendor statement (due March 15)
 * 
 * **International Withholding**:
 * - EU: 0-35% WHT on cross-border payments (reduced by directives)
 * - India: 10% on services, 10% on royalties
 * - China: 10% on royalties, 10% on services
 * 
 * @param input - Vendor country, payment type, amount, treaty status
 * @returns Withholding amount, rate, required forms
 */
export async function calculateWithholding(input: CalculateWithholdingInput): Promise<WithholdingResult> {
    const validated = inputSchema.parse(input);

    // TODO: Implement withholding calculation:
    // 1. Check if payment is FDAP income (subject to withholding)
    // 2. Determine statutory rate (30% for US, varies by country)
    // 3. If treatyApplicable, query tax_treaties table for reduced rate
    // 4. Verify vendor has provided required forms (W-8BEN, W-8BEN-E)
    // 5. Calculate withholding amount = amount × rate
    // 6. Return withholding details with form requirements

    const statutoryRate = 0.30; // US default
    let withholdingRate = statutoryRate;
    let treatyRate: number | undefined;

    // Check for treaty (example: India services = 15% treaty rate)
    if (validated.treatyApplicable && validated.vendorCountry === 'IN') {
        treatyRate = 0.15;
        withholdingRate = treatyRate;
    }

    return {
        withholdingAmount: validated.amount * withholdingRate,
        withholdingRate,
        statutoryRate,
        treatyRate,
        formRequired: validated.vendorCountry === 'US' ? 'W-9' : 'W-8BEN'
    };
}
