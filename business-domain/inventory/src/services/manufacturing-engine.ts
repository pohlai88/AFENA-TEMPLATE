import { and, boms, bomLines, eq, wipMovements, workOrders } from 'afenda-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ── Types ───────────────────────────────────────────────

/**
 * Movement types for WIP accounting.
 */
export type WipMovementType =
  | 'material_issue'
  | 'material_return'
  | 'labor'
  | 'overhead'
  | 'completion'
  | 'scrap';

/**
 * BOM explosion result — flattened list of required materials.
 */
export interface BomExplosionLine {
  componentProductId: string;
  requiredQty: number;
  wastePercent: number;
  grossQty: number;
  uomId: string | null;
  isOptional: boolean;
  sortOrder: number;
}

/**
 * BOM explosion result with header info.
 */
export interface BomExplosionResult {
  bomId: string;
  productId: string;
  bomVersion: number;
  yieldQty: number;
  orderQty: number;
  lines: BomExplosionLine[];
  totalComponents: number;
}

/**
 * Cost rollup result for a work order.
 */
export interface CostRollupResult {
  workOrderId: string;
  materialCostMinor: number;
  laborCostMinor: number;
  overheadCostMinor: number;
  scrapCostMinor: number;
  totalCostMinor: number;
  completedQty: number;
  unitCostMinor: number;
}

/**
 * WIP journal entry spec — what needs to be journalized.
 */
export interface WipJournalSpec {
  workOrderId: string;
  companyId: string;
  wipAccountId: string;
  entries: WipJournalEntry[];
}

/**
 * Individual WIP journal line.
 */
export interface WipJournalEntry {
  accountId: string;
  debitMinor: number;
  creditMinor: number;
  memo: string;
  movementType: WipMovementType;
}

// ── BOM Explosion ───────────────────────────────────────

/**
 * Explode a BOM for a given order quantity.
 *
 * PRD G0.21 — Manufacturing routing:
 * - Resolves BOM lines for a product
 * - Scales quantities by order qty / yield qty
 * - Applies waste percentage to get gross requirements
 * - Pure function when given BOM data; DB version fetches from schema
 *
 * @param bomData - BOM header + lines (pre-fetched or from DB)
 * @param orderQty - Quantity to manufacture
 */
export function explodeBom(
  bomData: {
    bomId: string;
    productId: string;
    bomVersion: number;
    yieldQty: number;
    lines: Array<{
      componentProductId: string;
      qty: number;
      wastePercent: number;
      uomId: string | null;
      isOptional: boolean;
      sortOrder: number;
    }>;
  },
  orderQty: number,
): BomExplosionResult {
  const scaleFactor = orderQty / bomData.yieldQty;

  const explosionLines: BomExplosionLine[] = bomData.lines.map((line) => {
    const requiredQty = line.qty * scaleFactor;
    const wasteFactor = 1 + line.wastePercent / 100;
    const grossQty = Math.ceil(requiredQty * wasteFactor * 1000000) / 1000000;

    return {
      componentProductId: line.componentProductId,
      requiredQty,
      wastePercent: line.wastePercent,
      grossQty,
      uomId: line.uomId,
      isOptional: line.isOptional,
      sortOrder: line.sortOrder,
    };
  });

  return {
    bomId: bomData.bomId,
    productId: bomData.productId,
    bomVersion: bomData.bomVersion,
    yieldQty: bomData.yieldQty,
    orderQty,
    lines: explosionLines.sort((a, b) => a.sortOrder - b.sortOrder),
    totalComponents: explosionLines.filter((l) => !l.isOptional).length,
  };
}

/**
 * Fetch active BOM and explode for a given product + order quantity.
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param companyId - Company UUID
 * @param productId - Finished product UUID
 * @param orderQty - Quantity to manufacture
 */
