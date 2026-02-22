import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { dunningNotices, dunningRuns } from 'afenda-database';
import { and, eq, sql } from 'drizzle-orm';

// ── Read Models ─────────────────────────────────────────────

export type DunningRunReadModel = {
  runId: string;
  runNo: string | null;
  runDate: string;
  cutoffDate: string;
  noticeCount: number;
  totalOutstandingMinor: number;
  status: string;
};

export type DunningNoticeReadModel = {
  noticeId: string;
  dunningRunId: string;
  customerId: string;
  invoiceId: string | null;
  noticeLevel: number;
  actionType: string;
  amountOutstandingMinor: number;
  status: string;
};

// ── Queries ─────────────────────────────────────────────────

export async function getDunningRuns(
  db: DbSession,
  ctx: DomainContext,
  input: { status?: string },
): Promise<DunningRunReadModel[]> {
  const conditions = [eq(dunningRuns.orgId, ctx.orgId), eq(dunningRuns.isDeleted, false)];

  if (input.status) {
    conditions.push(eq(dunningRuns.status, input.status));
  }

  const rows = await db.read((tx) =>
    tx
      .select({
        runId: dunningRuns.id,
        runNo: dunningRuns.runNo,
        runDate: dunningRuns.runDate,
        cutoffDate: dunningRuns.cutoffDate,
        noticeCount: dunningRuns.noticeCount,
        totalOutstandingMinor: dunningRuns.totalOutstandingMinor,
        status: dunningRuns.status,
      })
      .from(dunningRuns)
      .where(and(...conditions)),
  );

  return rows.map((r) => ({
    ...r,
    runDate: String(r.runDate),
    cutoffDate: String(r.cutoffDate),
    totalOutstandingMinor: Number(r.totalOutstandingMinor),
  }));
}

export async function getDunningNoticesByRun(
  db: DbSession,
  ctx: DomainContext,
  input: { dunningRunId: string },
): Promise<DunningNoticeReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        noticeId: dunningNotices.id,
        dunningRunId: dunningNotices.dunningRunId,
        customerId: dunningNotices.customerId,
        invoiceId: dunningNotices.invoiceId,
        noticeLevel: dunningNotices.noticeLevel,
        actionType: dunningNotices.actionType,
        amountOutstandingMinor: dunningNotices.amountOutstandingMinor,
        status: dunningNotices.status,
      })
      .from(dunningNotices)
      .where(
        and(
          eq(dunningNotices.orgId, ctx.orgId),
          eq(dunningNotices.dunningRunId, input.dunningRunId),
          eq(dunningNotices.isDeleted, false),
        ),
      ),
  );

  return rows.map((r) => ({
    ...r,
    amountOutstandingMinor: Number(r.amountOutstandingMinor),
  }));
}

export async function getCustomerPriorNoticeCount(
  db: DbSession,
  ctx: DomainContext,
  customerId: string,
): Promise<number> {
  const rows = await db.read((tx) =>
    tx
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(dunningNotices)
      .where(
        and(
          eq(dunningNotices.orgId, ctx.orgId),
          eq(dunningNotices.customerId, customerId),
          eq(dunningNotices.isDeleted, false),
        ),
      ),
  );

  return rows[0]?.count ?? 0;
}
