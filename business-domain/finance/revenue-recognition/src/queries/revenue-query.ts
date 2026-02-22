import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { revenueSchedules } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type RevenueContractReadModel = {
  scheduleId: string;
  totalMinor: number;
  startDateIso: string;
  endDateIso: string;
  currency: string;
  recognitionMethod: string;
  status: string;
};

export async function getRevenueContract(
  db: DbSession,
  ctx: DomainContext,
  scheduleId: string,
): Promise<RevenueContractReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        scheduleId: revenueSchedules.id,
        totalMinor: revenueSchedules.totalAmountMinor,
        startDateIso: revenueSchedules.startDate,
        endDateIso: revenueSchedules.endDate,
        currency: revenueSchedules.currencyCode,
        recognitionMethod: revenueSchedules.recognitionMethod,
        status: revenueSchedules.status,
      })
      .from(revenueSchedules)
      .where(
        and(
          eq(revenueSchedules.orgId, ctx.orgId),
          eq(revenueSchedules.id, scheduleId),
          eq(revenueSchedules.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Revenue schedule not found: ${scheduleId}`, {
      scheduleId,
    });
  }

  const r = rows[0]!;
  return {
    scheduleId: r.scheduleId,
    totalMinor: r.totalMinor,
    startDateIso: String(r.startDateIso),
    endDateIso: String(r.endDateIso),
    currency: r.currency,
    recognitionMethod: r.recognitionMethod,
    status: r.status,
  };
}
