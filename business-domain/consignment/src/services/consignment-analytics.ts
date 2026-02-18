/**
 * Consignment Analytics Service
 * 
 * Provides performance analysis, metrics, and insights for consignment operations.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ConsignmentAgreement } from './agreement-management';
import type { ConsignmentInventory } from './inventory-tracking';
import type { ConsignmentSale } from './sales-settlement';
import type { ConsignmentReturn } from './returns-management';

// ============================================================================
// Interfaces
// ============================================================================

export interface ConsignmentPerformance {
  agreementId: string;
  periodStart: Date;
  periodEnd: Date;
  
  // Inventory metrics
  avgInventoryOnHand: number;
  inventoryTurnover: number; // times
  daysInventoryOutstanding: number;
  
  // Sales metrics
  totalSales: number;
  totalUnits: number;
  avgSellingPrice: number;
  sellThroughRate: number; // %
  
  // Financial metrics
  totalCommission: number;
  avgCommissionRate: number;
  consignorRevenue: number;
  returnRate: number; // %
}

// ============================================================================
// Database Operations
// ============================================================================

export async function getPerformanceMetrics(
  _db: NeonHttpDatabase,
  _orgId: string,
  _agreementId: string,
  _period: { start: Date; end: Date }
): Promise<ConsignmentPerformance> {
  // TODO: Calculate and return performance metrics
  throw new Error('Not implemented');
}

export async function getConsignorPerformanceReport(
  _db: NeonHttpDatabase,
  _orgId: string,
  _consignorId: string,
  _period: { start: Date; end: Date }
): Promise<{
  agreements: ConsignmentPerformance[];
  totalRevenue: number;
  totalCommission: number;
  avgTurnover: number;
}> {
  // TODO: Aggregate performance across all consignor agreements
  throw new Error('Not implemented');
}

// ============================================================================
// Analytics Functions
// ============================================================================

export function analyzeConsignmentPerformance(
  agreement: ConsignmentAgreement,
  inventory: ConsignmentInventory[],
  sales: ConsignmentSale[],
  returns: ConsignmentReturn[],
  periodDays: number
): ConsignmentPerformance {
  const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
  const periodEnd = new Date();

  // Inventory metrics
  const avgInventoryOnHand = inventory.reduce((sum, inv) => sum + inv.quantityOnHand, 0) / 
    (inventory.length || 1);
  
  const { turnover, daysOnHand } = calculateInventoryTurnover(sales, inventory, periodDays);

  // Sales metrics
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalUnits = sales.reduce((sum, sale) => sum + sale.quantitySold, 0);
  const avgSellingPrice = totalUnits > 0 ? totalSales / totalUnits : 0;
  const sellThroughRate = calculateSellThroughRate(inventory);

  // Financial metrics
  const totalCommission = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const avgCommissionRate = totalSales > 0 ? (totalCommission / totalSales) * 100 : 0;
  const consignorRevenue = totalSales - totalCommission;

  const totalReturned = returns.reduce((sum, ret) => sum + ret.quantityReturned, 0);
  const totalReceived = inventory.reduce((sum, inv) => sum + inv.quantityReceived, 0);
  const returnRate = totalReceived > 0 ? (totalReturned / totalReceived) * 100 : 0;

  return {
    agreementId: agreement.agreementId,
    periodStart,
    periodEnd,
    avgInventoryOnHand: Math.round(avgInventoryOnHand),
    inventoryTurnover: turnover,
    daysInventoryOutstanding: daysOnHand,
    totalSales: Math.round(totalSales * 100) / 100,
    totalUnits,
    avgSellingPrice: Math.round(avgSellingPrice * 100) / 100,
    sellThroughRate: Math.round(sellThroughRate * 100) / 100,
    totalCommission: Math.round(totalCommission * 100) / 100,
    avgCommissionRate: Math.round(avgCommissionRate * 100) / 100,
    consignorRevenue: Math.round(consignorRevenue * 100) / 100,
    returnRate: Math.round(returnRate * 100) / 100,
  };
}

export function calculateInventoryTurnover(
  sales: ConsignmentSale[],
  inventory: ConsignmentInventory[],
  periodDays: number
): { turnover: number; daysOnHand: number } {
  const totalSold = sales.reduce((sum, sale) => sum + sale.quantitySold, 0);
  const avgInventory = inventory.reduce((sum, inv) => sum + inv.quantityOnHand, 0) / (inventory.length || 1);

  const turnover = avgInventory > 0 ? totalSold / avgInventory : 0;
  const daysOnHand = turnover > 0 ? periodDays / turnover : periodDays;

  return {
    turnover: Math.round(turnover * 10) / 10,
    daysOnHand: Math.round(daysOnHand),
  };
}

export function calculateSellThroughRate(
  inventory: ConsignmentInventory[]
): number {
  const totalReceived = inventory.reduce((sum, inv) => sum + inv.quantityReceived, 0);
  const totalSold = inventory.reduce((sum, inv) => sum + inv.quantitySold, 0);

  return totalReceived > 0 ? (totalSold / totalReceived) * 100 : 0;
}

export function identifySlowMovingItems(
  inventory: ConsignmentInventory[],
  sales: ConsignmentSale[],
  thresholdDays: number
): Array<{
  inventoryId: string;
  productCode: string;
  daysOnHand: number;
  quantityOnHand: number;
  estimatedValue: number;
  recommendation: string;
}> {
  const now = new Date();
  const slowMoving: Array<{
    inventoryId: string;
    productCode: string;
    daysOnHand: number;
    quantityOnHand: number;
    estimatedValue: number;
    recommendation: string;
  }> = [];

  inventory.forEach(inv => {
    const daysOnHand = Math.floor(
      (now.getTime() - inv.receivedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysOnHand >= thresholdDays && inv.quantityOnHand > 0) {
      const recentSales = sales.filter(s => 
        s.inventoryId === inv.inventoryId &&
        (now.getTime() - s.saleDate.getTime()) <= 30 * 24 * 60 * 60 * 1000
      );

      const salesVelocity = recentSales.reduce((sum, s) => sum + s.quantitySold, 0);

      let recommendation = '';
      if (salesVelocity === 0 && daysOnHand > 90) {
        recommendation = 'Consider return to consignor';
      } else if (salesVelocity < 5 && daysOnHand > 60) {
        recommendation = 'Apply discount to accelerate sales';
      } else {
        recommendation = 'Monitor closely';
      }

      slowMoving.push({
        inventoryId: inv.inventoryId,
        productCode: inv.productCode,
        daysOnHand,
        quantityOnHand: inv.quantityOnHand,
        estimatedValue: inv.quantityOnHand * inv.consignorPrice,
        recommendation,
      });
    }
  });

  return slowMoving.sort((a, b) => b.daysOnHand - a.daysOnHand);
}

export function compareAgreementPerformance(
  performances: ConsignmentPerformance[]
): {
  topByRevenue: ConsignmentPerformance[];
  topByTurnover: ConsignmentPerformance[];
  topBySellThrough: ConsignmentPerformance[];
  lowestByReturnRate: ConsignmentPerformance[];
} {
  return {
    topByRevenue: [...performances]
      .sort((a, b) => b.consignorRevenue - a.consignorRevenue)
      .slice(0, 5),
    
    topByTurnover: [...performances]
      .sort((a, b) => b.inventoryTurnover - a.inventoryTurnover)
      .slice(0, 5),
    
    topBySellThrough: [...performances]
      .sort((a, b) => b.sellThroughRate - a.sellThroughRate)
      .slice(0, 5),
    
    lowestByReturnRate: [...performances]
      .sort((a, b) => a.returnRate - b.returnRate)
      .slice(0, 5),
  };
}

export function forecastSettlementAmount(
  historicalSettlements: Array<{ periodEnd: Date; netPayable: number }>,
  _nextPeriodEnd: Date
): {
  forecastedAmount: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  if (historicalSettlements.length < 3) {
    return { forecastedAmount: 0, confidence: 'LOW' };
  }
  
  // Simple moving average
  const recentSettlements = historicalSettlements.slice(-3);
  const avgAmount = recentSettlements.reduce((sum, s) => sum + s.netPayable, 0) / recentSettlements.length;
  
  // Calculate variance for confidence
  const variance = recentSettlements.reduce((sum, s) => 
    sum + Math.pow(s.netPayable - avgAmount, 2), 0
  ) / recentSettlements.length;
  
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = avgAmount > 0 ? (stdDev / avgAmount) * 100 : 100;
  
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  if (coefficientOfVariation < 15) {
    confidence = 'HIGH';
  } else if (coefficientOfVariation < 30) {
    confidence = 'MEDIUM';
  } else {
    confidence = 'LOW';
  }
  
  return {
    forecastedAmount: Math.round(avgAmount * 100) / 100,
    confidence,
  };
}

export function identifyUnderperformingAgreements(
  performances: ConsignmentPerformance[],
  benchmarks: {
    minTurnover?: number;
    minSellThrough?: number;
    maxReturnRate?: number;
  }
): Array<{
  agreementId: string;
  issues: string[];
  performance: ConsignmentPerformance;
}> {
  const minTurnover = benchmarks.minTurnover || 4;
  const minSellThrough = benchmarks.minSellThrough || 50;
  const maxReturnRate = benchmarks.maxReturnRate || 10;
  
  return performances
    .filter(perf => 
      perf.inventoryTurnover < minTurnover ||
      perf.sellThroughRate < minSellThrough ||
      perf.returnRate > maxReturnRate
    )
    .map(perf => {
      const issues: string[] = [];
      
      if (perf.inventoryTurnover < minTurnover) {
        issues.push(`Low turnover (${perf.inventoryTurnover.toFixed(1)}x vs ${minTurnover}x target)`);
      }
      
      if (perf.sellThroughRate < minSellThrough) {
        issues.push(`Low sell-through (${perf.sellThroughRate.toFixed(1)}% vs ${minSellThrough}% target)`);
      }
      
      if (perf.returnRate > maxReturnRate) {
        issues.push(`High returns (${perf.returnRate.toFixed(1)}% vs ${maxReturnRate}% max)`);
      }
      
      return {
        agreementId: perf.agreementId,
        issues,
        performance: perf,
      };
    })
    .sort((a, b) => b.issues.length - a.issues.length);
}
