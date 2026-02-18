import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface LivestockPurchaseOrder {
  id: string;
  supplierId: string;
  species: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  deliveryDate: Date;
  qualitySpecs: {
    minWeight: number;
    maxWeight: number;
    healthCertRequired: boolean;
  };
  status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'REJECTED';
}

export async function createPurchaseOrder(
  db: NeonHttpDatabase,
  data: Omit<LivestockPurchaseOrder, 'id' | 'totalCost' | 'status'>,
): Promise<LivestockPurchaseOrder> {
  // TODO: Calculate total cost and insert into database
  const totalCost = data.quantity * data.unitPrice;
  throw new Error('Database integration pending');
}

export async function receiveLivestock(
  db: NeonHttpDatabase,
  orderId: string,
  actualQuantity: number,
  avgWeight: number,
): Promise<LivestockPurchaseOrder> {
  // TODO: Update order status to RECEIVED
  throw new Error('Database integration pending');
}

export function scoreSupplier(
  orders: LivestockPurchaseOrder[],
  receivedAnimals: Array<{ orderId: string; meetsSpestring; deadOnArrival: number }>,
): {
  qualityScore: number;
  reliabilityScore: number;
  overallScore: number;
  recommendation: 'PREFERRED' | 'APPROVED' | 'MONITOR' | 'AVOID';
} {
  const qualityMet = receivedAnimals.filter((r) => r.meetsSpecs).length;
  const qualityScore = receivedAnimals.length > 0 ? (qualityMet / receivedAnimals.length) * 100 : 0;

  const totalDOA = receivedAnimals.reduce((sum, r) => sum + r.deadOnArrival, 0);
  const totalAnimals = receivedAnimals.reduce(
    (sum, r) => sum + (orders.find((o) => o.id === r.orderId)?.quantity || 0),
    0,
  );
  const mortalityRate = totalAnimals > 0 ? (totalDOA / totalAnimals) * 100 : 0;
  const reliabilityScore = Math.max(0, 100 - mortalityRate * 10);

  const overallScore = (qualityScore + reliabilityScore) / 2;

  let recommendation: 'PREFERRED' | 'APPROVED' | 'MONITOR' | 'AVOID' = 'APPROVED';
  if (overallScore >= 90) recommendation = 'PREFERRED';
  else if (overallScore >= 70) recommendation = 'APPROVED';
  else if (overallScore >= 50) recommendation = 'MONITOR';
  else recommendation = 'AVOID';

  return {
    qualityScore,
    reliabilityScore,
    overallScore,
    recommendation,
  };
}
