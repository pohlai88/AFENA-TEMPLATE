import { landedCostAllocations } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Receipt line input for landed cost allocation.
 */
export interface ReceiptLineInput {
  receiptLineId: string;
  qty: number;
  valueMinor: number;
  weightKg?: number;
}

/**
 * Allocation result for a single receipt line.
 */
export interface LandedCostLineAllocation {
  receiptLineId: string;
  allocatedCostMinor: number;
  baseAllocatedCostMinor: number;
}

/**
 * Full allocation result.
 */
export interface LandedCostAllocationResult {
  landedCostDocId: string;
  method: string;
  totalAllocated: number;
  lines: LandedCostLineAllocation[];
}

/**
 * Allocate landed cost across receipt lines by quantity.
 *
 * Distributes cost proportionally by qty. Last line absorbs rounding remainder.
 */
function allocateByQty(
  totalCostMinor: number,
  lines: ReceiptLineInput[],
): Map<string, number> {
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  if (totalQty === 0) return new Map();

  const result = new Map<string, number>();
  let allocated = 0;

  for (const [i, line] of lines.entries()) {
    const isLast = i === lines.length - 1;
    const amount = isLast
      ? totalCostMinor - allocated
      : Math.floor((totalCostMinor * line.qty) / totalQty);

    result.set(line.receiptLineId, amount);
    allocated += amount;
  }

  return result;
}

/**
 * Allocate landed cost across receipt lines by value.
 *
 * Distributes cost proportionally by line value. Last line absorbs rounding remainder.
 */
function allocateByValue(
  totalCostMinor: number,
  lines: ReceiptLineInput[],
): Map<string, number> {
  const totalValue = lines.reduce((sum, l) => sum + l.valueMinor, 0);
  if (totalValue === 0) return new Map();

  const result = new Map<string, number>();
  let allocated = 0;

  for (const [i, line] of lines.entries()) {
    const isLast = i === lines.length - 1;
    const amount = isLast
      ? totalCostMinor - allocated
      : Math.floor((totalCostMinor * line.valueMinor) / totalValue);

    result.set(line.receiptLineId, amount);
    allocated += amount;
  }

  return result;
}

/**
 * Allocate landed cost across receipt lines by weight.
 *
 * Distributes cost proportionally by weight. Last line absorbs rounding remainder.
 */
function allocateByWeight(
  totalCostMinor: number,
  lines: ReceiptLineInput[],
): Map<string, number> {
  const totalWeight = lines.reduce((sum, l) => sum + (l.weightKg ?? 0), 0);
  if (totalWeight === 0) return new Map();

  const result = new Map<string, number>();
  let allocated = 0;

  for (const [i, line] of lines.entries()) {
    const isLast = i === lines.length - 1;
    const weight = line.weightKg ?? 0;
    const amount = isLast
      ? totalCostMinor - allocated
      : Math.floor((totalCostMinor * weight) / totalWeight);

    result.set(line.receiptLineId, amount);
    allocated += amount;
  }

  return result;
}

/**
 * Allocate landed cost to receipt lines and persist allocation rows.
 *
 * PRD G0.13 + Phase E #24:
 * - Allocation methods: qty, value, weight
 * - All amounts in minor units (integer, no floats)
 * - Last line absorbs rounding remainder (no penny drift)
 * - Deterministic: same inputs always produce same allocation
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param landedCostDocId - Landed cost document UUID
 * @param totalCostMinor - Total cost to allocate (in minor units)
 * @param method - Allocation method
 * @param lines - Receipt lines to allocate across
 * @param currencyCode - Currency code
 * @param fxRate - FX rate for base amount calculation (1.0 if same currency)
 */
export async function allocateLandedCost(
  tx: NeonHttpDatabase,
  orgId: string,
  landedCostDocId: string,
  totalCostMinor: number,
  method: 'qty' | 'value' | 'weight',
  lines: ReceiptLineInput[],
  currencyCode: string = 'MYR',
  fxRate: number = 1,
): Promise<LandedCostAllocationResult> {
  if (lines.length === 0) {
    return { landedCostDocId, method, totalAllocated: 0, lines: [] };
  }

  // Calculate allocation per line
  let allocationMap: Map<string, number>;
  switch (method) {
    case 'value':
      allocationMap = allocateByValue(totalCostMinor, lines);
      break;
    case 'weight':
      allocationMap = allocateByWeight(totalCostMinor, lines);
      break;
    case 'qty':
    default:
      allocationMap = allocateByQty(totalCostMinor, lines);
      break;
  }

  // Persist allocation rows (batch — DEV-3 bulk insert optimization)
  const entries = [...allocationMap.entries()].filter(([, amt]) => amt > 0);
  const resultLines: LandedCostLineAllocation[] = [];

  if (entries.length > 0) {
    const batch = entries.map(([receiptLineId, allocatedCostMinor]) => {
      const baseAllocatedCostMinor = Math.round(allocatedCostMinor * fxRate);
      resultLines.push({ receiptLineId, allocatedCostMinor, baseAllocatedCostMinor });
      return {
        orgId,
        landedCostDocId,
        receiptLineId,
        allocationMethod: method,
        allocatedCostMinor,
        currencyCode,
        baseAllocatedCostMinor,
      };
    });
    await (tx as any).insert(landedCostAllocations).values(batch);
  }

  const totalAllocated = resultLines.reduce((sum, l) => sum + l.allocatedCostMinor, 0);

  return {
    landedCostDocId,
    method,
    totalAllocated,
    lines: resultLines,
  };
}
