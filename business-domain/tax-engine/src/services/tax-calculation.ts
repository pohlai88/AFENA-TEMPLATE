import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TaxRule {
  id: string;
  jurisdiction: string;
  taxType: 'INCOME' | 'SALES' | 'VAT' | 'PAYROLL' | 'EXCISE';
  effectiveDate: Date;
  expiryDate?: Date;
  rate: number;
  brackets?: Array<{ min: number; max: number; rate: number }>;
  exemptions?: string[];
}

export interface TaxCalculation {
  transactionId: string;
  jurisdiction: string;
  taxType: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  appliedRules: string[];
}

export async function getTaxRules(
  db: NeonHttpDatabase,
  jurisdiction: string,
  taxType: string,
  asOfDate: Date,
): Promise<TaxRule[]> {
  // TODO: Query active tax rules for jurisdiction
  throw new Error('Database integration pending');
}

export async function calculateTax(
  db: NeonHttpDatabase,
  transactionAmount: number,
  jurisdiction: string,
  taxType: string,
  itemCategory?: string,
): Promise<TaxCalculation> {
  // TODO: Calculate tax based on active rules
  throw new Error('Database integration pending');
}

export function calculateSalesTax(
  amount: number,
  taxRules: TaxRule[],
  itemCategory: string,
): { taxAmount: number; taxRate: number; appliedRules: string[] } {
  let totalTax = 0;
  const appliedRules: string[] = [];
  let effectiveRate = 0;

  for (const rule of taxRules) {
    // Check exemptions
    if (rule.exemptions?.includes(itemCategory)) {
      continue;
    }

    const taxAmount = amount * (rule.rate / 100);
    totalTax += taxAmount;
    effectiveRate += rule.rate;
    appliedRules.push(rule.id);
  }

  return {
    taxAmount: Math.round(totalTax * 100) / 100,
    taxRate: effectiveRate,
    appliedRules,
  };
}

export function calculateIncomeTax(
  income: number,
  brackets: Array<{ min: number; max: number; rate: number }>,
): { taxAmount: number; effectiveRate: number; marginalRate: number } {
  let taxAmount = 0;
  let marginalRate = 0;

  for (const bracket of brackets) {
    if (income > bracket.min) {
      const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
      taxAmount += taxableInBracket * (bracket.rate / 100);
      marginalRate = bracket.rate;
    }
  }

  const effectiveRate = income > 0 ? (taxAmount / income) * 100 : 0;

  return { taxAmount, effectiveRate, marginalRate };
}

export function calculateVAT(
  netAmount: number,
  vatRate: number,
  inclusive: boolean = false,
): { netAmount: number; vatAmount: number; grossAmount: number } {
  if (inclusive) {
    // VAT is included in the amount
    const grossAmount = netAmount;
    const vatAmount = grossAmount - grossAmount / (1 + vatRate / 100);
    return {
      netAmount: grossAmount - vatAmount,
      vatAmount: Math.round(vatAmount * 100) / 100,
      grossAmount,
    };
  } else {
    // VAT is added to the amount
    const vatAmount = netAmount * (vatRate / 100);
    return {
      netAmount,
      vatAmount: Math.round(vatAmount * 100) / 100,
      grossAmount: netAmount + vatAmount,
    };
  }
}

export function determineTaxJurisdiction(
  buyerLocation: { country: string; state?: string; city?: string },
  sellerLocation: { country: string; state?: string },
  productType: string,
): string[] {
  const jurisdictions: string[] = [];

  // Federal/national level
  jurisdictions.push(buyerLocation.country);

  // State/provincial level (US/Canada)
  if (buyerLocation.state) {
    jurisdictions.push(`${buyerLocation.country}-${buyerLocation.state}`);
  }

  // Local level (for some jurisdictions)
  if (buyerLocation.city) {
    jurisdictions.push(`${buyerLocation.country}-${buyerLocation.state}-${buyerLocation.city}`);
  }

  return jurisdictions;
}

export function reconcileTaxAccounts(
  collected: number,
  remitted: number,
  accrued: number,
): { variance: number; status: 'BALANCED' | 'OVER_REMITTED' | 'UNDER_REMITTED' } {
  const variance = collected - remitted;
  
  let status: 'BALANCED' | 'OVER_REMITTED' | 'UNDER_REMITTED' = 'BALANCED';
  if (Math.abs(variance) > 0.01) {
    status = variance > 0 ? 'UNDER_REMITTED' : 'OVER_REMITTED';
  }

  return { variance, status };
}
