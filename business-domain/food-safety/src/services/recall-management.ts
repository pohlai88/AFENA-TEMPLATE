import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Recall {
  id: string;
  lotNumbers: string[];
  productName: string;
  reason: string;
  severity: 'CLASS_I' | 'CLASS_II' | 'CLASS_III'; // FDA classification
  initiatedDate: Date;
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED';
  affectedCustomers: number;
  recoveredQuantity: number;
  totalQuantity: number;
}

export async function initiateRecall(
  db: NeonHttpDatabase,
  data: Omit<Recall, 'id' | 'status' | 'initiatedDate'>,
): Promise<Recall> {
  // TODO: Insert into database with INITIATED status
  throw new Error('Database integration pending');
}

export async function getActiveRecalls(
  db: NeonHttpDatabase,
): Promise<Recall[]> {
  // TODO: Query recalls with status != COMPLETED
  throw new Error('Database integration pending');
}

export async function identifyAffectedProducts(
  db: NeonHttpDatabase,
  lotNumbers: string[],
): Promise<Array<{ productId: string; quantity: number; locations: string[] }>> {
  // TODO: Query inventory and shipments for affected lots
  throw new Error('Database integration pending');
}

export function calculateRecallEffectiveness(recall: Recall): {
  effectiveness: number;
  recoveryRate: number;
  classification: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE';
} {
  const recoveryRate = recall.totalQuantity > 0 
    ? (recall.recoveredQuantity / recall.totalQuantity) * 100 
    : 0;

  let effectiveness = recoveryRate;
  
  // Adjust based on severity and speed
  if (recall.severity === 'CLASS_I') {
    effectiveness *= 1.2; // Higher weight for Class I recalls
  }

  const classification: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' =
    effectiveness >= 95 ? 'EFFECTIVE' :
    effectiveness >= 75 ? 'PARTIALLY_EFFECTIVE' :
    'INEFFECTIVE';

  return { effectiveness: Math.min(100, effectiveness), recoveryRate, classification };
}

export function generateRecallNotification(recall: Recall): {
  subject: string;
  body: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  const urgency = recall.severity === 'CLASS_I' ? 'HIGH' : 
                  recall.severity === 'CLASS_II' ? 'MEDIUM' : 'LOW';

  return {
    subject: `URGENT: Product Recall - ${recall.productName}`,
    body: `A ${recall.severity} recall has been initiated for ${recall.productName}.\n\nLot Numbers: ${recall.lotNumbers.join(', ')}\nReason: ${recall.reason}\n\nPlease remove all affected products immediately.`,
    urgency,
  };
}
