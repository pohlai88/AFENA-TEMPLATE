import type { OrgId } from '../types/ids';

/**
 * TaxRatePort — cross-cutting read interface for tax code resolution.
 *
 * Implemented by: tax-engine adapter
 * Consumed by: accounting, payables, receivables, subscription-billing
 *
 * Rule: Returns domain DTOs, never Drizzle row types.
 */

export type TaxType = 'vat' | 'gst' | 'sst' | 'sales_tax' | 'withholding' | 'excise';

export interface TaxRateInfo {
  taxCode: string;
  taxType: TaxType;
  rate: number;
  jurisdiction: string;
  effectiveFrom: string;
  effectiveTo?: string;
  description?: string;
}

export interface TaxRatePort {
  /** Resolve the applicable tax rate for a tax code on a given date. */
  resolveTaxRate(orgId: OrgId, taxCode: string, effectiveDate: string): Promise<TaxRateInfo | null>;

  /** Resolve by jurisdiction hierarchy (country → state → city). */
  resolveByJurisdiction(
    orgId: OrgId,
    jurisdiction: string,
    taxType: TaxType,
    effectiveDate: string,
  ): Promise<TaxRateInfo | null>;

  /** List all active tax codes for a jurisdiction. */
  listTaxCodes(orgId: OrgId, jurisdiction: string): Promise<readonly TaxRateInfo[]>;
}
