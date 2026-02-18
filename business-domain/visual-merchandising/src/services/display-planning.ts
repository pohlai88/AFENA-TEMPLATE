/**
 * Display Planning Service
 * Manages display plans, fixture layouts, and planogram creation
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface Planogram {
  planogramId: string;
  planogramNumber: string;
  
  // Classification
  name: string;
  category: string;
  storeFormat: 'FLAGSHIP' | 'STANDARD' | 'COMPACT' | 'KIOSK';
  
  // Layout
  fixtureType: 'GONDOLA' | 'ENDCAP' | 'SHELF' | 'DISPLAY_TABLE' | 'WALL_BAY';
  shelves: PlanogramShelf[];
  totalCapacity: number;
  
  // Dimensions
  widthCm: number;
  heightCm: number;
  depthCm: number;
  
  // Products
  products: PlacedProduct[];
  totalFacings: number;
  totalSKUs: number;
  
  // Compliance
  complianceRequired: boolean;
  complianceWindow: number; // days
  
  // Validity
  effectiveDate: Date;
  expiryDate?: Date;
  
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'EXPIRED';
}

export interface PlanogramShelf {
  shelfNumber: number;
  heightFromFloorCm: number;
  widthCm: number;
  depthCm: number;
  
  // Performance zone
  zone: 'EYE_LEVEL' | 'REACH_LEVEL' | 'STOOPING_LEVEL' | 'STRETCH_LEVEL';
  
  // Capacity
  maxWeight: number;
  facingsCount: number;
}

export interface PlacedProduct {
  productId: string;
  productCode: string;
  productName: string;
  
  // Placement
  shelfNumber: number;
  positionLeft: number; // cm from left
  facingCount: number;
  
  // Dimensions
  widthCm: number;
  heightCm: number;
  depthCm: number;
  
  // Performance
  salesRank?: number;
  profitMargin?: number;
  movementRate?: 'FAST' | 'MEDIUM' | 'SLOW';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createPlanogram(
  _db: NeonHttpDatabase,
  _orgId: string,
  _planogram: Omit<Planogram, 'planogramId' | 'planogramNumber' | 'totalCapacity' | 'totalFacings' | 'totalSKUs'>
): Promise<Planogram> {
  // TODO: Create planogram and calculate capacities
  throw new Error('Database integration pending');
}

export async function getPlanogramById(
  _db: NeonHttpDatabase,
  _orgId: string,
  _planogramId: string
): Promise<Planogram | null> {
  // TODO: Retrieve planogram by ID
  throw new Error('Database integration pending');
}

export async function updatePlanogram(
  _db: NeonHttpDatabase,
  _orgId: string,
  _planogramId: string,
  _updates: Partial<Planogram>
): Promise<Planogram> {
  // TODO: Update planogram
  throw new Error('Database integration pending');
}

export async function listPlanograms(
  _db: NeonHttpDatabase,
  _orgId: string,
  _filters?: {
    storeFormat?: string;
    status?: Planogram['status'];
    category?: string;
  }
): Promise<Planogram[]> {
  // TODO: List planograms with filters
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generatePlanogramNumber(): string {
  const prefix = 'PLN';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${sequence}`;
}

export function calculateTotalCapacity(shelves: PlanogramShelf[]): number {
  return shelves.reduce((sum, shelf) => sum + shelf.facingsCount, 0);
}

export function optimizePlanogramPlacement(
  products: Array<{
    productId: string;
    salesRank: number;
    profitMargin: number;
    dimensions: { width: number; height: number; depth: number };
  }>,
  shelves: PlanogramShelf[]
): { recommendations: Array<{ productId: string; shelfNumber: number; reason: string }> } {
  const recommendations: Array<{ productId: string; shelfNumber: number; reason: string }> = [];
  
  // Group shelves by zone
  const eyeLevelShelves = shelves.filter(s => s.zone === 'EYE_LEVEL').map(s => s.shelfNumber);
  const reachLevelShelves = shelves.filter(s => s.zone === 'REACH_LEVEL').map(s => s.shelfNumber);
  const otherShelves = shelves.filter(s => 
    s.zone === 'STOOPING_LEVEL' || s.zone === 'STRETCH_LEVEL'
  ).map(s => s.shelfNumber);
  
  // Sort products by performance (sales rank + profit margin)
  const sortedProducts = [...products].sort((a, b) => {
    const scoreA = (100 - a.salesRank) + (a.profitMargin * 2); // Weighted toward profit
    const scoreB = (100 - b.salesRank) + (b.profitMargin * 2);
    return scoreB - scoreA;
  });
  
  // Assign top performers to eye level
  const topPerformers = sortedProducts.slice(0, eyeLevelShelves.length);
  topPerformers.forEach((product, index) => {
    if (eyeLevelShelves.length === 0) return;
    recommendations.push({
      productId: product.productId,
      shelfNumber: eyeLevelShelves[index % eyeLevelShelves.length]!,
      reason: 'High sales and profit margin - placed at eye level for maximum visibility',
    });
  });
  
  // Assign medium performers to reach level
  const mediumPerformers = sortedProducts.slice(
    eyeLevelShelves.length,
    eyeLevelShelves.length + reachLevelShelves.length
  );
  mediumPerformers.forEach((product, index) => {
    if (reachLevelShelves.length === 0) return;
    recommendations.push({
      productId: product.productId,
      shelfNumber: reachLevelShelves[index % reachLevelShelves.length]!,
      reason: 'Medium performance - positioned at reach level',
    });
  });
  
  // Assign slower movers to other shelves
  const slowMovers = sortedProducts.slice(
    eyeLevelShelves.length + reachLevelShelves.length
  );
  slowMovers.forEach((product, index) => {
    if (otherShelves.length === 0) return;
    recommendations.push({
      productId: product.productId,
      shelfNumber: otherShelves[index % otherShelves.length]!,
      reason: 'Lower sales velocity - placed on lower or higher shelves',
    });
  });
  
  return { recommendations };
}
