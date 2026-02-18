/**
 * Merchandising Support Service
 * Manages in-store support, shelf placement, and POS materials
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface MerchandisingProgram {
  programId: string;
  programName: string;
  
  // Details
  description: string;
  programType: 'SHELF_PLACEMENT' | 'END_CAP_DISPLAY' | 'POS_MATERIALS' | 'IN_STORE_DEMO' | 'PLANOGRAM';
  
  // Coverage
  targetRetailers: string[];
  targetStores: string[];
  productSKUs: string[];
  
  // Timing
  startDate: Date;
  endDate: Date;
  
  // Support
  supportType: 'MERCHANDISER_VISIT' | 'DEMO_STAFF' | 'MATERIALS_KIT' | 'DISPLAY_UNIT';
  frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  
  // Materials
  posKitItems: string[];
  displayUnits: number;
  
  // Budget
  allocatedBudget: number;
  actualSpend: number;
  
  // Performance
  storesCompleted: number;
  totalStoresTarget: number;
  complianceRate: number;
  
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface POSMaterial {
  materialId: string;
  materialCode: string;
  
  // Details
  materialName: string;
  materialType: 'SHELF_TALKER' | 'WOBLER' | 'POSTER' | 'BANNER' | 'STANDEE' | 'CEILING_DANGLER';
  
  // Specifications
  dimensions: string;
  weight: number;
  material: string;
  
  // Branding
  productSKUs: string[];
  campaignId?: string;
  
  // Inventory
  quantityAvailable: number;
  quantityAllocated: number;
  unitCost: number;
  
  // Distribution
  distributedTo: Array<{ retailerId: string; quantity: number; date: Date }>;
  
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface ShelfPlacementAudit {
  auditId: string;
  
  // Location
  retailerId: string;
  storeId: string;
  auditDate: Date;
  
  // Auditor
  auditorId: string;
  auditorType: 'MERCHANDISER' | 'SALES_REP' | 'THIRD_PARTY';
  
  // Findings
  shelfPresence: boolean;
  facingsCount: number;
  targetFacings: number;
  shelfPosition: 'EYE_LEVEL' | 'TOP_SHELF' | 'MIDDLE_SHELF' | 'BOTTOM_SHELF';
  
  // Compliance
  planogramCompliance: boolean;
  stockAvailability: boolean;
  posMaterialsPresent: boolean;
  
  // Issues
  outOfStockSKUs: string[];
  missingPOS: string[];
  competitorActivity: string;
  
  // Photos
  photoUrls: string[];
  
  // Recommendations
  actionItems: string[];
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createMerchandisingProgram(
  _db: NeonHttpDatabase,
  _orgId: string,
  _program: Omit<MerchandisingProgram, 'programId' | 'actualSpend' | 'storesCompleted' | 'complianceRate'>
): Promise<MerchandisingProgram> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function registerPOSMaterial(
  _db: NeonHttpDatabase,
  _orgId: string,
  _material: Omit<POSMaterial, 'materialId' | 'materialCode' | 'quantityAllocated' | 'distributedTo'>
): Promise<POSMaterial> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function recordShelfPlacementAudit(
  _db: NeonHttpDatabase,
  _orgId: string,
  _audit: Omit<ShelfPlacementAudit, 'auditId'>
): Promise<ShelfPlacementAudit> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function allocatePOSMaterials(
  _db: NeonHttpDatabase,
  _orgId: string,
  _materialId: string,
  _retailerId: string,
  _quantity: number
): Promise<POSMaterial> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getProgramComplianceReport(
  _db: NeonHttpDatabase,
  _orgId: string,
  _programId: string
): Promise<{ complianceRate: number; audits: ShelfPlacementAudit[] }> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateMaterialCode(materialType: string): string {
  const typeCode = materialType.split('_').map(w => w[0]).join('');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `POS-${typeCode}-${sequence}`;
}

export function calculateComplianceScore(audit: ShelfPlacementAudit): number {
  let score = 0;
  let maxScore = 0;
  
  // Shelf presence (30 points)
  maxScore += 30;
  if (audit.shelfPresence) score += 30;
  
  // Facings target (25 points)
  maxScore += 25;
  if (audit.facingsCount >= audit.targetFacings) {
    score += 25;
  } else {
    score += (audit.facingsCount / audit.targetFacings) * 25;
  }
  
  // Planogram compliance (25 points)
  maxScore += 25;
  if (audit.planogramCompliance) score += 25;
  
  // Stock availability (20 points)
  maxScore += 20;
  if (audit.stockAvailability) score += 20;
  
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}
