/**
 * XBRL Tagging Service
 * 
 * XBRL (eXtensible Business Reporting Language) tagging for financial data
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { XBRLTagging } from '../types/common.js';
import { XBRLElementType, xbrlTaggingSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createXBRLTagSchema = xbrlTaggingSchema.omit({ id: true });

export const bulkTaggingSchema = z.object({
  filingId: z.string().uuid(),
  tags: z.array(createXBRLTagSchema.omit({ filingId: true })),
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateXBRLTagInput = z.infer<typeof createXBRLTagSchema>;
export type BulkTaggingInput = z.infer<typeof bulkTaggingSchema>;

// Common GAAP taxonomy elements
export const GAAP_ELEMENTS = {
  // Balance Sheet
  ASSETS: 'us-gaap:Assets',
  LIABILITIES: 'us-gaap:Liabilities',
  STOCKHOLDERS_EQUITY: 'us-gaap:StockholdersEquity',
  CASH_AND_EQUIVALENTS: 'us-gaap:CashAndCashEquivalentsAtCarryingValue',
  ACCOUNTS_RECEIVABLE: 'us-gaap:AccountsReceivableNetCurrent',
  INVENTORY: 'us-gaap:InventoryNet',
  PROPERTY_PLANT_EQUIPMENT: 'us-gaap:PropertyPlantAndEquipmentNet',

  // Income Statement
  REVENUE: 'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',
  COST_OF_REVENUE: 'us-gaap:CostOfRevenue',
  GROSS_PROFIT: 'us-gaap:GrossProfit',
  OPERATING_EXPENSES: 'us-gaap:OperatingExpenses',
  OPERATING_INCOME: 'us-gaap:OperatingIncomeLoss',
  NET_INCOME: 'us-gaap:NetIncomeLoss',
  EARNINGS_PER_SHARE_BASIC: 'us-gaap:EarningsPerShareBasic',
  EARNINGS_PER_SHARE_DILUTED: 'us-gaap:EarningsPerShareDiluted',

  // Cash Flow
  CASH_FROM_OPERATING: 'us-gaap:NetCashProvidedByUsedInOperatingActivities',
  CASH_FROM_INVESTING: 'us-gaap:NetCashProvidedByUsedInInvestingActivities',
  CASH_FROM_FINANCING: 'us-gaap:NetCashProvidedByUsedInFinancingActivities',
} as const;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create XBRL tag
 */
export async function createXBRLTag(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateXBRLTagInput,
): Promise<XBRLTagging> {
  const validated = createXBRLTagSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate element name against taxonomy
  // 2. Validate context reference
  // 3. Create XBRL tag
  // 4. Return tag

  throw new Error('Not implemented');
}

/**
 * Create multiple XBRL tags in bulk
 */
export async function bulkCreateXBRLTags(
  db: NeonHttpDatabase,
  orgId: string,
  input: BulkTaggingInput,
): Promise<XBRLTagging[]> {
  const validated = bulkTaggingSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate all tags
  // 2. Bulk insert tags
  // 3. Return created tags

  throw new Error('Not implemented');
}

/**
 * Get all XBRL tags for a filing
 */
export async function getFilingXBRLTags(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
): Promise<XBRLTagging[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Generate XBRL instance document
 */
export async function generateXBRLInstance(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
): Promise<string> {
  // TODO: Implement XBRL generation
  // 1. Get all tags for filing
  // 2. Get company info (CIK, name, etc.)
  // 3. Generate XML header
  // 4. Generate contexts
  // 5. Generate units
  // 6. Generate facts
  // 7. Return XML string

  throw new Error('Not implemented');
}

/**
 * Validate XBRL instance document
 */
export function validateXBRLInstance(xbrlXml: string): {
  isValid: boolean;
  errors: Array<{
    code: string;
    message: string;
    line?: number;
  }>;
  warnings: Array<{
    code: string;
    message: string;
    line?: number;
  }>;
} {
  // TODO: Implement XBRL validation
  // 1. Check XML well-formedness
  // 2. Validate against XBRL schema
  // 3. Validate against GAAP taxonomy
  // 4. Check calculation linkbase
  // 5. Validate contexts and units
  // 6. Return validation results

  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
}

/**
 * Map financial statement account to GAAP element
 */
export function mapAccountToGAAPElement(
  accountName: string,
  statementType: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW',
): string | null {
  // Simple mapping - in production, use comprehensive mapping table
  const mappings: Record<string, string> = {
    // Balance Sheet
    'cash': GAAP_ELEMENTS.CASH_AND_EQUIVALENTS,
    'accounts receivable': GAAP_ELEMENTS.ACCOUNTS_RECEIVABLE,
    'inventory': GAAP_ELEMENTS.INVENTORY,
    'total assets': GAAP_ELEMENTS.ASSETS,
    'total liabilities': GAAP_ELEMENTS.LIABILITIES,
    "stockholders' equity": GAAP_ELEMENTS.STOCKHOLDERS_EQUITY,

    // Income Statement
    'revenue': GAAP_ELEMENTS.REVENUE,
    'sales': GAAP_ELEMENTS.REVENUE,
    'cost of goods sold': GAAP_ELEMENTS.COST_OF_REVENUE,
    'gross profit': GAAP_ELEMENTS.GROSS_PROFIT,
    'operating income': GAAP_ELEMENTS.OPERATING_INCOME,
    'net income': GAAP_ELEMENTS.NET_INCOME,

    // Cash Flow
    'operating cash flow': GAAP_ELEMENTS.CASH_FROM_OPERATING,
    'investing cash flow': GAAP_ELEMENTS.CASH_FROM_INVESTING,
    'financing cash flow': GAAP_ELEMENTS.CASH_FROM_FINANCING,
  };

  const normalized = accountName.toLowerCase().trim();
  return mappings[normalized] || null;
}

/**
 * Create context reference for period
 */
export function createContextRef(
  periodType: 'INSTANT' | 'DURATION',
  endDate: Date,
  startDate?: Date,
): string {
  const dateStr = formatDate(endDate);

  if (periodType === 'INSTANT') {
    return `AsOf_${dateStr}`;
  }

  const startStr = startDate ? formatDate(startDate) : '';
  return `From_${startStr}_To_${dateStr}`;
}

/**
 * Format date for XBRL (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Determine unit reference for element type
 */
export function getUnitRef(elementType: XBRLElementType): string | undefined {
  switch (elementType) {
    case XBRLElementType.MONETARY:
      return 'USD';
    case XBRLElementType.SHARES:
      return 'shares';
    case XBRLElementType.PURE:
      return 'pure';
    default:
      return undefined;
  }
}

