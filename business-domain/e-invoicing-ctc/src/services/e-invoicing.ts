/**
 * Electronic Invoicing & Continuous Transaction Controls (CTC) Service
 * Manages e-invoicing, real-time tax reporting, clearance models, and compliance
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface EInvoice {
  invoiceId: string;
  invoiceNumber: string;
  invoiceType: 'STANDARD' | 'CREDIT_NOTE' | 'DEBIT_NOTE' | 'SELF_BILLING' | 'PREPAYMENT';
  jurisdiction: string; // Country/region code
  status: 'DRAFT' | 'VALIDATED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  
  // Parties
  sellerTaxId: string;
  sellerName: string;
  sellerAddress: string;
  buyerTaxId: string;
  buyerName: string;
  buyerAddress: string;

  // Document details
  issueDate: Date;
  dueDate?: Date;
  currency: string;
  exchangeRate?: number;
  
  // Amounts
  lineItems: EInvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  
  // Tax breakdown
  taxBreakdown: TaxBreakdown[];
  
  // CTC metadata
  ctcModel: 'CLEARANCE' | 'POST_AUDIT' | 'HYBRID';
  taxAuthorityId?: string; // UUID from tax authority
  qrCode?: string;
  digitalSignature?: string;
  validationErrors?: ValidationError[];
  
  submittedDate?: Date;
  approvalDate?: Date;
}

export interface EInvoiceLineItem {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  taxRate: number;
  taxAmount: number;
  productCode?: string;
  hsCode?: string;
}

export interface TaxBreakdown {
  taxType: 'VAT' | 'GST' | 'SALES_TAX' | 'EXCISE' | 'WITHHOLDING' | 'OTHER';
  taxCategory: string; // Standard, Reduced, Zero-rated, Exempt
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface ValidationError {
  errorCode: string;
  field: string;
  severity: 'ERROR' | 'WARNING';
  message: string;
}

export interface CTCSubmission {
  submissionId: string;
  invoiceId: string;
  jurisdiction: string;
  submissionDate: Date;
  ctcModel: 'CLEARANCE' | 'POST_AUDIT' | 'HYBRID';
  
  // Request/Response
  requestPayload: string; // XML/JSON
  requestFormat: 'UBL' | 'EDIFACT' | 'JSON' | 'XML_CUSTOM';
  responsePayload?: string;
  responseCode?: string;
  
  // Status
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'TIMEOUT' | 'ERROR';
  taxAuthorityReference?: string;
  rejectionReasons?: string[];
  
  // Timing
  responseTime?: number; // milliseconds
  retryCount: number;
  maxRetries: number;
}

export interface JurisdictionConfig {
  jurisdiction: string;
  isEnabled: boolean;
  ctcModel: 'CLEARANCE' | 'POST_AUDIT' | 'HYBRID';
  mandatoryDate?: Date;
  invoiceFormat: 'UBL' | 'EDIFACT' | 'JSON' | 'XML_CUSTOM';
  
  // Endpoints
  validationEndpoint?: string;
  submissionEndpoint?: string;
  cancellationEndpoint?: string;
  
  // Requirements
  requiresDigitalSignature: boolean;
  requiresQRCode: boolean;
  requiresRealTimeSubmission: boolean;
  maxSubmissionDelay?: number; // hours
  
  // Validation rules
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  ruleId: string;
  field: string;
  ruleType: 'REQUIRED' | 'FORMAT' | 'RANGE' | 'PATTERN' | 'CUSTOM';
  parameters: Record<string, unknown>;
  errorMessage: string;
}

export interface CTCCompliance {
  complianceId: string;
  jurisdiction: string;
  periodStart: Date;
  periodEnd: Date;
  
  // Metrics
  totalInvoices: number;
  submittedInvoices: number;
  approvedInvoices: number;
  rejectedInvoices: number;
  pendingInvoices: number;
  
  // Compliance rates
  submissionRate: number; // %
  approvalRate: number; // %
  onTimeSubmissionRate: number; // %
  
  // Issues
  complianceIssues: ComplianceIssue[];
  overallStatus: 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT';
}

export interface ComplianceIssue {
  issueId: string;
  issueType: 'LATE_SUBMISSION' | 'VALIDATION_FAILURE' | 'REJECTION' | 'MISSING_SIGNATURE' | 'FORMAT_ERROR';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  invoiceIds: string[];
  description: string;
  resolution?: string;
  resolvedDate?: Date;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createEInvoice(
  invoice: Omit<EInvoice, 'invoiceId'>
): Promise<EInvoice> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function validateEInvoice(
  invoiceId: string
): Promise<{ isValid: boolean; errors: ValidationError[] }> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function submitToCTC(
  submission: Omit<CTCSubmission, 'submissionId'>
): Promise<CTCSubmission> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function generateQRCode(invoiceId: string): Promise<string> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function signEInvoice(invoiceId: string): Promise<string> {
  // TODO: Implement with Drizzle ORM (digital signature)
  throw new Error('Not implemented');
}

export async function getJurisdictionConfig(
  jurisdiction: string
): Promise<JurisdictionConfig | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function trackCTCCompliance(
  compliance: Omit<CTCCompliance, 'complianceId'>
): Promise<CTCCompliance> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateInvoiceId(jurisdiction: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${jurisdiction}-INV-${dateStr}-${sequence}`;
}

export function calculateTotals(invoice: Omit<EInvoice, 'subtotal' | 'taxAmount' | 'totalAmount'>): {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
} {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.lineAmount, 0);
  const taxAmount = invoice.lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
  const totalAmount = subtotal + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

export function generateTaxBreakdown(lineItems: EInvoiceLineItem[]): TaxBreakdown[] {
  const breakdownMap = new Map<string, TaxBreakdown>();

  lineItems.forEach(item => {
    const key = `VAT-${item.taxRate}`;
    
    if (!breakdownMap.has(key)) {
      breakdownMap.set(key, {
        taxType: 'VAT',
        taxCategory: determineTaxCategory(item.taxRate),
        taxRate: item.taxRate,
        taxableAmount: 0,
        taxAmount: 0,
      });
    }

    const breakdown = breakdownMap.get(key)!;
    breakdown.taxableAmount += item.lineAmount;
    breakdown.taxAmount += item.taxAmount;
  });

  return Array.from(breakdownMap.values()).map(bd => ({
    ...bd,
    taxableAmount: Math.round(bd.taxableAmount * 100) / 100,
    taxAmount: Math.round(bd.taxAmount * 100) / 100,
  }));
}

function determineTaxCategory(taxRate: number): string {
  if (taxRate === 0) return 'ZERO_RATED';
  if (taxRate > 0 && taxRate < 10) return 'REDUCED';
  if (taxRate >= 10) return 'STANDARD';
  return 'EXEMPT';
}

export function performValidation(
  invoice: EInvoice,
  config: JurisdictionConfig
): ValidationError[] {
  const errors: ValidationError[] = [];

  config.validationRules.forEach(rule => {
    const fieldValue = getFieldValue(invoice, rule.field);

    switch (rule.ruleType) {
      case 'REQUIRED':
        if (!fieldValue || fieldValue === '') {
          errors.push({
            errorCode: 'ERR_REQUIRED_FIELD',
            field: rule.field,
            severity: 'ERROR',
            message: rule.errorMessage,
          });
        }
        break;

      case 'FORMAT':
        const format = rule.parameters.format as string;
        if (fieldValue && !validateFormat(String(fieldValue), format)) {
          errors.push({
            errorCode: 'ERR_INVALID_FORMAT',
            field: rule.field,
            severity: 'ERROR',
            message: rule.errorMessage,
          });
        }
        break;

      case 'RANGE':
        const min = rule.parameters.min as number;
        const max = rule.parameters.max as number;
        const numValue = Number(fieldValue);
        if (!isNaN(numValue) && (numValue < min || numValue > max)) {
          errors.push({
            errorCode: 'ERR_OUT_OF_RANGE',
            field: rule.field,
            severity: 'WARNING',
            message: rule.errorMessage,
          });
        }
        break;

      case 'PATTERN':
        const pattern = new RegExp(rule.parameters.pattern as string);
        if (fieldValue && !pattern.test(String(fieldValue))) {
          errors.push({
            errorCode: 'ERR_PATTERN_MISMATCH',
            field: rule.field,
            severity: 'ERROR',
            message: rule.errorMessage,
          });
        }
        break;
    }
  });

  // Business rule validations
  if (invoice.totalAmount <= 0) {
    errors.push({
      errorCode: 'ERR_INVALID_TOTAL',
      field: 'totalAmount',
      severity: 'ERROR',
      message: 'Invoice total must be greater than zero',
    });
  }

  // Tax calculation validation (tolerance 0.01)
  const calculatedTotals = calculateTotals(invoice);
  if (Math.abs(invoice.taxAmount - calculatedTotals.taxAmount) > 0.01) {
    errors.push({
      errorCode: 'ERR_TAX_MISMATCH',
      field: 'taxAmount',
      severity: 'ERROR',
      message: `Tax calculation mismatch: expected ${calculatedTotals.taxAmount}, got ${invoice.taxAmount}`,
    });
  }

  return errors;
}

function getFieldValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
  }, obj);
}

function validateFormat(value: string, format: string): boolean {
  const formatPatterns: Record<string, RegExp> = {
    'EMAIL': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'TAX_ID': /^[A-Z0-9]{8,15}$/,
    'PHONE': /^\+?[1-9]\d{1,14}$/,
    'DATE': /^\d{4}-\d{2}-\d{2}$/,
    'CURRENCY': /^[A-Z]{3}$/,
  };

  const pattern = formatPatterns[format];
  return pattern ? pattern.test(value) : true;
}

export function convertToUBL(invoice: EInvoice): string {
  // UBL 2.1 format (simplified)
  // In production, use proper UBL library
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${invoice.issueDate.toISOString().split('T')[0]}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>${invoice.invoiceType}</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>${invoice.currency}</cbc:DocumentCurrencyCode>
  
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${invoice.sellerTaxId}</cbc:CompanyID>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${invoice.sellerName}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${invoice.buyerTaxId}</cbc:CompanyID>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${invoice.buyerName}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingCustomerParty>
  
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${invoice.currency}">${invoice.taxAmount}</cbc:TaxAmount>
  </cac:TaxTotal>
  
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${invoice.currency}">${invoice.subtotal}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${invoice.currency}">${invoice.subtotal}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${invoice.currency}">${invoice.totalAmount}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="${invoice.currency}">${invoice.totalAmount}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;
}

export function determineSubmissionUrgency(
  invoice: EInvoice,
  config: JurisdictionConfig
): 'IMMEDIATE' | 'URGENT' | 'NORMAL' {
  if (!config.requiresRealTimeSubmission) {
    return 'NORMAL';
  }

  if (config.maxSubmissionDelay === undefined) {
    return 'IMMEDIATE';
  }

  const hoursSinceIssue = 
    (new Date().getTime() - invoice.issueDate.getTime()) / (1000 * 60 * 60);

  const remainingHours = config.maxSubmissionDelay - hoursSinceIssue;

  if (remainingHours <= 0) {
    return 'IMMEDIATE'; // Overdue
  } else if (remainingHours <= config.maxSubmissionDelay * 0.1) {
    return 'URGENT'; // Within 10% of deadline
  } else {
    return 'NORMAL';
  }
}

export function calculateComplianceRate(
  invoices: EInvoice[],
  config: JurisdictionConfig
): {
  submissionRate: number;
  approvalRate: number;
  onTimeRate: number;
  avgResponseTime: number;
} {
  const totalInvoices = invoices.length;
  if (totalInvoices === 0) {
    return { submissionRate: 0, approvalRate: 0, onTimeRate: 0, avgResponseTime: 0 };
  }

  const submitted = invoices.filter(inv => 
    ['SUBMITTED', 'APPROVED', 'REJECTED'].includes(inv.status)
  ).length;

  const approved = invoices.filter(inv => inv.status === 'APPROVED').length;

  let onTimeCount = 0;
  let totalResponseTime = 0;
  let responseCount = 0;

  invoices.forEach(invoice => {
    if (invoice.submittedDate && config.maxSubmissionDelay) {
      const hoursToSubmit = 
        (invoice.submittedDate.getTime() - invoice.issueDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursToSubmit <= config.maxSubmissionDelay) {
        onTimeCount++;
      }
    }

    if (invoice.submittedDate && invoice.approvalDate) {
      const responseTime = 
        (invoice.approvalDate.getTime() - invoice.submittedDate.getTime()) / 1000;
      totalResponseTime += responseTime;
      responseCount++;
    }
  });

  return {
    submissionRate: (submitted / totalInvoices) * 100,
    approvalRate: submitted > 0 ? (approved / submitted) * 100 : 0,
    onTimeRate: config.maxSubmissionDelay ? (onTimeCount / totalInvoices) * 100 : 100,
    avgResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
  };
}

export function identifyComplianceIssues(
  invoices: EInvoice[],
  config: JurisdictionConfig
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  // Late submissions
  const lateInvoices = invoices.filter(inv => {
    if (!inv.submittedDate || !config.maxSubmissionDelay) return false;
    const hoursToSubmit = 
      (inv.submittedDate.getTime() - inv.issueDate.getTime()) / (1000 * 60 * 60);
    return hoursToSubmit > config.maxSubmissionDelay;
  });

  if (lateInvoices.length > 0) {
    issues.push({
      issueId: `ISSUE-LATE-${Date.now()}`,
      issueType: 'LATE_SUBMISSION',
      severity: lateInvoices.length > 10 ? 'CRITICAL' : 'HIGH',
      invoiceIds: lateInvoices.map(inv => inv.invoiceId),
      description: `${lateInvoices.length} invoices submitted late (>${config.maxSubmissionDelay}h)`,
    });
  }

  // Validation failures
  const validationFailures = invoices.filter(inv => 
    inv.validationErrors && inv.validationErrors.length > 0
  );

  if (validationFailures.length > 0) {
    issues.push({
      issueId: `ISSUE-VAL-${Date.now()}`,
      issueType: 'VALIDATION_FAILURE',
      severity: 'HIGH',
      invoiceIds: validationFailures.map(inv => inv.invoiceId),
      description: `${validationFailures.length} invoices with validation errors`,
    });
  }

  // Rejections
  const rejections = invoices.filter(inv => inv.status === 'REJECTED');

  if (rejections.length > 0) {
    issues.push({
      issueId: `ISSUE-REJ-${Date.now()}`,
      issueType: 'REJECTION',
      severity: 'CRITICAL',
      invoiceIds: rejections.map(inv => inv.invoiceId),
      description: `${rejections.length} invoices rejected by tax authority`,
    });
  }

  // Missing signatures (if required)
  if (config.requiresDigitalSignature) {
    const missingSignature = invoices.filter(inv => !inv.digitalSignature);
    
    if (missingSignature.length > 0) {
      issues.push({
        issueId: `ISSUE-SIG-${Date.now()}`,
        issueType: 'MISSING_SIGNATURE',
        severity: 'MEDIUM',
        invoiceIds: missingSignature.map(inv => inv.invoiceId),
        description: `${missingSignature.length} invoices missing required digital signature`,
      });
    }
  }

  return issues;
}

export function analyzeRejectionPatterns(
  submissions: CTCSubmission[]
): Array<{
  reason: string;
  count: number;
  percentage: number;
  affectedJurisdictions: string[];
}> {
  const rejectedSubmissions = submissions.filter(sub => sub.status === 'REJECTED');
  const totalRejections = rejectedSubmissions.length;

  if (totalRejections === 0) return [];

  const reasonMap = new Map<string, { count: number; jurisdictions: Set<string> }>();

  rejectedSubmissions.forEach(sub => {
    if (sub.rejectionReasons) {
      sub.rejectionReasons.forEach(reason => {
        if (!reasonMap.has(reason)) {
          reasonMap.set(reason, { count: 0, jurisdictions: new Set() });
        }
        const data = reasonMap.get(reason)!;
        data.count++;
        data.jurisdictions.add(sub.jurisdiction);
      });
    }
  });

  return Array.from(reasonMap.entries())
    .map(([reason, data]) => ({
      reason,
      count: data.count,
      percentage: (data.count / totalRejections) * 100,
      affectedJurisdictions: Array.from(data.jurisdictions),
    }))
    .sort((a, b) => b.count - a.count);
}

export function generateComplianceDashboard(
  compliance: CTCCompliance
): {
  overallHealth: number; // 0-100
  criticalIssues: number;
  recommendations: string[];
} {
  const criticalIssues = compliance.complianceIssues.filter(
    issue => issue.severity === 'CRITICAL' && !issue.resolvedDate
  ).length;

  // Health score calculation
  let healthScore = 100;
  
  // Deduct for submission rate
  if (compliance.submissionRate < 95) {
    healthScore -= (95 - compliance.submissionRate) * 2;
  }
  
  // Deduct for approval rate
  if (compliance.approvalRate < 90) {
    healthScore -= (90 - compliance.approvalRate) * 1.5;
  }
  
  // Deduct for on-time rate
  if (compliance.onTimeSubmissionRate < 98) {
    healthScore -= (98 - compliance.onTimeSubmissionRate) * 1.5;
  }
  
  // Deduct for critical issues
  healthScore -= criticalIssues * 5;

  healthScore = Math.max(0, Math.round(healthScore));

  // Recommendations
  const recommendations: string[] = [];
  
  if (compliance.submissionRate < 95) {
    recommendations.push('Increase submission automation to achieve >95% submission rate');
  }
  
  if (compliance.approvalRate < 90) {
    recommendations.push('Review and fix common validation errors to improve approval rate');
  }
  
  if (compliance.onTimeSubmissionRate < 98) {
    recommendations.push('Implement real-time submission triggers to reduce delays');
  }
  
  if (criticalIssues > 0) {
    recommendations.push(`Resolve ${criticalIssues} critical compliance issue(s) immediately`);
  }

  return {
    overallHealth: healthScore,
    criticalIssues,
    recommendations,
  };
}
