/**
 * Per Diem Calculator - Calculate Daily Allowances
 *
 * Calculates per diem rates by location:
 * - GSA rates (US federal government)
 * - Country-specific rates (international)
 * - M&IE (Meals and Incidental Expenses)
 * - Lodging allowances
 * - First/last day partial rates
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const calculatePerDiemInputSchema = z.object({
    orgId: z.string(),
    employeeId: z.string(),
    location: z.string(), // City, State or Country
    startDate: z.string(),
    endDate: z.string(),
    mealBreakdown: z.boolean().optional().default(false) // Return breakfast/lunch/dinner split
});

const perDiemResultSchema = z.object({
    totalPerDiem: z.number(),
    meals: z.number(), // M&IE total
    lodging: z.number(),
    days: z.number(),
    ratePerDay: z.number(),
    breakdown: z.object({
        breakfast: z.number(),
        lunch: z.number(),
        dinner: z.number(),
        incidentals: z.number()
    }).optional()
});

export type CalculatePerDiemInput = z.infer<typeof calculatePerDiemInputSchema>;
export type PerDiemResult = z.infer<typeof perDiemResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate per diem allowance based on location and dates
 */
export async function calculatePerDiem(
    input: CalculatePerDiemInput
): Promise<PerDiemResult> {
    const validated = calculatePerDiemInputSchema.parse(input);

    // TODO: Implement per diem calculation:
    // 1. Geocode location to match GSA rate table
    // 2. Load per_diem_rates table:
    //    - US: GSA rates by city/county (updated annually)
    //    - International: State Dept rates by country/city
    // 3. Calculate number of days (inclusive)
    // 4. Apply first/last day rules:
    //    - First day: 75% of M&IE
    //    - Last day: 75% of M&IE
    //    - Full days: 100% of M&IE
    // 5. If mealBreakdown requested:
    //    - Breakfast: 15% of M&IE
    //    - Lunch: 25% of M&IE
    //    - Dinner: 50% of M&IE
    //    - Incidentals: 10% of M&IE
    // 6. Calculate lodging: days × lodging rate
    // 7. Return total per diem

    const start = new Date(validated.startDate);
    const end = new Date(validated.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Example: New York City rates (2024)
    const mealRate = 79; // M&IE per day
    const lodgingRate = 299; // Lodging per day

    const totalMeals = mealRate * days;
    const totalLodging = lodgingRate * days;

    let breakdown;
    if (validated.mealBreakdown) {
        breakdown = {
            breakfast: Math.round(mealRate * 0.15 * days),
            lunch: Math.round(mealRate * 0.25 * days),
            dinner: Math.round(mealRate * 0.50 * days),
            incidentals: Math.round(mealRate * 0.10 * days)
        };
    }

    return {
        totalPerDiem: totalMeals + totalLodging,
        meals: totalMeals,
        lodging: totalLodging,
        days,
        ratePerDay: mealRate + lodgingRate,
        breakdown
    };
}
