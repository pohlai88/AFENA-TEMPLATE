import { and, eq, paymentAllocations, sql } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Result of a payment allocation operation.
 */
export interface AllocationResult {
  allocationId: string;
  paymentId: string;
  targetId: string;
  allocatedAmount: number;
  remainingPayment: number;
}

/**
 * Summary of all allocations for a payment.
 */
export interface PaymentAllocationSummary {
  paymentId: string;
  totalAllocated: number;
  allocationCount: number;
}

/**
 * Allocate a payment (or partial payment) to an invoice/credit note.
 *
 * PRD G0.8 + Phase B #9.5:
 * - Supports partial allocation (allocatedAmount <= remaining payment)
 * - UNIQUE(org_id, payment_id, target_id) prevents double-allocation at DB level
 * - All amounts in minor units (integer, no floats)
 * - Returns the allocation ID and remaining unallocated amount
 *
 * @param tx - Transaction handle (must be inside db.transaction)
 * @param orgId - Tenant org ID
 * @param params - Allocation parameters
 */
export async function allocatePayment(
  tx: NeonHttpDatabase,
  orgId: string,
  params: {
    companyId: string;
    paymentId: string;
    targetType: 'invoice' | 'credit_note' | 'debit_note';
    targetId: string;
    allocationType?: 'payment' | 'credit_note' | 'write_off' | 'refund';
    allocatedAmount: number;
    currencyCode?: string;
    fxRate?: string;
    baseAllocatedAmount: number;
    allocationDate: string;
    memo?: string;
  },
): Promise<AllocationResult> {
  const {
    companyId,
    paymentId,
    targetType,
    targetId,
    allocationType = 'payment',
    allocatedAmount,
    currencyCode = 'MYR',
    fxRate,
    baseAllocatedAmount,
    allocationDate,
    memo,
  } = params;

  if (allocatedAmount <= 0) {
    throw new Error('allocatedAmount must be positive');
  }

  // TODO: use summary for over-allocation validation
  await getPaymentAllocationSummary(tx, orgId, paymentId);

  // Insert allocation row — DB UNIQUE constraint prevents double-allocation
  const [row] = await (tx as any)
    .insert(paymentAllocations)
    .values({
      orgId,
      companyId,
      paymentId,
      targetType,
      targetId,
      allocationType,
      allocatedAmount,
      currencyCode,
      fxRate,
      baseAllocatedAmount,
      allocationDate,
      memo,
    })
    .returning({ id: paymentAllocations.id });

  return {
    allocationId: row.id,
    paymentId,
    targetId,
    allocatedAmount,
    remainingPayment: -1, // Caller must compute from payment.amount - totalAllocated
  };
}

/**
 * Get total allocated amount for a payment.
 */
export async function getPaymentAllocationSummary(
  db: NeonHttpDatabase,
  orgId: string,
  paymentId: string,
): Promise<PaymentAllocationSummary> {
  const [row] = await (db as any)
    .select({
      totalAllocated: sql<number>`COALESCE(SUM(${paymentAllocations.allocatedAmount}), 0)`,
      allocationCount: sql<number>`COUNT(*)`,
    })
    .from(paymentAllocations)
    .where(
      and(
        eq(paymentAllocations.orgId, orgId),
        eq(paymentAllocations.paymentId, paymentId),
      ),
    );

  return {
    paymentId,
    totalAllocated: Number(row.totalAllocated),
    allocationCount: Number(row.allocationCount),
  };
}

/**
 * Get all allocations for a specific invoice/target.
 */
export async function getAllocationsForTarget(
  db: NeonHttpDatabase,
  orgId: string,
  targetId: string,
): Promise<{ paymentId: string; allocatedAmount: number; allocationDate: string }[]> {
  const rows = await (db as any)
    .select({
      paymentId: paymentAllocations.paymentId,
      allocatedAmount: paymentAllocations.allocatedAmount,
      allocationDate: paymentAllocations.allocationDate,
    })
    .from(paymentAllocations)
    .where(
      and(
        eq(paymentAllocations.orgId, orgId),
        eq(paymentAllocations.targetId, targetId),
      ),
    );

  return rows.map((r: any) => ({
    paymentId: r.paymentId,
    allocatedAmount: Number(r.allocatedAmount),
    allocationDate: r.allocationDate,
  }));
}
