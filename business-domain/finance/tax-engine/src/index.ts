/**
 * @see FIN-TAX-CALC-01 — Tax calculation is correct, rounded deterministically
 */

export { calculateDocumentTaxes, calculateLineTax } from './calculators/tax-calc';
export type { RoundingMethod, TaxChargeType, TaxRow } from './calculators/tax-calc';

export { buildTaxAdjustIntent } from './commands/tax-intent';
export type { TaxAdjustPayload } from './commands/tax-intent';

export type { TaxRateReadModel } from './queries/tax-rate-query';

export { calculateLineTaxForDocument, getTaxRate } from './services/tax-service';
export type { TaxResult } from './services/tax-service';

export { validateSaftData } from './calculators/saft-export';
export type {
  SaftExportResult,
  SaftTransaction,
  SaftValidationIssue
} from './calculators/saft-export';

export { mapToCountryFormat } from './calculators/country-tax-format';
export type {
  CountryFormat,
  CountryTaxFormatResult,
  TaxLineItem,
  TaxReturnBox
} from './calculators/country-tax-format';

export { TAX_BOX_SCHEMAS, computeTaxBoxes } from './calculators/tax-box-schema';
export type { TaxBoxDefinition, TaxBoxSchema } from './calculators/tax-box-schema';

