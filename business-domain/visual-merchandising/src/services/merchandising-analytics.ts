/**
 * Merchandising Analytics Service
 * Manages display performance, sales lift, and conversion metrics
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Planogram } from './display-planning.js';
import type { StoreDisplay, DisplayCompliance } from './window-display.js';
import type { StandardCompliance } from './merchandise-presentation.js';

// ============================================================================
// Interfaces
// ============================================================================

export interface PlanogramCompliance {
  planogramId: string;
  planogramName: string;
  
  complianceScore: number;
  isCompliant: boolean;
  
  deviations: Array<{
    productId: string;
    issue: 'MISSING' | 'WRONG_SHELF' | 'WRONG_POSITION' | 'INSUFFICIENT_FACINGS';
    expected: string;
    actual: string;
  }>;
}




export interface CorrectiveAction {
  issue: string;
  action: string;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ComplianceInspection {
  inspectionId: string;
  storeId: string;
  
  // Timing
  inspectionDate: Date;
  inspector: string;
  
  // Scope
  planogramsChecked: PlanogramCompliance[];
  displaysChecked: DisplayCompliance[];
  standardsChecked: StandardCompliance[];
  
  // Results
  overallScore: number;
  passed: boolean;
  
  // Follow-up
  issuesIdentified: number;
  correctiveActions: CorrectiveAction[];
  nextInspectionDate?: Date;
  
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FOLLOW_UP_REQUIRED';
}

export interface VMPerformance {
  storeId: string;
  period: { start: Date; end: Date };
  
  // Compliance
  planogramCompliance: number;
  displayCompliance: number;
  overallCompliance: number;
  
  // Display performance
  displayCount: number;
  avgDisplayLifespan: number; // days
  avgConversionRate: number;
  
  // Product performance
  topPerformingProducts: Array<{
    productId: string;
    salesIncrease: number;
  }>;
}

export interface SalesLiftAnalysis {
  displayId: string;
  productId: string;
  
  // Baseline
  baselineSales: number;
  baselinePeriod: { start: Date; end: Date };
  
  // Display period
  displaySales: number;
  displayPeriod: { start: Date; end: Date };
  
  // Lift metrics
  absoluteLift: number;
  percentageLift: number;
  
  // ROI
  displayCost?: number;
  incrementalRevenue: number;
  roi?: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function conductComplianceInspection(
  _db: NeonHttpDatabase,
  _orgId: string,
  _inspection: Omit<ComplianceInspection, 'inspectionId' | 'overallScore' | 'passed' | 'issuesIdentified'>
): Promise<ComplianceInspection> {
  // TODO: Conduct compliance inspection and score
  throw new Error('Database integration pending');
}

export async function getComplianceInspection(
  _db: NeonHttpDatabase,
  _orgId: string,
  _inspectionId: string
): Promise<ComplianceInspection | null> {
  // TODO: Retrieve inspection
  throw new Error('Database integration pending');
}

export async function listComplianceInspections(
  _db: NeonHttpDatabase,
  _orgId: string,
  _filters?: {
    storeId?: string;
    status?: ComplianceInspection['status'];
    fromDate?: Date;
    toDate?: Date;
  }
): Promise<ComplianceInspection[]> {
  // TODO: List inspections with filters
  throw new Error('Database integration pending');
}

export async function getVMPerformance(
  _db: NeonHttpDatabase,
  _orgId: string,
  _storeId: string,
  _period: { start: Date; end: Date }
): Promise<VMPerformance> {
  // TODO: Get VM performance metrics
  throw new Error('Database integration pending');
}

export async function calculateSalesLift(
  _db: NeonHttpDatabase,
  _orgId: string,
  _displayId: string,
  _productId: string
): Promise<SalesLiftAnalysis> {
  // TODO: Calculate sales lift from display
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculatePlanogramCompliance(
  planogram: Planogram,
  actualProducts: Array<{ productId: string; shelfNumber: number; position: number; facings: number }>
): PlanogramCompliance {
  const deviations: Array<{
    productId: string;
    issue: 'MISSING' | 'WRONG_SHELF' | 'WRONG_POSITION' | 'INSUFFICIENT_FACINGS';
    expected: string;
    actual: string;
  }> = [];
  
  // Check each product in planogram
  planogram.products.forEach(plannedProduct => {
    const actualProduct = actualProducts.find(p => p.productId === plannedProduct.productId);
    
    if (!actualProduct) {
      deviations.push({
        productId: plannedProduct.productId,
        issue: 'MISSING',
        expected: `Shelf ${plannedProduct.shelfNumber}, ${plannedProduct.facingCount} facings`,
        actual: 'Not found',
      });
    } else {
      // Check shelf placement
      if (actualProduct.shelfNumber !== plannedProduct.shelfNumber) {
        deviations.push({
          productId: plannedProduct.productId,
          issue: 'WRONG_SHELF',
          expected: `Shelf ${plannedProduct.shelfNumber}`,
          actual: `Shelf ${actualProduct.shelfNumber}`,
        });
      }
      
      // Check facings count
      if (actualProduct.facings < plannedProduct.facingCount) {
        deviations.push({
          productId: plannedProduct.productId,
          issue: 'INSUFFICIENT_FACINGS',
          expected: `${plannedProduct.facingCount} facings`,
          actual: `${actualProduct.facings} facings`,
        });
      }
    }
  });
  
  const complianceScore = planogram.products.length > 0
    ? ((planogram.products.length - deviations.length) / planogram.products.length) * 100
    : 100;
  
  return {
    planogramId: planogram.planogramId,
    planogramName: planogram.name,
    complianceScore: Math.round(complianceScore),
    isCompliant: complianceScore >= 90,
    deviations,
  };
}

export function analyzeVMPerformance(
  inspections: ComplianceInspection[],
  displays: StoreDisplay[]
): {
  avgComplianceScore: number;
  totalDeviations: number;
  avgCorrectiveActiontime: number; // days
  displayEffectiveness: number;
  improvementTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
} {
  const avgComplianceScore = inspections.length > 0
    ? inspections.reduce((sum, insp) => sum + insp.overallScore, 0) / inspections.length
    : 0;
  
  const totalDeviations = inspections.reduce((sum, insp) => sum + insp.issuesIdentified, 0);
  
  // Calculate avg time to complete corrective actions
  let totalActionDays = 0;
  let completedActions = 0;
  inspections.forEach(insp => {
    insp.correctiveActions.forEach(action => {
      if (action.completedDate) {
        const days = Math.floor(
          (action.completedDate.getTime() - insp.inspectionDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalActionDays += days;
        completedActions++;
      }
    });
  });
  const avgCorrectiveActiontime = completedActions > 0 ? totalActionDays / completedActions : 0;
  
  // Display effectiveness (% meeting traffic targets)
  const displaysWithTargets = displays.filter(d => d.targetTraffic && d.actualTraffic);
  const meetingTargets = displaysWithTargets.filter(d => 
    d.actualTraffic! >= d.targetTraffic!
  ).length;
  const displayEffectiveness = displaysWithTargets.length > 0
    ? (meetingTargets / displaysWithTargets.length) * 100
    : 0;
  
  // Trend analysis (compare recent vs older inspections)
  const sortedInspections = [...inspections].sort((a, b) => 
    a.inspectionDate.getTime() - b.inspectionDate.getTime()
  );
  const halfPoint = Math.floor(sortedInspections.length / 2);
  const olderHalf = sortedInspections.slice(0, halfPoint);
  const recentHalf = sortedInspections.slice(halfPoint);
  
  const olderAvg = olderHalf.length > 0
    ? olderHalf.reduce((sum, i) => sum + i.overallScore, 0) / olderHalf.length
    : 0;
  const recentAvg = recentHalf.length > 0
    ? recentHalf.reduce((sum, i) => sum + i.overallScore, 0) / recentHalf.length
    : 0;
  
  let improvementTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  if (recentAvg > olderAvg + 5) {
    improvementTrend = 'IMPROVING';
  } else if (recentAvg < olderAvg - 5) {
    improvementTrend = 'DECLINING';
  } else {
    improvementTrend = 'STABLE';
  }
  
  return {
    avgComplianceScore: Math.round(avgComplianceScore),
    totalDeviations,
    avgCorrectiveActiontime: Math.round(avgCorrectiveActiontime * 10) / 10,
    displayEffectiveness: Math.round(displayEffectiveness),
    improvementTrend,
  };
}

export function analyzeSalesLift(
  baselineSales: Array<{ date: Date; quantity: number; revenue: number }>,
  displaySales: Array<{ date: Date; quantity: number; revenue: number }>,
  displayCost?: number
): Omit<SalesLiftAnalysis, 'displayId' | 'productId' | 'baselinePeriod' | 'displayPeriod'> {
  const baselineRevenue = baselineSales.reduce((sum, s) => sum + s.revenue, 0);
  const baselineAvg = baselineRevenue / baselineSales.length;
  
  const displayRevenue = displaySales.reduce((sum, s) => sum + s.revenue, 0);
  const displayAvg = displayRevenue / displaySales.length;
  
  const absoluteLift = displayAvg - baselineAvg;
  const percentageLift = baselineAvg > 0 ? (absoluteLift / baselineAvg) * 100 : 0;
  
  const incrementalRevenue = absoluteLift * displaySales.length;
  const roi = displayCost && displayCost > 0
    ? ((incrementalRevenue - displayCost) / displayCost) * 100
    : undefined;
  
  const result: Omit<SalesLiftAnalysis, 'displayId' | 'productId' | 'baselinePeriod' | 'displayPeriod'> = {
    baselineSales: Math.round(baselineRevenue),
    displaySales: Math.round(displayRevenue),
    absoluteLift: Math.round(absoluteLift * 100) / 100,
    percentageLift: Math.round(percentageLift * 100) / 100,
    incrementalRevenue: Math.round(incrementalRevenue),
  };
  
  if (displayCost !== undefined) {
    result.displayCost = displayCost;
  }
  
  if (roi !== undefined) {
    result.roi = Math.round(roi * 100) / 100;
  }
  
  return result;
}
