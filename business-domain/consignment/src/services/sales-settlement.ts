/**
 * Sales & Settlement Service
 * 
 * Manages sales recording, commission calculation, and periodic settlements.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ConsignmentAgreement } from './agreement-management';

// ============================================================================
// Interfaces
// ============================================================================

export interface ConsignmentSale {
  saleId: string;
  inventoryId: string;
  agreementId: string;
  
  // Transaction
  saleDate: Date;
  quantitySold: number;
  unitPrice: number;
  totalAmount: number;
  
  // Commission calculation
  commissionRate: number;
  commissionAmount: number;
  netToConsignor: number;
  
  // Reference
  invoiceNumber?: string;
  customerId?: string;
  
  status: 'PENDING' | 'SETTLED' | 'DISPUTED';
}

export interface ConsignmentSettlement {
  settlementId: string;
  agreementId: string;
  periodStart: Date;
  periodEnd: Date;
  
  // Summary
  totalSales: number;
  totalCommission: number;
  totalReturns: number;
  adjustments: number;
  netPayable: number;
  currency: string;
  
  // Details
  salesTransactions: string[]; // Sale IDs
  returnTransactions: string[]; // Return IDs
  
  // Payment
  paymentDueDate: Date;
  paymentDate?: Date;
  paymentReference?: string;
  
  status: 'DRAFT' | 'APPROVED' | 'PAID' | 'DISPUTED';
  approvedBy?: string;
  approvedDate?: Date;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function recordConsignmentSale(
  _db: NeonHttpDatabase,
  _orgId: string,
  _sale: Omit<ConsignmentSale, 'saleId' | 'commissionAmount' | 'netToConsignor'>
): Promise<ConsignmentSale> {
  // TODO: Implement with Drizzle ORM - calculate commission
  throw new Error('Not implemented');
}

export async function updateSaleStatus(
  _db: NeonHttpDatabase,
  _orgId: string,
  _saleId: string,
  _status: ConsignmentSale['status']
): Promise<ConsignmentSale> {
  // TODO: Update sale status
  throw new Error('Not implemented');
}

export async function createSettlement(
  _db: NeonHttpDatabase,
  _orgId: string,
  _settlement: Omit<ConsignmentSettlement, 'settlementId'>
): Promise<ConsignmentSettlement> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function approveSettlement(
  _db: NeonHttpDatabase,
  _orgId: string,
  _settlementId: string,
  _approvedBy: string
): Promise<ConsignmentSettlement> {
  // TODO: Approve settlement
  throw new Error('Not implemented');
}

export async function recordSettlementPayment(
  _db: NeonHttpDatabase,
  _orgId: string,
  _settlementId: string,
  _paymentData: {
    paymentDate: Date;
    paymentReference: string;
  }
): Promise<ConsignmentSettlement> {
  // TODO: Record payment and mark settled
  throw new Error('Not implemented');
}

export async function getSalesByPeriod(
  _db: NeonHttpDatabase,
  _orgId: string,
  _agreementId: string,
  _periodStart: Date,
  _periodEnd: Date
): Promise<ConsignmentSale[]> {
  // TODO: Query sales for period
  throw new Error('Not implemented');
}

export async function getUnsettledSales(
  _db: NeonHttpDatabase,
  _orgId: string,
  _agreementId: string
): Promise<ConsignmentSale[]> {
  // TODO: Get sales not yet in settlement
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateCommission(
  saleAmount: number,
  agreement: ConsignmentAgreement,
  quantitySold: number
): { commissionAmount: number; netToConsignor: number } {
  let commissionAmount = 0;

  switch (agreement.commissionType) {
    case 'PERCENTAGE':
      commissionAmount = saleAmount * (agreement.commissionRate / 100);
      break;

    case 'FIXED_PER_UNIT':
      commissionAmount = quantitySold * agreement.commissionRate;
      break;

    case 'TIERED':
      // Simplified tiered commission (would use lookup table in production)
      if (saleAmount >= 10000) {
        commissionAmount = saleAmount * 0.15; // 15% for high volume
      } else if (saleAmount >= 5000) {
        commissionAmount = saleAmount * 0.20; // 20% for medium volume
      } else {
        commissionAmount = saleAmount * 0.25; // 25% for low volume
      }
      break;
  }

  const netToConsignor = saleAmount - commissionAmount;

  return {
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    netToConsignor: Math.round(netToConsignor * 100) / 100,
  };
}

export function generateSettlementStatement(
  settlement: ConsignmentSettlement,
  sales: ConsignmentSale[],
  returns: Array<{ returnDate: Date; inventoryId: string; quantityReturned: number; returnReason: string; totalValue: number }>
): {
  summary: {
    period: string;
    totalSales: number;
    totalUnits: number;
    avgPrice: number;
    commission: number;
    returns: number;
    netPayable: number;
  };
  salesBreakdown: Array<{ date: string; product: string; qty: number; amount: number; commission: number }>;
  returnsBreakdown: Array<{ date: string; product: string; qty: number; reason: string; value: number }>;
} {
  const totalUnits = sales.reduce((sum, sale) => sum + sale.quantitySold, 0);
  const avgPrice = totalUnits > 0 ? settlement.totalSales / totalUnits : 0;

  const salesBreakdown = sales.slice(0, 50).map(sale => ({
    date: sale.saleDate.toISOString().split('T')[0]!,
    product: sale.inventoryId, // Would join to product name in production
    qty: sale.quantitySold,
    amount: sale.totalAmount,
    commission: sale.commissionAmount,
  }));

  const returnsBreakdown = returns.slice(0, 20).map(ret => ({
    date: ret.returnDate.toISOString().split('T')[0]!,
    product: ret.inventoryId,
    qty: ret.quantityReturned,
    reason: ret.returnReason,
    value: ret.totalValue,
  }));

  return {
    summary: {
      period: `${settlement.periodStart.toISOString().split('T')[0]} to ${settlement.periodEnd.toISOString().split('T')[0]}`,
      totalSales: settlement.totalSales,
      totalUnits,
      avgPrice: Math.round(avgPrice * 100) / 100,
      commission: settlement.totalCommission,
      returns: settlement.totalReturns,
      netPayable: settlement.netPayable,
    },
    salesBreakdown,
    returnsBreakdown,
  };
}

export function calculateSettlementTotals(
  sales: ConsignmentSale[],
  returns: Array<{ totalValue: number; restockingFee?: number }>,
  adjustments: number = 0
): {
  totalSales: number;
  totalCommission: number;
  totalReturns: number;
  netPayable: number;
} {
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalCommission = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const totalReturns = returns.reduce((sum, ret) => sum + ret.totalValue + (ret.restockingFee || 0), 0);
  const netPayable = totalSales - totalCommission - totalReturns + adjustments;
  
  return {
    totalSales: Math.round(totalSales * 100) / 100,
    totalCommission: Math.round(totalCommission * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    netPayable: Math.round(netPayable * 100) / 100,
  };
}

export function validateSettlement(
  settlement: ConsignmentSettlement
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (settlement.periodStart >= settlement.periodEnd) {
    errors.push('Period end must be after period start');
  }
  
  if (settlement.totalSales < 0) {
    errors.push('Total sales cannot be negative');
  }
  
  if (settlement.netPayable < 0) {
    errors.push('Net payable is negative - verify returns and adjustments');
  }
  
  if (settlement.salesTransactions.length === 0) {
    errors.push('Settlement must include at least one sale transaction');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
