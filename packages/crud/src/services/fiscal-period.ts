import { and, eq, fiscalPeriods, sql } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Result of a fiscal period lookup.
 */
export interface FiscalPeriodStatus {
  periodId: string;
  periodName: string;
  status: string;
}

/**
 * Check whether a posting date falls within an open fiscal period.
 *
 * PRD Phase B #6:
 * - Returns the period + status if found
 * - Returns null if no matching period exists (caller must reject)
 * - Used by journal entry posting and source doc submission guards
 *
 * @param db - Database handle (tx or top-level)
 * @param orgId - Tenant org ID
 * @param companyId - Company UUID
 * @param postingDate - The accounting-effective date (YYYY-MM-DD or Date)
 */
export async function checkPeriodOpen(
  db: NeonHttpDatabase,
  orgId: string,
  companyId: string,
  postingDate: string | Date,
): Promise<FiscalPeriodStatus | null> {
  const dateStr = typeof postingDate === 'string'
    ? postingDate
    : postingDate.toISOString().slice(0, 10);

  const [row] = await (db as any)
    .select({
      periodId: fiscalPeriods.id,
      periodName: fiscalPeriods.periodName,
      status: fiscalPeriods.status,
    })
    .from(fiscalPeriods)
    .where(
      and(
        eq(fiscalPeriods.orgId, orgId),
        eq(fiscalPeriods.companyId, companyId),
        sql`${fiscalPeriods.startDate} <= ${dateStr}::date`,
        sql`${fiscalPeriods.endDate} >= ${dateStr}::date`,
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    periodId: row.periodId,
    periodName: row.periodName,
    status: row.status,
  };
}

/**
 * Assert that a posting date falls within an open period.
 * Throws if the period is closed/closing or doesn't exist.
 */
export async function assertPeriodOpen(
  db: NeonHttpDatabase,
  orgId: string,
  companyId: string,
  postingDate: string | Date,
): Promise<FiscalPeriodStatus> {
  const period = await checkPeriodOpen(db, orgId, companyId, postingDate);

  if (!period) {
    throw new Error(
      `No fiscal period found for posting date ${String(postingDate)} in company ${companyId}`,
    );
  }

  if (period.status === 'closed') {
    throw new Error(
      `Cannot post to closed period "${period.periodName}" (${String(postingDate)})`,
    );
  }

  if (period.status === 'closing') {
    throw new Error(
      `Period "${period.periodName}" is in closing state — only authorized adjustments allowed`,
    );
  }

  return period;
}
