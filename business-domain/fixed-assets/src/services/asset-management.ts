import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface FixedAsset {
  id: string;
  orgId: string;
  assetNumber: string;
  description: string;
  category: 'BUILDING' | 'EQUIPMENT' | 'VEHICLE' | 'FURNITURE' | 'COMPUTER' | 'SOFTWARE';
  acquisitionDate: Date;
  acquisitionCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';
  status: 'ACTIVE' | 'DISPOSED' | 'FULLY_DEPRECIATED';
  locationId?: string;
  departmentId?: string;
}

export interface DepreciationSchedule {
  assetId: string;
  fiscalYear: number;
  period: string; // YYYY-MM
  depreciationExpense: number;
  accumulatedDepreciation: number;
  netBookValue: number;
}

export async function createAsset(
  db: NeonHttpDatabase,
  data: Omit<FixedAsset, 'id' | 'status'>,
): Promise<FixedAsset> {
  // TODO: Insert asset with ACTIVE status
  throw new Error('Database integration pending');
}

export async function disposeAsset(
  db: NeonHttpDatabase,
  assetId: string,
  disposalDate: Date,
  disposalAmount: number,
): Promise<{ asset: FixedAsset; gainLoss: number }> {
  // TODO: Update asset status and calculate gain/loss
  throw new Error('Database integration pending');
}

export async function generateDepreciationSchedule(
  db: NeonHttpDatabase,
  assetId: string,
): Promise<DepreciationSchedule[]> {
  // TODO: Generate depreciation schedule
  throw new Error('Database integration pending');
}

export function calculateStraightLineDepreciation(
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  periodsPerYear: number = 12,
): { annualDepreciation: number; periodicDepreciation: number } {
  const depreciableAmount = acquisitionCost - salvageValue;
  const annualDepreciation = depreciableAmount / usefulLifeYears;
  const periodicDepreciation = annualDepreciation / periodsPerYear;

  return { annualDepreciation, periodicDepreciation };
}

export function calculateDecliningBalanceDepreciation(
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  rate: number = 2, // Double declining = 2
  currentYear: number,
  accumulatedDepreciation: number = 0,
): number {
  const depreciationRate = rate / usefulLifeYears;
  const netBookValue = acquisitionCost - accumulatedDepreciation;
  
  let depreciation = netBookValue * depreciationRate;
  
  // Don't depreciate below salvage value
  if (netBookValue - depreciation < salvageValue) {
    depreciation = netBookValue - salvageValue;
  }

  return Math.max(0, depreciation);
}

export function buildDepreciationSchedule(
  asset: FixedAsset,
  startDate: Date,
): DepreciationSchedule[] {
  const schedule: DepreciationSchedule[] = [];
  const { periodicDepreciation } = calculateStraightLineDepreciation(
    asset.acquisitionCost,
    asset.salvageValue,
    asset.usefulLifeYears,
    12,
  );

  let accumulated = 0;
  const totalPeriods = asset.usefulLifeYears * 12;

  for (let i = 0; i < totalPeriods; i++) {
    const periodDate = new Date(startDate);
    periodDate.setMonth(periodDate.getMonth() + i);

    accumulated += periodicDepreciation;
    const nbv = asset.acquisitionCost - accumulated;

    schedule.push({
      assetId: asset.id,
      fiscalYear: periodDate.getFullYear(),
      period: `${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}`,
      depreciationExpense: periodicDepreciation,
      accumulatedDepreciation: accumulated,
      netBookValue: Math.max(nbv, asset.salvageValue),
    });
  }

  return schedule;
}

export function calculateAssetTurnover(
  revenue: number,
  averageFixedAssets: number,
): number {
  return averageFixedAssets > 0 ? revenue / averageFixedAssets : 0;
}
