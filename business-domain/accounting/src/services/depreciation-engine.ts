import { and, eq, assets, depreciationSchedules, sql } from 'afenda-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Depreciation calculation result for a single period.
 */
export interface DepreciationPeriodResult {
  periodIndex: number;
  depreciationMinor: number;
  accumDepreciationMinor: number;
  bookValueMinor: number;
}

/**
 * Full depreciation schedule for an asset.
 */
export interface DepreciationScheduleResult {
  assetId: string;
  method: string;
  totalPeriods: number;
  periods: DepreciationPeriodResult[];
}

/**
 * Calculate straight-line depreciation for one period.
 *
 * Formula: (cost - residual) / useful_life_months
 * Last period absorbs rounding remainder.
 */
function straightLineDepreciation(
  costMinor: number,
  residualMinor: number,
  usefulLifeMonths: number,
  periodIndex: number,
  priorAccumMinor: number,
): number {
  const depreciableBase = costMinor - residualMinor;
  const perPeriod = Math.floor(depreciableBase / usefulLifeMonths);

  // Last period absorbs rounding remainder
  if (periodIndex === usefulLifeMonths - 1) {
    return depreciableBase - priorAccumMinor;
  }

  return perPeriod;
}

/**
 * Calculate declining-balance depreciation for one period.
 *
 * Formula: book_value * (2 / useful_life_months)
 * Switches to straight-line when SL > DB for remaining periods.
 * Never depreciates below residual value.
 */
function decliningBalanceDepreciation(
  costMinor: number,
  residualMinor: number,
  usefulLifeMonths: number,
  periodIndex: number,
  priorAccumMinor: number,
): number {
  const bookValue = costMinor - priorAccumMinor;
  const remainingPeriods = usefulLifeMonths - periodIndex;

  if (remainingPeriods <= 0 || bookValue <= residualMinor) return 0;

  const dbRate = 2 / usefulLifeMonths;
  const dbAmount = Math.floor(bookValue * dbRate);

  // Straight-line for remaining periods
  const slAmount = Math.floor((bookValue - residualMinor) / remainingPeriods);

  // Use the higher of DB or SL (switch point)
  const depreciation = Math.max(dbAmount, slAmount);

  // Never depreciate below residual
  return Math.min(depreciation, bookValue - residualMinor);
}

/**
 * Generate a full depreciation schedule for an asset.
 *
 * PRD G0.20 + Phase E #20:
 * - Supports straight_line and declining_balance methods
 * - All amounts in minor units (integer, no floats)
 * - Deterministic: same inputs always produce same schedule
 * - Last period absorbs rounding remainder (no penny drift)
 *
 * @param costMinor - Acquisition cost in minor units
 * @param residualMinor - Residual/salvage value in minor units
 * @param usefulLifeMonths - Useful life in months
 * @param method - Depreciation method
 */
export function generateDepreciationSchedule(
  costMinor: number,
  residualMinor: number,
  usefulLifeMonths: number,
  method: 'straight_line' | 'declining_balance' = 'straight_line',
): DepreciationScheduleResult {
  const periods: DepreciationPeriodResult[] = [];
  let accumMinor = 0;

  for (let i = 0; i < usefulLifeMonths; i++) {
    let depreciationMinor: number;

    switch (method) {
      case 'declining_balance':
        depreciationMinor = decliningBalanceDepreciation(
          costMinor,
          residualMinor,
          usefulLifeMonths,
          i,
          accumMinor,
        );
        break;
      case 'straight_line':
      default:
        depreciationMinor = straightLineDepreciation(
          costMinor,
          residualMinor,
          usefulLifeMonths,
          i,
          accumMinor,
        );
        break;
    }

    if (depreciationMinor <= 0) break;

    accumMinor += depreciationMinor;
    const bookValueMinor = costMinor - accumMinor;

    periods.push({
      periodIndex: i,
      depreciationMinor,
      accumDepreciationMinor: accumMinor,
      bookValueMinor,
    });

    if (bookValueMinor <= residualMinor) break;
  }

  return {
    assetId: '',
    method,
    totalPeriods: periods.length,
    periods,
  };
}

/**
 * Calculate and persist depreciation for one fiscal period.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param assetId - Asset UUID
 * @param fiscalPeriodId - Fiscal period UUID
 */
export async function calculateDepreciation(
  tx: NeonHttpDatabase,
  orgId: string,
  assetId: string,
  fiscalPeriodId: string,
): Promise<DepreciationPeriodResult | null> {
  // 1. Load asset
  const [asset] = await (tx as any)
    .select({
      id: assets.id,
      acquisitionCostMinor: assets.acquisitionCostMinor,
      residualValueMinor: assets.residualValueMinor,
      usefulLifeMonths: assets.usefulLifeMonths,
      depreciationMethod: assets.depreciationMethod,
      status: assets.status,
    })
    .from(assets)
    .where(
      and(
        eq(assets.orgId, orgId),
        eq(assets.id, assetId),
      ),
    );

  if (asset?.status !== 'in_service') return null;
  if (asset.depreciationMethod === 'none') return null;

  // 2. Get prior accumulated depreciation
  const [prior] = await (tx as any)
    .select({
      accumMinor: sql<number>`COALESCE(MAX(${depreciationSchedules.accumDepreciationMinor}), 0)`,
      periodCount: sql<number>`COUNT(*)`,
    })
    .from(depreciationSchedules)
    .where(
      and(
        eq(depreciationSchedules.orgId, orgId),
        eq(depreciationSchedules.assetId, assetId),
      ),
    );

  const priorAccum = Number(prior.accumMinor);
  const periodIndex = Number(prior.periodCount);

  // 3. Calculate this period's depreciation
  let depreciationMinor: number;
  const method = asset.depreciationMethod as 'straight_line' | 'declining_balance';

  const usefulLifeMonths = Number(asset.usefulLifeMonths);
  switch (method) {
    case 'declining_balance':
      depreciationMinor = decliningBalanceDepreciation(
        Number(asset.acquisitionCostMinor),
        Number(asset.residualValueMinor),
        usefulLifeMonths,
        periodIndex,
        priorAccum,
      );
      break;
    case 'straight_line':
    default:
      depreciationMinor = straightLineDepreciation(
        Number(asset.acquisitionCostMinor),
        Number(asset.residualValueMinor),
        usefulLifeMonths,
        periodIndex,
        priorAccum,
      );
      break;
  }

  if (depreciationMinor <= 0) return null;

  const accumDepreciationMinor = priorAccum + depreciationMinor;
  const bookValueMinor = Number(asset.acquisitionCostMinor) - accumDepreciationMinor;

  // 4. Persist schedule entry
  await (tx as any)
    .insert(depreciationSchedules)
    .values({
      orgId,
      assetId,
      fiscalPeriodId,
      depreciationMinor,
      accumDepreciationMinor,
      bookValueMinor,
    });

  return {
    periodIndex,
    depreciationMinor,
    accumDepreciationMinor,
    bookValueMinor,
  };
}
