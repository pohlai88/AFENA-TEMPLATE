/**
 * Mileage Calculator - Calculate Mileage Reimbursement
 *
 * Calculates reimbursement for personal vehicle use:
 * - IRS standard mileage rate (varies by year)
 * - Distance × rate
 * - Optional: Route optimization (Google Maps API)
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const calculateMileageInputSchema = z.object({
    orgId: z.string(),
    employeeId: z.string(),
    distance: z.number(), // miles
    date: z.string(),
    purpose: z.string().optional(),
    origin: z.string().optional(), // Address for route calculation
    destination: z.string().optional(),
    roundTrip: z.boolean().optional().default(false)
});

const mileageResultSchema = z.object({
    distance: z.number(),
    rate: z.number(), // $ per mile
    reimbursement: z.number(),
    calculatedRoute: z.boolean(), // True if using Maps API
    routeDetails: z.object({
        origin: z.string(),
        destination: z.string(),
        distanceMiles: z.number()
    }).optional()
});

export type CalculateMileageInput = z.infer<typeof calculateMileageInputSchema>;
export type MileageResult = z.infer<typeof mileageResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate mileage reimbursement using IRS standard rate
 */
export async function calculateMileage(
    input: CalculateMileageInput
): Promise<MileageResult> {
    const validated = calculateMileageInputSchema.parse(input);

    // TODO: Implement mileage calculation:
    // 1. Load mileage rate from mileage_rates table (by year):
    //    - 2024: $0.67/mile (IRS standard)
    //    - 2025: $0.70/mile (example)
    //    - European countries: Use country-specific rates
    // 2. If origin/destination provided:
    //    - Call Google Maps Directions API
    //    - Get optimized route distance
    //    - Override manual distance with calculated
    // 3. If roundTrip = true, double the distance
    // 4. Calculate reimbursement: distance × rate
    // 5. Store mileage_log entry
    // 6. Return mileage result

    const rate = 0.67; // 2024 IRS standard rate
    let distance = validated.distance;

    if (validated.roundTrip) {
        distance *= 2;
    }

    const reimbursement = distance * rate;

    return {
        distance,
        rate,
        reimbursement: Math.round(reimbursement * 100) / 100, // Round to 2 decimals
        calculatedRoute: false
    };
}
