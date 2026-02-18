import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface POSTransaction {
  id: string;
  outletId: string;
  terminalId: string;
  transactionDate: Date;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_PAY' | 'GIFT_CARD';
  employeeId: string;
}

export async function createTransaction(
  db: NeonHttpDatabase,
  data: Omit<POSTransaction, 'id' | 'transactionDate'>,
): Promise<POSTransaction> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getTransactions(
  db: NeonHttpDatabase,
  outletId: string,
  dateFrom: Date,
  dateTo: Date,
): Promise<POSTransaction[]> {
  // TODO: Query database with filters
  throw new Error('Database integration pending');
}

export function calculateTransactionSummary(
  transactions: POSTransaction[],
): {
  totalSales: number;
  transactionCount: number;
  avgTicket: number;
  itemsSold: number;
  byPaymentMethod: Record<string, { count: number; amount: number }>;
} {
  const summary = {
    totalSales: 0,
    transactionCount: transactions.length,
    avgTicket: 0,
    itemsSold: 0,
    byPaymentMethod: {} as Record<string, { count: number; amount: number }>,
  };

  for (const txn of transactions) {
    summary.totalSales += txn.total;
    summary.itemsSold += txn.items.reduce((sum, item) => sum + item.quantity, 0);

    if (!summary.byPaymentMethod[txn.paymentMethod]) {
      summary.byPaymentMethod[txn.paymentMethod] = { count: 0, amount: 0 };
    }
    summary.byPaymentMethod[txn.paymentMethod].count++;
    summary.byPaymentMethod[txn.paymentMethod].amount += txn.total;
  }

  summary.avgTicket =
    summary.transactionCount > 0 ? summary.totalSales / summary.transactionCount : 0;

  return summary;
}

export function analyzeProductMix(
  transactions: POSTransaction[],
): Array<{
  productId: string;
  quantity: number;
  revenue: number;
  revenuePercentage: number;
}> {
  const productStats = new Map<string, { quantity: number; revenue: number }>();

  let totalRevenue = 0;

  for (const txn of transactions) {
    for (const item of txn.items) {
      const current = productStats.get(item.productId) || { quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.total;
      productStats.set(item.productId, current);
      totalRevenue += item.total;
    }
  }

  return Array.from(productStats.entries())
    .map(([productId, stats]) => ({
      productId,
      quantity: stats.quantity,
      revenue: stats.revenue,
      revenuePercentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function detectAnomalies(
  transactions: POSTransaction[],
): Array<{
  transactionId: string;
  anomalyType: 'LARGE_DISCOUNT' | 'VOID_PATTERN' | 'OFF_HOURS' | 'HIGH_VALUE';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}> {
  const anomalies: Array<{
    transactionId: string;
    anomalyType: 'LARGE_DISCOUNT' | 'VOID_PATTERN' | 'OFF_HOURS' | 'HIGH_VALUE';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  }> = [];

  for (const txn of transactions) {
    // Check for large discounts
    const totalDiscount = txn.items.reduce((sum, item) => sum + item.discount, 0);
    const discountPercentage = txn.subtotal > 0 ? (totalDiscount / txn.subtotal) * 100 : 0;

    if (discountPercentage > 50) {
      anomalies.push({
        transactionId: txn.id,
        anomalyType: 'LARGE_DISCOUNT',
        severity: 'HIGH',
        description: `Discount ${discountPercentage.toFixed(1)}% exceeds threshold`,
      });
    } else if (discountPercentage > 30) {
      anomalies.push({
        transactionId: txn.id,
        anomalyType: 'LARGE_DISCOUNT',
        severity: 'MEDIUM',
        description: `Elevated discount percentage: ${discountPercentage.toFixed(1)}%`,
      });
    }

    // Check for high-value transactions
    if (txn.total > 1000) {
      anomalies.push({
        transactionId: txn.id,
        anomalyType: 'HIGH_VALUE',
        severity: txn.total > 5000 ? 'HIGH' : 'MEDIUM',
        description: `High-value transaction: $${txn.total.toFixed(2)}`,
      });
    }

    // Check for off-hours transactions (simplified)
    const hour = txn.transactionDate.getHours();
    if (hour < 6 || hour > 23) {
      anomalies.push({
        transactionId: txn.id,
        anomalyType: 'OFF_HOURS',
        severity: 'LOW',
        description: `Transaction during off-hours: ${hour}:00`,
      });
    }
  }

  return anomalies;
}
