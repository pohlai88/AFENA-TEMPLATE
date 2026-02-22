import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { costCenters } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type CostCenterReadModel = {
  centerId: string;
  code: string;
  name: string;
  parentId: string | null;
};

export async function getCostCenter(
  db: DbSession,
  ctx: DomainContext,
  centerId: string,
): Promise<CostCenterReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        centerId: costCenters.id,
        code: costCenters.code,
        name: costCenters.name,
        parentId: costCenters.parentId,
      })
      .from(costCenters)
      .where(
        and(
          eq(costCenters.orgId, ctx.orgId),
          eq(costCenters.id, centerId),
          eq(costCenters.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Cost center not found: ${centerId}`, { centerId });
  }

  const r = rows[0]!;
  return {
    centerId: r.centerId,
    code: r.code,
    name: r.name,
    parentId: r.parentId,
  };
}

/**
 * Load all active cost centers for the current org.
 */
export async function getActiveCostCenters(
  db: DbSession,
  ctx: DomainContext,
): Promise<CostCenterReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        centerId: costCenters.id,
        code: costCenters.code,
        name: costCenters.name,
        parentId: costCenters.parentId,
      })
      .from(costCenters)
      .where(
        and(
          eq(costCenters.orgId, ctx.orgId),
          eq(costCenters.isActive, 'true'),
          eq(costCenters.isDeleted, false),
        ),
      ),
  );

  return rows.map((r) => ({
    centerId: r.centerId,
    code: r.code,
    name: r.name,
    parentId: r.parentId,
  }));
}