export async function explodeBomFromDb(
  db: NeonHttpDatabase,
  orgId: string,
  companyId: string,
  productId: string,
  orderQty: number,
): Promise<BomExplosionResult | null> {
  // Find active BOM with highest version
  const bomRows = await (db as any)
    .select()
    .from(boms)
    .where(
      and(
        eq(boms.orgId, orgId),
        eq(boms.companyId, companyId),
        eq(boms.productId, productId),
        eq(boms.isActive, true),
      ),
    )
    .orderBy(boms.bomVersion)
    .limit(1);

  const bom = bomRows[0];
  if (!bom) return null;

  const bomId = String(bom.id);
  // Fetch BOM lines
  const lines = await (db as any)
    .select()
    .from(bomLines)
    .where(
      and(
        eq(bomLines.orgId, orgId),
        eq(bomLines.bomId, bomId),
      ),
    );

  return explodeBom(
    {
      bomId,
      productId: bom.productId,
      bomVersion: bom.bomVersion,
      yieldQty: Number(bom.yieldQty),
      lines: lines.map((l: any) => ({
        componentProductId: l.componentProductId,
        qty: Number(l.qty),
        wastePercent: Number(l.wastePercent),
        uomId: l.uomId,
        isOptional: l.isOptional,
        sortOrder: l.sortOrder,
      })),
    },
    orderQty,
  );
}

// ── Cost Rollup ─────────────────────────────────────────

/**
 * Calculate cost rollup for a work order from its WIP movements.
 *
 * PRD G0.21 — Cost rollup:
 * - Sums material_issue, labor, overhead, scrap movements
 * - material_return reduces material cost
 * - completion movements don't add cost (they transfer WIP → FG)
 * - Unit cost = total / completed qty
 *
 * @param movements - WIP movements for the work order
 * @param completedQty - Quantity completed (from work order)
 */
export function calculateCostRollup(
  movements: Array<{
    movementType: WipMovementType;
    costMinor: number;
  }>,
  completedQty: number,
): Omit<CostRollupResult, 'workOrderId'> {
  let materialCostMinor = 0;
  let laborCostMinor = 0;
  let overheadCostMinor = 0;
  let scrapCostMinor = 0;

  for (const mv of movements) {
    switch (mv.movementType) {
      case 'material_issue':
        materialCostMinor += mv.costMinor;
        break;
      case 'material_return':
        materialCostMinor -= mv.costMinor;
        break;
      case 'labor':
        laborCostMinor += mv.costMinor;
        break;
      case 'overhead':
        overheadCostMinor += mv.costMinor;
        break;
      case 'scrap':
        scrapCostMinor += mv.costMinor;
        break;
      case 'completion':
        // Completion transfers WIP → FG, doesn't add cost
        break;
    }
  }

  const totalCostMinor = materialCostMinor + laborCostMinor + overheadCostMinor + scrapCostMinor;
  const unitCostMinor = completedQty > 0 ? Math.round(totalCostMinor / completedQty) : 0;

  return {
    materialCostMinor,
    laborCostMinor,
    overheadCostMinor,
    scrapCostMinor,
    totalCostMinor,
    completedQty,
    unitCostMinor,
  };
}

/**
 * Fetch WIP movements and calculate cost rollup for a work order.
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param workOrderId - Work order UUID
 */
export async function getCostRollup(
  db: NeonHttpDatabase,
  orgId: string,
  workOrderId: string,
): Promise<CostRollupResult | null> {
  // Fetch work order
  const woRows = await (db as any)
    .select()
    .from(workOrders)
    .where(
      and(
        eq(workOrders.orgId, orgId),
        eq(workOrders.id, workOrderId),
      ),
    )
    .limit(1);

  const wo = woRows[0];
  if (!wo) return null;

  // Fetch WIP movements
  const movements = await (db as any)
    .select({
      movementType: wipMovements.movementType,
      costMinor: wipMovements.costMinor,
    })
    .from(wipMovements)
    .where(
      and(
        eq(wipMovements.orgId, orgId),
        eq(wipMovements.workOrderId, workOrderId),
      ),
    );

  const typedMovements: Array<{ movementType: WipMovementType; costMinor: number }> = movements.map(
    (m: { movementType: string; costMinor: unknown }) => ({
      movementType: m.movementType as WipMovementType,
      costMinor: Number(m.costMinor),
    }),
  );
  const rollup = calculateCostRollup(typedMovements, Number(wo.completedQty));

  return {
    workOrderId,
    ...rollup,
  };
}

