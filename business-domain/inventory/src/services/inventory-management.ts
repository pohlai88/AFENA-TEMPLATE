import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface InventoryItem {
  id: string;
  orgId: string;
  itemNumber: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  quantityOnHand: number;
  quantityAvailable: number;
  quantityReserved: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'AVERAGE' | 'STANDARD';
}

export interface InventoryTransaction {
  id: string;
  orgId: string;
  itemId: string;
  transactionDate: Date;
  transactionType: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitCost: number;
  totalCost: number;
  locationId: string;
  referenceType?: string;
  referenceId?: string;
}

export async function createInventoryItem(
  db: NeonHttpDatabase,
  data: Omit<InventoryItem, 'id' | 'quantityOnHand' | 'quantityAvailable' | 'quantityReserved'>,
): Promise<InventoryItem> {
  // TODO: Insert into database with zero quantities
  throw new Error('Database integration pending');
}

export async function recordTransaction(
  db: NeonHttpDatabase,
  data: Omit<InventoryTransaction, 'id'>,
): Promise<InventoryTransaction> {
  // TODO: Insert transaction and update item quantities
  throw new Error('Database integration pending');
}

export async function getItemsToReorder(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<InventoryItem[]> {
  // TODO: Query items where quantityAvailable <= reorderPoint
  throw new Error('Database integration pending');
}

export function calculateInventoryValue(
  transactions: InventoryTransaction[],
  method: 'FIFO' | 'LIFO' | 'AVERAGE',
): { quantityOnHand: number; totalValue: number; averageCost: number } {
  let quantityOnHand = 0;
  let totalValue = 0;

  if (method === 'AVERAGE') {
    let totalCost = 0;
    let totalQty = 0;

    for (const txn of transactions) {
      if (txn.transactionType === 'RECEIPT') {
        totalCost += txn.totalCost;
        totalQty += txn.quantity;
        quantityOnHand += txn.quantity;
      } else if (txn.transactionType === 'ISSUE') {
        quantityOnHand -= txn.quantity;
      }
    }

    const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
    totalValue = quantityOnHand * avgCost;

    return { quantityOnHand, totalValue, averageCost: avgCost };
  }

  // FIFO/LIFO logic would be more complex
  return { quantityOnHand: 0, totalValue: 0, averageCost: 0 };
}

export function identifySlowMovingItems(
  items: Array<InventoryItem & { lastTransactionDate: Date }>,
  thresholdDays: number = 90,
): Array<{ item: InventoryItem; daysInactive: number; value: number }> {
  const now = Date.now();

  return items
    .map((item) => {
      const daysInactive = Math.floor(
        (now - item.lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        item,
        daysInactive,
        value: item.quantityOnHand * item.unitCost,
      };
    })
    .filter((x) => x.daysInactive > thresholdDays)
    .sort((a, b) => b.value - a.value);
}

export function calculateTurnoverRatio(
  costOfGoodsSold: number,
  averageInventoryValue: number,
): number {
  return averageInventoryValue > 0 ? costOfGoodsSold / averageInventoryValue : 0;
}
