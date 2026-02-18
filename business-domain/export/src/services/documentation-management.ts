/**
 * Documentation Management Service
 * Manages commercial invoices, packing lists, certificates, and export documents
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ExportOrder } from './export-declaration';

// ============================================================================
// Interfaces
// ============================================================================

export interface ExportDocument {
  documentId: string;
  exportId: string;
  documentType: 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'BILL_OF_LADING' | 
                'CERTIFICATE_OF_ORIGIN' | 'EXPORT_LICENSE' | 'INSURANCE_CERT' | 
                'INSPECTION_CERT' | 'PHYTOSANITARY' | 'HEALTH_CERT';
  
  documentNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  
  // Content
  documentData: Record<string, unknown>;
  fileUrl?: string;
  
  // Validation
  issuedBy?: string;
  validatedBy?: string;
  validationDate?: Date;
  
  status: 'DRAFT' | 'ISSUED' | 'VALIDATED' | 'EXPIRED' | 'REJECTED';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function generateExportDocument(
  _db: NeonHttpDatabase,
  _orgId: string,
  _document: Omit<ExportDocument, 'documentId'>
): Promise<ExportDocument> {
  // TODO: Generate and store export document
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function determineRequiredDocuments(
  destinationCountry: string,
  productCategory: string,
  value: number
): string[] {
  const documents: string[] = [
    'COMMERCIAL_INVOICE',
    'PACKING_LIST',
  ];

  // All exports need bill of lading/airway bill
  documents.push('BILL_OF_LADING');

  // High value shipments
  if (value > 10000) {
    documents.push('INSURANCE_CERT');
  }

  // Specific country requirements
  const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'PL', 'AT', 'SE', 'DK'];
  if (euCountries.includes(destinationCountry)) {
    documents.push('CERTIFICATE_OF_ORIGIN');
  }

  // Product-specific requirements
  if (productCategory === 'AGRICULTURAL' || productCategory === 'FOOD') {
    documents.push('PHYTOSANITARY');
    documents.push('HEALTH_CERT');
  } else if (productCategory === 'ELECTRONICS' || productCategory === 'MACHINERY') {
    documents.push('INSPECTION_CERT');
  }

  // Controlled goods
  const controlledCategories = ['TECHNOLOGY', 'CHEMICALS', 'DEFENSE'];
  if (controlledCategories.includes(productCategory)) {
    documents.push('EXPORT_LICENSE');
  }

  return documents;
}

export function generateCommercialInvoice(
  exportOrder: ExportOrder
): Record<string, unknown> {
  return {
    invoiceNumber: exportOrder.exportNumber,
    invoiceDate: new Date().toISOString().split('T')[0],
    exporter: exportOrder.exporterId,
    buyer: exportOrder.buyerId,
    countryOfDestination: exportOrder.destinationCountry,
    incoterm: exportOrder.incoterm,
    portOfLoading: exportOrder.portOfLoading,
    portOfDischarge: exportOrder.portOfDischarge,
    currency: exportOrder.currency,
    items: exportOrder.items.map(item => ({
      lineNumber: item.lineNumber,
      description: item.description,
      hsCode: item.hsCode,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalValue: item.lineValue,
      countryOfOrigin: item.countryOfOrigin,
    })),
    totalInvoiceValue: exportOrder.totalValue,
    declarationStatement: 'I declare that all the information contained in this invoice is true and correct.',
  };
}
