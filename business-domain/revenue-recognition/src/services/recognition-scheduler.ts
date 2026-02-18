/**
 * Revenue Recognition Scheduler - ASC 606 Step 5
 *
 * Schedules revenue recognition based on satisfaction of performance obligations:
 * - Point in time: Recognize at delivery/acceptance
 * - Over time: Recognize ratably (time-based) or by milestone/% completion
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const recognitionPatternSchema = z.enum(['point_in_time', 'time_based', 'milestone', 'percentage_of_completion']);

const scheduleRevenueInputSchema = z.object({
    orgId: z.string(),
    poId: z.string(),
    allocatedAmount: z.number(),
    pattern: recognitionPatternSchema,
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    frequency: z.enum(['daily', 'monthly', 'quarterly', 'annually']).optional(),
    milestones: z.array(z.object({
        name: z.string(),
        percentage: z.number(),
        date: z.string()
    })).optional(),
    completionDate: z.string().optional()
});

const revenueEntrySchema = z.object({
    poId: z.string(),
    recognitionDate: z.string(),
    amount: z.number(),
    description: z.string()
});

export type RecognitionPattern = z.infer<typeof recognitionPatternSchema>;
export type ScheduleRevenueInput = z.infer<typeof scheduleRevenueInputSchema>;
export type RevenueEntry = z.infer<typeof revenueEntrySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schedule revenue recognition based on satisfaction pattern
 */
export async function scheduleRevenue(
    input: ScheduleRevenueInput
): Promise<RevenueEntry[]> {
    const validated = scheduleRevenueInputSchema.parse(input);

    // TODO: Implement revenue scheduling:
    // 1. Point in time: Single entry on completion date
    // 2. Time-based: Calculate periods between start/end, allocate evenly
    //    - Monthly: allocatedAmount / months
    //    - Daily: allocatedAmount / days
    // 3. Milestone: Recognize on milestone completion (percentage × allocatedAmount)
    // 4. % completion: Calculate progress, recognize proportionally
    // 5. Create revenue_schedule entries
    // 6. Generate GL entries (Debit: Deferred Revenue, Credit: Revenue)
    // 7. Return schedule

    const entries: RevenueEntry[] = [];

    if (validated.pattern === 'point_in_time') {
        entries.push({
            poId: validated.poId,
            recognitionDate: validated.completionDate || new Date().toISOString(),
            amount: validated.allocatedAmount,
            description: 'Point-in-time revenue recognition'
        });
    } else if (validated.pattern === 'time_based' && validated.startDate && validated.endDate && validated.frequency) {
        // Simple monthly calculation for demonstration
        const start = new Date(validated.startDate);
        const end = new Date(validated.endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        const monthlyAmount = Math.round(validated.allocatedAmount / months);

        for (let i = 0; i < months; i++) {
            const recognitionDate = new Date(start);
            recognitionDate.setMonth(start.getMonth() + i);
            entries.push({
                poId: validated.poId,
                recognitionDate: recognitionDate.toISOString(),
                amount: i === months - 1 ? validated.allocatedAmount - (monthlyAmount * (months - 1)) : monthlyAmount,
                description: `Month ${i + 1} of ${months} revenue recognition`
            });
        }
    }

    return entries;
}
