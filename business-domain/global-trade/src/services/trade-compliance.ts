/**
 * Global Trade Compliance Service
 * Handles import/export compliance, customs, tariffs, duties, and trade documentation
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface TradeDocument {
  documentId: string;
  shipmentId: string;
  documentType: 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'BILL_OF_LADING' | 'CERTIFICATE_OF_ORIGIN' | 
                'EXPORT_LICENSE' | 'IMPORT_LICENSE' | 'CUSTOMS_DECLARATION' | 'PHYTOSANITARY' | 'FUMIGATION';
  documentNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  status: 'DRAFT' | 'ISSUED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  issuingAuthority?: string;
  attachmentUrl?: string;
}

export interface CustomsDeclaration {
  declarationId: string;
  shipmentId: string;
  declarationType: 'IMPORT' | 'EXPORT' | 'TRANSIT';
  country: string;
  port: string;
  declarationDate: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CLEARED' | 'HELD' | 'REJECTED';
  items: CustomsItem[];
  totalDuties: number;
  totalTaxes: number;
  totalValue: number;
  clearanceDate?: Date;
  customsBroker?: string;
  referenceNumber?: string;
}

export interface CustomsItem {
  lineNumber: number;
  hsCode: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitValue: number;
  totalValue: number;
  countryOfOrigin: string;
  dutyRate: number;
  dutyAmount: number;
  taxRate: number;
  taxAmount: number;
  preferentialTreatment?: boolean;
  tradeAgreement?: string;
}

export interface TariffClassification {
  hsCode: string;
  description: string;
  level: number; // HS hierarchy level (2, 4, 6, 8, 10 digit)
  dutyRates: DutyRate[];
  restrictions: TradeRestriction[];
  requiredDocuments: string[];
  notes?: string;
}

export interface DutyRate {
  country: string;
  baseRate: number;
  preferentialRate?: number;
  tradeAgreement?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  rateType: 'AD_VALOREM' | 'SPECIFIC' | 'COMPOUND';
  unit?: string; // for specific duties
}

export interface TradeRestriction {
  restrictionType: 'PROHIBITED' | 'RESTRICTED' | 'LICENSE_REQUIRED' | 'QUOTA' | 'EMBARGO';
  country: string;
  description: string;
  validFrom: Date;
  validTo?: Date;
  authority: string;
}

export interface ComplianceCheck {
  checkId: string;
  shipmentId: string;
  checkDate: Date;
  checks: ComplianceCheckItem[];
  overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED';
  riskScore: number;
}

export interface ComplianceCheckItem {
  checkType: 'SANCTIONED_PARTY' | 'EXPORT_CONTROL' | 'LICENSE_VALIDITY' | 'HS_CLASSIFICATION' | 
              'DOCUMENTATION' | 'VALUATION' | 'QUOTA' | 'RESTRICTED_GOODS';
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createTradeDocument(doc: Omit<TradeDocument, 'documentId'>): Promise<TradeDocument> {
  // TODO: Implement with Drizzle ORM
  // const documentId = generateDocumentNumber(doc.documentType);
  // return await db.insert(tradeDocuments).values({ ...doc, documentId }).returning();
  throw new Error('Not implemented');
}

export async function createCustomsDeclaration(
  declaration: Omit<CustomsDeclaration, 'declarationId'>
): Promise<CustomsDeclaration> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getTariffClassification(hsCode: string): Promise<TariffClassification | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function performComplianceCheck(
  check: Omit<ComplianceCheck, 'checkId'>
): Promise<ComplianceCheck> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function updateDeclarationStatus(
  declarationId: string,
  status: CustomsDeclaration['status'],
  clearanceDate?: Date
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateDocumentNumber(docType: TradeDocument['documentType']): string {
  const typePrefix = {
    'COMMERCIAL_INVOICE': 'CI',
    'PACKING_LIST': 'PL',
    'BILL_OF_LADING': 'BL',
    'CERTIFICATE_OF_ORIGIN': 'CO',
    'EXPORT_LICENSE': 'EL',
    'IMPORT_LICENSE': 'IL',
    'CUSTOMS_DECLARATION': 'CD',
    'PHYTOSANITARY': 'PH',
    'FUMIGATION': 'FM',
  };
  
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  
  return `${typePrefix[docType]}-${dateStr}-${sequence}`;
}

export function classifyHSCode(
  productDescription: string,
  keywords: Map<string, string>
): {
  recommendedHSCode: string;
  confidence: number;
  alternatives: string[];
} {
  // Simplified HS code classification (would use ML in production)
  const desc = productDescription.toLowerCase();
  
  let recommendedHSCode = '0000.00.00';
  let confidence = 0;
  const alternatives: string[] = [];
  
  // Simple keyword matching
  keywords.forEach((hsCode, keyword) => {
    if (desc.includes(keyword.toLowerCase())) {
      if (confidence === 0) {
        recommendedHSCode = hsCode;
        confidence = 70;
      } else {
        alternatives.push(hsCode);
      }
    }
  });
  
  return {
    recommendedHSCode,
    confidence,
    alternatives: alternatives.slice(0, 3),
  };
}

export function calculateDuties(
  items: CustomsItem[],
  tariffs: Map<string, TariffClassification>
): {
  totalDuties: number;
  totalTaxes: number;
  itemizedDuties: Array<{ lineNumber: number; dutyAmount: number; taxAmount: number }>;
} {
  let totalDuties = 0;
  let totalTaxes = 0;
  const itemizedDuties: Array<{ lineNumber: number; dutyAmount: number; taxAmount: number }> = [];
  
  items.forEach(item => {
    const tariff = tariffs.get(item.hsCode);
    if (!tariff) {
      itemizedDuties.push({ lineNumber: item.lineNumber, dutyAmount: 0, taxAmount: 0 });
      return;
    }
    
    // Use preferential rate if applicable
    const dutyRate = item.preferentialTreatment && tariff.dutyRates[0]?.preferentialRate
      ? tariff.dutyRates[0].preferentialRate
      : tariff.dutyRates[0]?.baseRate || 0;
    
    const dutyAmount = item.totalValue * (dutyRate / 100);
    const taxAmount = item.totalValue * (item.taxRate / 100);
    
    totalDuties += dutyAmount;
    totalTaxes += taxAmount;
    
    itemizedDuties.push({
      lineNumber: item.lineNumber,
      dutyAmount,
      taxAmount,
    });
  });
  
  return {
    totalDuties,
    totalTaxes,
    itemizedDuties,
  };
}

export function validateTradeCompliance(
  declaration: CustomsDeclaration,
  restrictions: TradeRestriction[],
  licenses: TradeDocument[]
): ComplianceCheck {
  const checks: ComplianceCheckItem[] = [];
  let riskScore = 0;
  
  // Check for prohibited/restricted goods
  declaration.items.forEach(item => {
    const itemRestrictions = restrictions.filter(r => 
      r.country === declaration.country &&
      new Date() >= r.validFrom &&
      (!r.validTo || new Date() <= r.validTo)
    );
    
    if (itemRestrictions.some(r => r.restrictionType === 'PROHIBITED')) {
      checks.push({
        checkType: 'RESTRICTED_GOODS',
        status: 'FAIL',
        details: `Item ${item.lineNumber} (${item.hsCode}) is prohibited`,
        severity: 'CRITICAL',
      });
      riskScore += 50;
    } else if (itemRestrictions.some(r => r.restrictionType === 'LICENSE_REQUIRED')) {
      const hasValidLicense = licenses.some(l => 
        (l.documentType === 'EXPORT_LICENSE' || l.documentType === 'IMPORT_LICENSE') &&
        l.status === 'APPROVED' &&
        (!l.expiryDate || l.expiryDate > new Date())
      );
      
      if (!hasValidLicense) {
        checks.push({
          checkType: 'LICENSE_VALIDITY',
          status: 'FAIL',
          details: `Item ${item.lineNumber} requires valid license`,
          severity: 'HIGH',
        });
        riskScore += 30;
      }
    }
  });
  
  // Check HS code classification
  declaration.items.forEach(item => {
    if (!item.hsCode || item.hsCode.length < 6) {
      checks.push({
        checkType: 'HS_CLASSIFICATION',
        status: 'WARNING',
        details: `Item ${item.lineNumber} has incomplete HS code`,
        severity: 'MEDIUM',
      });
      riskScore += 10;
    }
  });
  
  // Check documentation completeness
  const requiredDocs = declaration.declarationType === 'IMPORT'
    ? ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'BILL_OF_LADING']
    : ['COMMERCIAL_INVOICE', 'PACKING_LIST'];
  
  requiredDocs.forEach(docType => {
    const hasDoc = licenses.some(l => l.documentType === docType && l.status === 'ISSUED');
    if (!hasDoc) {
      checks.push({
        checkType: 'DOCUMENTATION',
        status: 'FAIL',
        details: `Missing required document: ${docType}`,
        severity: 'HIGH',
      });
      riskScore += 20;
    }
  });
  
  const overallStatus: ComplianceCheck['overallStatus'] = 
    checks.some(c => c.status === 'FAIL' && c.severity === 'CRITICAL') ? 'NON_COMPLIANT' :
    checks.some(c => c.status === 'FAIL') ? 'REVIEW_REQUIRED' :
    'COMPLIANT';
  
  return {
    checkId: `CHK-${declaration.declarationId}`,
    shipmentId: declaration.shipmentId,
    checkDate: new Date(),
    checks,
    overallStatus,
    riskScore: Math.min(riskScore, 100),
  };
}

export function calculateLandedCost(
  productCost: number,
  freightCost: number,
  insuranceCost: number,
  duties: number,
  taxes: number,
  brokerFees: number
): {
  totalLandedCost: number;
  costBreakdown: Record<string, number>;
  landedCostPercentage: number;
} {
  const totalLandedCost = productCost + freightCost + insuranceCost + duties + taxes + brokerFees;
  
  const costBreakdown = {
    productCost,
    freightCost,
    insuranceCost,
    duties,
    taxes,
    brokerFees,
  };
  
  const landedCostPercentage = productCost > 0 
    ? ((totalLandedCost - productCost) / productCost) * 100 
    : 0;
  
  return {
    totalLandedCost,
    costBreakdown,
    landedCostPercentage,
  };
}

export function determinePreferentialTreatment(
  originCountry: string,
  destinationCountry: string,
  hsCode: string,
  tradeAgreements: Array<{
    name: string;
    countries: string[];
    hsCodeCoverage: string[];
    reductionPercentage: number;
  }>
): {
  isEligible: boolean;
  agreement?: string;
  dutyReduction: number;
  requiredDocuments: string[];
} {
  const applicableAgreements = tradeAgreements.filter(agreement =>
    agreement.countries.includes(originCountry) &&
    agreement.countries.includes(destinationCountry) &&
    (agreement.hsCodeCoverage.includes(hsCode) || agreement.hsCodeCoverage.includes('ALL'))
  );
  
  if (applicableAgreements.length === 0) {
    return {
      isEligible: false,
      dutyReduction: 0,
      requiredDocuments: [],
    };
  }
  
  // Select agreement with highest reduction
  const bestAgreement = applicableAgreements.sort((a, b) => 
    b.reductionPercentage - a.reductionPercentage
  )[0];
  
  return {
    isEligible: true,
    agreement: bestAgreement.name,
    dutyReduction: bestAgreement.reductionPercentage,
    requiredDocuments: ['CERTIFICATE_OF_ORIGIN'],
  };
}

export function analyzeTradeMetrics(declarations: CustomsDeclaration[]): {
  totalDeclarations: number;
  clearanceRate: number;
  avgClearanceTime: number;
  totalDutiesPaid: number;
  topHSCodes: Array<{ hsCode: string; count: number; totalValue: number }>;
  complianceIssues: number;
} {
  const totalDeclarations = declarations.length;
  const clearedDeclarations = declarations.filter(d => d.status === 'CLEARED');
  const clearanceRate = totalDeclarations > 0 ? (clearedDeclarations.length / totalDeclarations) * 100 : 0;
  
  let totalClearanceTime = 0;
  let totalDutiesPaid = 0;
  const complianceIssues = declarations.filter(d => d.status === 'HELD' || d.status === 'REJECTED').length;
  
  const hsCodeStats = new Map<string, { count: number; totalValue: number }>();
  
  clearedDeclarations.forEach(decl => {
    if (decl.clearanceDate && decl.declarationDate) {
      const clearanceHours = (decl.clearanceDate.getTime() - decl.declarationDate.getTime()) / (1000 * 60 * 60);
      totalClearanceTime += clearanceHours;
    }
    
    totalDutiesPaid += decl.totalDuties;
    
    decl.items.forEach(item => {
      if (!hsCodeStats.has(item.hsCode)) {
        hsCodeStats.set(item.hsCode, { count: 0, totalValue: 0 });
      }
      const stats = hsCodeStats.get(item.hsCode)!;
      stats.count++;
      stats.totalValue += item.totalValue;
    });
  });
  
  const avgClearanceTime = clearedDeclarations.length > 0 
    ? totalClearanceTime / clearedDeclarations.length 
    : 0;
  
  const topHSCodes = Array.from(hsCodeStats.entries())
    .map(([hsCode, stats]) => ({ hsCode, ...stats }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);
  
  return {
    totalDeclarations,
    clearanceRate,
    avgClearanceTime,
    totalDutiesPaid,
    topHSCodes,
    complianceIssues,
  };
}
