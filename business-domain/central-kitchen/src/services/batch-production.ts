import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ProductionBatch {
  id: string;
  kitchenId: string;
  recipeId: string;
  batchNumber: string;
  plannedQuantity: number;
  actualQuantity: number;
  productionDate: Date;
  expiryDate: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  yieldPercentage: number;
}

export async function scheduleBatch(
  db: NeonHttpDatabase,
  data: Omit<ProductionBatch, 'id' | 'status' | 'actualQuantity' | 'yieldPercentage'>,
): Promise<ProductionBatch> {
  // TODO: Insert into database with SCHEDULED status
  throw new Error('Database integration pending');
}

export async function completeBatch(
  db: NeonHttpDatabase,
  batchId: string,
  actualQuantity: number,
): Promise<ProductionBatch> {
  // TODO: Update batch with actual quantity and calculate yield
  // yield = (actualQuantity / plannedQuantity) * 100
  throw new Error('Database integration pending');
}

export function calculateIngredientRequirements(
  recipe: Array<{ ingredient: string; quantity: number; unit: string }>,
  targetQuantity: number,
  recipeYield: number,
): Array<{ ingredient: string; required: number; unit: string }> {
  const scaleFactor = targetQuantity / recipeYield;

  return recipe.map((item) => ({
    ingredient: item.ingredient,
    required: item.quantity * scaleFactor,
    unit: item.unit,
  }));
}

export function optimizeBatchSchedule(
  orders: Array<{ outlet: string; quantity: number; deliveryDate: Date }>,
  productionCapacity: number,
  shelfLife: number, // days
): Array<{
  batchDate: Date;
  quantity: number;
  deliveries: Array<{ outlet: string; quantity: number }>;
}> {
  // Group orders by delivery window
  const batches: Array<{
    batchDate: Date;
    quantity: number;
    deliveries: Array<{ outlet: string; quantity: number }>;
  }> = [];

  const sortedOrders = [...orders].sort(
    (a, b) => a.deliveryDate.getTime() - b.deliveryDate.getTime(),
  );

  let currentBatch: typeof batches[0] | null = null;

  for (const order of sortedOrders) {
    const productionDate = new Date(order.deliveryDate);
    productionDate.setDate(productionDate.getDate() - 1); // Produce day before delivery

    if (!currentBatch || currentBatch.quantity + order.quantity > productionCapacity) {
      // Start new batch
      currentBatch = {
        batchDate: productionDate,
        quantity: order.quantity,
        deliveries: [{ outlet: order.outlet, quantity: order.quantity }],
      };
      batches.push(currentBatch);
    } else {
      // Add to current batch
      currentBatch.quantity += order.quantity;
      currentBatch.deliveries.push({ outlet: order.outlet, quantity: order.quantity });
    }
  }

  return batches;
}
