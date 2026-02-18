import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface QualityInspection {
  id: string;
  orgId: string;
  inspectionNumber: string;
  inspectionType: 'INCOMING' | 'IN_PROCESS' | 'FINAL' | 'FIELD';
  inspectionDate: Date;
  inspectorId: string;
  productId?: string;
  batchNumber?: string;
  sampleSize: number;
  passCount: number;
  failCount: number;
  result: 'PASS' | 'FAIL' | 'CONDITIONAL';
  notes?: string;
}

export interface NonConformance {
  id: string;
  orgId: string;
  ncNumber: string;
  inspectionId?: string;
  defectType: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  description: string;
  identifiedDate: Date;
  status: 'OPEN' | 'IN_REVIEW' | 'CORRECTIVE_ACTION' | 'CLOSED';
  assignedTo?: string;
  dueDate?: Date;
  resolution?: string;
  closedDate?: Date;
}

export async function createInspection(
  db: NeonHttpDatabase,
  data: Omit<QualityInspection, 'id' | 'inspectionNumber' | 'result'>,
): Promise<QualityInspection> {
  // TODO: Generate inspection number, calculate result, and insert
  throw new Error('Database integration pending');
}

export async function recordNonConformance(
  db: NeonHttpDatabase,
  data: Omit<NonConformance, 'id' | 'ncNumber' | 'status'>,
): Promise<NonConformance> {
  // TODO: Generate NC number and insert with OPEN status
  throw new Error('Database integration pending');
}

export async function closeNonConformance(
  db: NeonHttpDatabase,
  ncId: string,
  resolution: string,
): Promise<NonConformance> {
  // TODO: Update NC with resolution and CLOSED status
  throw new Error('Database integration pending');
}

export function calculateDefectRate(
  inspections: QualityInspection[],
): { totalInspected: number; totalDefects: number; defectRate: number } {
  let totalInspected = 0;
  let totalDefects = 0;

  for (const inspection of inspections) {
    totalInspected += inspection.sampleSize;
    totalDefects += inspection.failCount;
  }

  const defectRate = totalInspected > 0 ? (totalDefects / totalInspected) * 100 : 0;

  return { totalInspected, totalDefects, defectRate };
}

export function calculateFirstPassYield(
  inspections: QualityInspection[],
): number {
  const totalUnits = inspections.reduce((sum, i) => sum + i.sampleSize, 0);
  const passedUnits = inspections.reduce((sum, i) => sum + i.passCount, 0);

  return totalUnits > 0 ? (passedUnits / totalUnits) * 100 : 0;
}

export function analyzeDefectPatterns(
  nonConformances: NonConformance[],
): Array<{ defectType: string; count: number; percentage: number }> {
  const defectCounts = new Map<string, number>();

  for (const nc of nonConformances) {
    defectCounts.set(nc.defectType, (defectCounts.get(nc.defectType) || 0) + 1);
  }

  const total = nonConformances.length;

  return Array.from(defectCounts.entries())
    .map(([defectType, count]) => ({
      defectType,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateQualityScore(
  defectRate: number,
  firstPassYield: number,
  onTimeDeliveryRate: number,
): number {
  // Weighted quality score
  const defectScore = Math.max(0, 100 - defectRate * 10); // Lower is better
  const fpy Score = firstPassYield; // Higher is better
  const otdScore = onTimeDeliveryRate; // Higher is better

  return (defectScore * 0.4 + fpyScore * 0.4 + otdScore * 0.2);
}
