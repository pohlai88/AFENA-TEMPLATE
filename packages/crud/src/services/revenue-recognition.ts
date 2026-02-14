import { and, eq, revenueSchedules, revenueScheduleLines, sql } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Revenue recognition line result.
 */
export interface RecognitionLineResult {
  periodDate: string;
  amountMinor: number;
  cumulativeMinor: number;
}

/**
 * Generated recognition schedule.
 */
export interface RecognitionScheduleResult {
  totalAmountMinor: number;
  method: string;
  periodCount: number;
  lines: RecognitionLineResult[];
}

/**
 * Generate a straight-line revenue recognition schedule.
 *
 * PRD G0.19 + Phase E #21:
 * - Divides total amount evenly across periods (monthly)
 * - Last period absorbs rounding remainder
 * - All amounts in minor units (integer, no floats)
 *
 * @param totalAmountMinor - Total revenue to recognize
 * @param startDate - Schedule start date (YYYY-MM-DD)
 * @param endDate - Schedule end date (YYYY-MM-DD)
 */
export function generateStraightLineSchedule(
  totalAmountMinor: number,
  startDate: string,
  endDate: string,
): RecognitionScheduleResult {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate number of months
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  if (months <= 0) {
    return {
      totalAmountMinor,
      method: 'straight_line',
      periodCount: 1,
      lines: [{ periodDate: startDate, amountMinor: totalAmountMinor, cumulativeMinor: totalAmountMinor }],
    };
  }

  const perPeriod = Math.floor(totalAmountMinor / months);
  const lines: RecognitionLineResult[] = [];
  let cumulative = 0;

  for (let i = 0; i < months; i++) {
    const periodDate = new Date(start);
    periodDate.setMonth(periodDate.getMonth() + i);
    const dateStr = periodDate.toISOString().slice(0, 10);

    // Last period absorbs remainder
    const amount = i === months - 1
      ? totalAmountMinor - cumulative
      : perPeriod;

    cumulative += amount;

    lines.push({
      periodDate: dateStr,
      amountMinor: amount,
      cumulativeMinor: cumulative,
    });
  }

  return {
    totalAmountMinor,
    method: 'straight_line',
    periodCount: months,
    lines,
  };
}

/**
 * Create a revenue schedule and its lines in the database.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param params - Schedule parameters
 */
export async function createRevenueSchedule(
  tx: NeonHttpDatabase,
  orgId: string,
  params: {
    companyId: string;
    sourceType: string;
    sourceId: string;
    totalAmountMinor: number;
    currencyCode?: string;
    startDate: string;
    endDate: string;
    method?: 'straight_line' | 'usage_based' | 'milestone' | 'manual';
    revenueAccountId?: string;
    deferredAccountId?: string;
    memo?: string;
  },
): Promise<{ scheduleId: string; lineCount: number }> {
  const {
    companyId,
    sourceType,
    sourceId,
    totalAmountMinor,
    currencyCode = 'MYR',
    startDate,
    endDate,
    method = 'straight_line',
    revenueAccountId,
    deferredAccountId,
    memo,
  } = params;

  // Generate schedule lines
  const schedule = generateStraightLineSchedule(totalAmountMinor, startDate, endDate);

  // Insert schedule header
  const [header] = await (tx as any)
    .insert(revenueSchedules)
    .values({
      orgId,
      companyId,
      sourceType,
      sourceId,
      totalAmountMinor,
      recognizedAmountMinor: 0,
      deferredAmountMinor: totalAmountMinor,
      currencyCode,
      startDate,
      endDate,
      method,
      status: 'active',
      revenueAccountId,
      deferredAccountId,
      memo,
    })
    .returning({ id: revenueSchedules.id });

  // Insert schedule lines
  for (const line of schedule.lines) {
    await (tx as any)
      .insert(revenueScheduleLines)
      .values({
        orgId,
        scheduleId: header.id,
        periodDate: line.periodDate,
        amountMinor: line.amountMinor,
        status: 'pending',
      });
  }

  return { scheduleId: header.id, lineCount: schedule.lines.length };
}

/**
 * Recognize revenue for a specific period — marks pending lines as recognized.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param scheduleId - Revenue schedule UUID
 * @param periodDate - Period date to recognize (YYYY-MM-DD)
 * @param journalEntryId - Optional journal entry reference
 */
export async function recognizeRevenue(
  tx: NeonHttpDatabase,
  orgId: string,
  scheduleId: string,
  periodDate: string,
  journalEntryId?: string,
): Promise<{ recognizedMinor: number }> {
  // Mark matching pending lines as recognized
  const result = await (tx as any)
    .update(revenueScheduleLines)
    .set({
      status: 'recognized',
      journalEntryId: journalEntryId ?? null,
    })
    .where(
      and(
        eq(revenueScheduleLines.orgId, orgId),
        eq(revenueScheduleLines.scheduleId, scheduleId),
        eq(revenueScheduleLines.periodDate, periodDate),
        eq(revenueScheduleLines.status, 'pending'),
      ),
    )
    .returning({ amountMinor: revenueScheduleLines.amountMinor });

  const recognizedMinor = result.reduce(
    (sum: number, r: any) => sum + Number(r.amountMinor),
    0,
  );

  // Update schedule header totals
  if (recognizedMinor > 0) {
    await (tx as any)
      .update(revenueSchedules)
      .set({
        recognizedAmountMinor: sql`${revenueSchedules.recognizedAmountMinor} + ${recognizedMinor}`,
        deferredAmountMinor: sql`${revenueSchedules.deferredAmountMinor} - ${recognizedMinor}`,
      })
      .where(
        and(
          eq(revenueSchedules.orgId, orgId),
          eq(revenueSchedules.id, scheduleId),
        ),
      );
  }

  return { recognizedMinor };
}
