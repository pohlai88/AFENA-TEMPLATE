/**
 * Window Display Service
 * Manages window display design, seasonal themes, and installation
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface StoreDisplay {
  displayId: string;
  storeId: string;
  locationZone: string;
  
  // Display details
  displayType: 'WINDOW' | 'FEATURE_TABLE' | 'MANNEQUIN' | 'PODIUM' | 'ENDCAP';
  theme?: string;
  
  // Products
  featuredProducts: string[];
  
  // Timing
  installDate: Date;
  plannedRemovalDate: Date;
  actualRemovalDate?: Date;
  
  // Performance
  targetTraffic?: number;
  actualTraffic?: number;
  conversionRate?: number;
  
  // Compliance
  photoUrl?: string;
  approvedBy?: string;
  approvalDate?: Date;
  
  status: 'PLANNED' | 'INSTALLED' | 'ACTIVE' | 'REMOVED';
}

export interface DisplayCompliance {
  displayId: string;
  location: string;
  
  isCompliant: boolean;
  issues: string[];
}

export interface SeasonalTheme {
  themeId: string;
  name: string;
  season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'HOLIDAY' | 'SPECIAL_EVENT';
  
  // Design elements
  colorPalette: string[];
  suggestedProps: string[];
  suggestedProducts: string[];
  
  // Timing
  startDate: Date;
  endDate: Date;
  
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function installStoreDisplay(
  _db: NeonHttpDatabase,
  _orgId: string,
  _display: Omit<StoreDisplay, 'displayId'>
): Promise<StoreDisplay> {
  // TODO: Register store display
  throw new Error('Database integration pending');
}

export async function getStoreDisplay(
  _db: NeonHttpDatabase,
  _orgId: string,
  _displayId: string
): Promise<StoreDisplay | null> {
  // TODO: Retrieve store display
  throw new Error('Database integration pending');
}

export async function updateStoreDisplay(
  _db: NeonHttpDatabase,
  _orgId: string,
  _displayId: string,
  _updates: Partial<StoreDisplay>
): Promise<StoreDisplay> {
  // TODO: Update store display
  throw new Error('Database integration pending');
}

export async function listStoreDisplays(
  _db: NeonHttpDatabase,
  _orgId: string,
  _filters?: {
    storeId?: string;
    displayType?: StoreDisplay['displayType'];
    status?: StoreDisplay['status'];
  }
): Promise<StoreDisplay[]> {
  // TODO: List store displays with filters
  throw new Error('Database integration pending');
}

export async function createSeasonalTheme(
  _db: NeonHttpDatabase,
  _orgId: string,
  _theme: Omit<SeasonalTheme, 'themeId'>
): Promise<SeasonalTheme> {
  // TODO: Create seasonal theme
  throw new Error('Database integration pending');
}

export async function removeStoreDisplay(
  _db: NeonHttpDatabase,
  _orgId: string,
  _displayId: string,
  _actualRemovalDate: Date
): Promise<StoreDisplay> {
  // TODO: Mark display as removed
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateDisplayPerformance(
  display: StoreDisplay,
  salesData: Array<{ productId: string; quantity: number; revenue: number }>
): {
  trafficPerformance: number;
  conversionPerformance: number;
  revenueGenerated: number;
  topSellingProduct?: string;
} {
  const trafficPerformance = display.targetTraffic && display.actualTraffic
    ? (display.actualTraffic / display.targetTraffic) * 100
    : 0;
  
  const conversionPerformance = display.conversionRate || 0;
  
  const revenueGenerated = salesData.reduce((sum, item) => sum + item.revenue, 0);
  
  const topSellingProduct = salesData.length > 0
    ? salesData.sort((a, b) => b.quantity - a.quantity)[0]?.productId
    : undefined;
  
  const result: {
    trafficPerformance: number;
    conversionPerformance: number;
    revenueGenerated: number;
    topSellingProduct?: string;
  } = {
    trafficPerformance: Math.round(trafficPerformance),
    conversionPerformance: Math.round(conversionPerformance * 100) / 100,
    revenueGenerated: Math.round(revenueGenerated),
  };
  
  if (topSellingProduct !== undefined) {
    result.topSellingProduct = topSellingProduct;
  }
  
  return result;
}

export function validateDisplayCompliance(
  display: StoreDisplay,
  requirements: {
    minProducts: number;
    requiresPhoto: boolean;
    requiresApproval: boolean;
  }
): DisplayCompliance {
  const issues: string[] = [];
  
  if (display.featuredProducts.length < requirements.minProducts) {
    issues.push(`Insufficient products: ${display.featuredProducts.length} (minimum: ${requirements.minProducts})`);
  }
  
  if (requirements.requiresPhoto && !display.photoUrl) {
    issues.push('Missing required photo documentation');
  }
  
  if (requirements.requiresApproval && !display.approvedBy) {
    issues.push('Display not approved');
  }
  
  return {
    displayId: display.displayId,
    location: display.locationZone,
    isCompliant: issues.length === 0,
    issues,
  };
}

export function recommendDisplayProducts(
  theme: SeasonalTheme,
  availableProducts: Array<{ productId: string; category: string; colors: string[] }>,
  maxProducts: number
): string[] {
  // Filter products that match the theme's color palette
  const matchingProducts = availableProducts.filter(product =>
    product.colors.some(color => theme.colorPalette.includes(color))
  );
  
  // Prioritize suggested products
  const prioritized = matchingProducts.sort((a, b) => {
    const aSuggested = theme.suggestedProducts.includes(a.productId) ? 1 : 0;
    const bSuggested = theme.suggestedProducts.includes(b.productId) ? 1 : 0;
    return bSuggested - aSuggested;
  });
  
  return prioritized.slice(0, maxProducts).map(p => p.productId);
}
