import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Asset {
  id: string;
  orgId: string;
  assetId: string;
  assetClass: 'EQUIPMENT' | 'PROPERTY' | 'VEHICLE' | 'INVESTMENT' | 'INTELLECTUAL_PROPERTY';
  description: string;
  serialNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  status: 'IN_USE' | 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED' | 'SOLD';
  locationId?: string;
  assignedTo?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  maintenanceDate: Date;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION';
  description: string;
  cost: number;
  performedBy: string;
  nextMaintenanceDate?: Date;
}

export async function registerAsset(
  db: NeonHttpDatabase,
  data: Omit<Asset, 'id' | 'currentValue' | 'status'>,
): Promise<Asset> {
  // TODO: Insert asset with purchasePrice as currentValue and IN_USE status
  throw new Error('Database integration pending');
}

export async function updateAssetValue(
  db: NeonHttpDatabase,
  assetId: string,
  newValue: number,
  valuationDate: Date,
): Promise<Asset> {
  // TODO: Update asset current value
  throw new Error('Database integration pending');
}

export async function recordMaintenance(
  db: NeonHttpDatabase,
  data: Omit<MaintenanceRecord, 'id'>,
): Promise<MaintenanceRecord> {
  // TODO: Insert maintenance record
  throw new Error('Database integration pending');
}

export async function getMaintenanceDue(
  db: NeonHttpDatabase,
  orgId: string,
  daysAhead: number = 30,
): Promise<Array<Asset & { nextMaintenanceDate: Date }>> {
  // TODO: Query assets with maintenance due
  throw new Error('Database integration pending');
}

export function calculateTotalCostOfOwnership(
  asset: Asset,
  maintenanceRecords: MaintenanceRecord[],
  operatingCosts: number,
): {
  purchasePrice: number;
  maintenanceCost: number;
  operatingCost: number;
  totalCost: number;
  costPerYear: number;
} {
  const maintenanceCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
  const totalCost = asset.purchasePrice + maintenanceCost + operatingCosts;
  
  const yearsOwned = Math.max(1, (Date.now() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  const costPerYear = totalCost / yearsOwned;

  return {
    purchasePrice: asset.purchasePrice,
    maintenanceCost,
    operatingCost: operatingCosts,
    totalCost,
    costPerYear,
  };
}

export function assessAssetCondition(
  asset: Asset,
  maintenanceRecords: MaintenanceRecord[],
): { condition: Asset['condition']; recommendedAction: string } {
  const lastMaintenance = maintenanceRecords
    .sort((a, b) => b.maintenanceDate.getTime() - a.maintenanceDate.getTime())[0];

  if (!lastMaintenance) {
    return {
      condition: asset.condition,
      recommendedAction: 'Schedule initial inspection',
    };
  }

  const daysSinceLastMaintenance = Math.floor(
    (Date.now() - lastMaintenance.maintenanceDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastMaintenance > 365) {
    return {
      condition: 'FAIR',
      recommendedAction: 'Overdue for maintenance - schedule immediately',
    };
  }

  return {
    condition: asset.condition,
    recommendedAction: 'Continue regular maintenance schedule',
  };
}

export function calculateDepreciation(
  purchasePrice: number,
  currentValue: number,
  yearsOwned: number,
): { totalDepreciation: number; annualDepreciation: number; depreciationRate: number } {
  const totalDepreciation = purchasePrice - currentValue;
  const annualDepreciation = yearsOwned > 0 ? totalDepreciation / yearsOwned : 0;
  const depreciationRate = purchasePrice > 0 ? (totalDepreciation / purchasePrice) * 100 : 0;

  return { totalDepreciation, annualDepreciation, depreciationRate };
}
