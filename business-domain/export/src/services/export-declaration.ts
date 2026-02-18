/**
 * Export Declaration Service
 * Manages export order creation, customs documentation, and compliance basics
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface ExportOrder {
  exportId: string;
  exportNumber: string;
  salesOrderId: string;
  
  // Parties
  exporterId: string;
  buyerId: string;
  buyerCountry: string;
  
  // Shipment
  incoterm: 'EXW' | 'FCA' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';
  portOfLoading: string;
  portOfDischarge: string;
  destinationCountry: string;
  
  // Products
  items: ExportItem[];
  totalValue: number;
  currency: string;
  
  // Documentation
  requiredDocuments: string[];
  completedDocuments: string[];
  
  // Compliance
  exportLicenseRequired: boolean;
  exportLicenseNumber?: string;
  hsCode: string;
  
  // Status
  status: 'DRAFT' | 'DOCUMENTATION' | 'CUSTOMS_CLEARANCE' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED';
  exportDate?: Date;
  deliveryDate?: Date;
}

export interface ExportItem {
  lineNumber: number;
  productId: string;
  productCode: string;
  description: string;
  
  // Quantities
  quantity: number;
  unitOfMeasure: string;
  
  // Pricing
  unitPrice: number;
  lineValue: number;
  
  // Classification
  hsCode: string;
  countryOfOrigin: string;
  
  // Weight/Dimensions
  netWeight: number;
  grossWeight: number;
  volume?: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createExportOrder(
  _db: NeonHttpDatabase,
  _orgId: string,
  _order: Omit<ExportOrder, 'exportId' | 'exportNumber' | 'totalValue' | 'completedDocuments'>
): Promise<ExportOrder> {
  // TODO: Insert export order into database
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateExportNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `EXP-${year}${month}-${sequence}`;
}

export function calculateTotalValue(items: ExportItem[]): number {
  return items.reduce((sum, item) => sum + item.lineValue, 0);
}

export function validateHSCode(hsCode: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // HS codes are 6-10 digits
  if (!/^\d{6,10}$/.test(hsCode)) {
    errors.push('HS code must be 6-10 digits');
  }

  // Would validate against actual HS code database in production
  // Check first 2 digits (Chapter) - should be 01-99
  const chapter = parseInt(hsCode.substring(0, 2));
  if (chapter < 1 || chapter > 99) {
    errors.push('Invalid HS chapter code');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
