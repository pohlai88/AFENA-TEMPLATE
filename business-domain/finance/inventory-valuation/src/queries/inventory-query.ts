import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { inventoryValuationItems } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type InventoryValuationReadModel = {
  id: string;
  itemId: string;
  periodKey: string;
  costMethod: string;
  currencyCode: string;
  totalCostMinor: number;
  unitCostMinor: number;
  nrvMinor: number;
  writedownMinor: number;
  quantityOnHand: string;
};

const selectColumns = {
  id: inventoryValuationItems.id,
  itemId: inventoryValuationItems.itemId,
  periodKey: inventoryValuationItems.periodKey,
  costMethod: inventoryValuationItems.costMethod,
  currencyCode: inventoryValuationItems.currencyCode,
  totalCostMinor: inventoryValuationItems.totalCostMinor,
  unitCostMinor: inventoryValuationItems.unitCostMinor,
  nrvMinor: inventoryValuationItems.nrvMinor,
  writedownMinor: inventoryValuationItems.writedownMinor,
  quantityOnHand: inventoryValuationItems.quantityOnHand,
} as const;

/**
 * Fetch a single inventory valuation record by ID.
 *
 * @throws DomainError NOT_FOUND when no matching record exists.
 */
export async function getInventoryValuation(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<InventoryValuationReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select(selectColumns)
      .from(inventoryValuationItems)
      .where(
        and(
          eq(inventoryValuationItems.orgId, ctx.orgId),
          eq(inventoryValuationItems.companyId, ctx.companyId),
          eq(inventoryValuationItems.id, id),
          eq(inventoryValuationItems.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0) throw new DomainError('NOT_FOUND', `Inventory valuation not found: ${id}`);
  return rows[0]!;
}

/**
 * List all valuation snapshots for a specific item.
 */
export async function listByItem(
  db: DbSession,
  ctx: DomainContext,
  itemId: string,
): Promise<InventoryValuationReadModel[]> {
  return db.read((tx) =>
    tx
      .select(selectColumns)
      .from(inventoryValuationItems)
      .where(
        and(
          eq(inventoryValuationItems.orgId, ctx.orgId),
          eq(inventoryValuationItems.companyId, ctx.companyId),
          eq(inventoryValuationItems.itemId, itemId),
          eq(inventoryValuationItems.isDeleted, false),
        ),
      ),
  );
}

/**
 * List all valuation snapshots for a specific period.
 */
export async function listByPeriod(
  db: DbSession,
  ctx: DomainContext,
  periodKey: string,
): Promise<InventoryValuationReadModel[]> {
  return db.read((tx) =>
    tx
      .select(selectColumns)
      .from(inventoryValuationItems)
      .where(
        and(
          eq(inventoryValuationItems.orgId, ctx.orgId),
          eq(inventoryValuationItems.companyId, ctx.companyId),
          eq(inventoryValuationItems.periodKey, periodKey),
          eq(inventoryValuationItems.isDeleted, false),
        ),
      ),
  );
}