// ── WIP → GL Journalization ─────────────────────────────

/**
 * Generate WIP journal entry specs from WIP movements.
 *
 * PRD G0.21 — WIP→GL journalization:
 * - material_issue: Debit WIP, Credit Raw Material Inventory
 * - material_return: Debit Raw Material Inventory, Credit WIP
 * - labor: Debit WIP, Credit Wages Payable
 * - overhead: Debit WIP, Credit Overhead Applied
 * - completion: Debit Finished Goods, Credit WIP
 * - scrap: Debit Scrap Expense, Credit WIP
 *
 * Pure function — caller persists journal entries via the posting kernel.
 *
 * @param workOrderId - Work order UUID
 * @param companyId - Company UUID
 * @param wipAccountId - WIP GL account UUID
 * @param movements - WIP movements to journalize
 * @param accountMap - Maps movement types to contra-account UUIDs
 */
export function generateWipJournalEntries(
  workOrderId: string,
  companyId: string,
  wipAccountId: string,
  movements: Array<{
    movementType: WipMovementType;
    costMinor: number;
    memo?: string;
  }>,
  accountMap: {
    rawMaterialInventory: string;
    wagesPayable: string;
    overheadApplied: string;
    finishedGoods: string;
    scrapExpense: string;
  },
): WipJournalSpec {
  const entries: WipJournalEntry[] = [];

  for (const mv of movements) {
    if (mv.costMinor === 0) continue;

    const baseMemo = mv.memo ?? `WO ${workOrderId} — ${mv.movementType}`;

    switch (mv.movementType) {
      case 'material_issue':
        entries.push(
          { accountId: wipAccountId, debitMinor: mv.costMinor, creditMinor: 0, memo: baseMemo, movementType: mv.movementType },
          { accountId: accountMap.rawMaterialInventory, debitMinor: 0, creditMinor: mv.costMinor, memo: baseMemo, movementType: mv.movementType },
        );
        break;

      case 'material_return':
        entries.push(
          { accountId: accountMap.rawMaterialInventory, debitMinor: mv.costMinor, creditMinor: 0, memo: baseMemo, movementType: mv.movementType },
          { accountId: wipAccountId, debitMinor: 0, creditMinor: mv.costMinor, memo: baseMemo, movementType: mv.movementType },
        );
        break;

      case 'labor':
        entries.push(
          { accountId: wipAccountId, debitMinor: mv.costMinor, creditMinor: 0, memo: baseMemo, movementType: mv.movementType },
          { accountId: accountMap.wagesPayable, debitMinor: 0, creditMinor: mv.costMinor, memo: baseMemo, movementType: mv.movementType },
        );
        break;

      case 'overhead':
        entries.push(
          { accountId: wipAccountId, debitMinor: mv.costMinor, creditMinor: 0, memo: baseMemo, movementType: mv.movementType },
          { accountId: accountMap.overheadApplied, debitMinor: 0, creditMinor: mv.costMinor, memo: baseMemo, movementType: mv.movementType },
        );
        break;

      case 'completion':
        entries.push(
          { accountId: accountMap.finishedGoods, debitMinor: mv.costMinor, creditMinor: 0, memo: baseMemo, movementType: mv.movementType },
          { accountId: wipAccountId, debitMinor: 0, creditMinor: mv.costMinor, memo: baseMemo, movementType: mv.movementType },
        );
        break;

      case 'scrap':
        entries.push(
          { accountId: accountMap.scrapExpense, debitMinor: mv.costMinor, creditMinor: 0, memo: baseMemo, movementType: mv.movementType },
          { accountId: wipAccountId, debitMinor: 0, creditMinor: mv.costMinor, memo: baseMemo, movementType: mv.movementType },
        );
        break;
    }
  }

  return {
    workOrderId,
    companyId,
    wipAccountId,
    entries,
  };
}
