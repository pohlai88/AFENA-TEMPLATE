import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TraceabilityRecord {
  id: string;
  lotNumber: string;
  productId: string;
  supplierId: string;
  receivedDate: Date;
  expiryDate: Date;
  quantity: number;
  unit: string;
  storageLocation: string;
  status: 'RECEIVED' | 'IN_STORAGE' | 'IN_PRODUCTION' | 'SHIPPED' | 'RECALLED';
}

export async function createTraceabilityRecord(
  db: NeonHttpDatabase,
  data: Omit<TraceabilityRecord, 'id'>,
): Promise<TraceabilityRecord> {
  //  TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function traceLotUpstream(
  db: NeonHttpDatabase,
  lotNumber: string,
): Promise<Array<{ supplier: string; receivedDate: Date; sourceDocument: string }>> {
  // TODO: Query traceability chain backwards to supplier
  throw new Error('Database integration pending');
}

export async function traceLotDownstream(
  db: NeonHttpDatabase,
  lotNumber: string,
): Promise<Array<{ customer: string; shippedDate: Date; invoice: string }>> {
  // TODO: Query traceability chain forwards to customers
  throw new Error('Database integration pending');
}

export function generateLotNumber(
  productCode: string,
  productionDate: Date,
): string {
  const dateStr = productionDate.toISOString().split('T')[0].replace(/-/g, '');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${productCode}-${dateStr}-${randomSuffix}`;
}

export function calculateTraceabilityScore(records: TraceabilityRecord[]): {
  score: number;
  completeness: number;
  timeliness: number;
} {
  const complete = records.filter((r) => r.supplierId && r.lotNumber).length;
  const completeness = records.length > 0 ? (complete / records.length) * 100 : 0;

  const timely = records.filter((r) => {
    const daysSinceReceived = (Date.now() - new Date(r.receivedDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceReceived <= 1; // Within 24 hours
  }).length;
  const timeliness = records.length > 0 ? (timely / records.length) * 100 : 0;

  const score = (completeness + timeliness) / 2;

  return { score, completeness, timeliness };
}
