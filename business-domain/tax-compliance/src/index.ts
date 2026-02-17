/**
 * @afenda-tax-compliance
 * 
 * Enterprise tax compliance and reporting.
 */

export {
  calculateVAT,
  fileVATReturn,
  type VATCalculation,
  type VATReturn,
} from './services/vat-gst-management.js';

export {
  determineNexus,
  calculateSalesTax,
  type NexusDetermination,
  type SalesTaxCalculation,
} from './services/sales-tax.js';

export {
  classify1099Vendor,
  generate1099Form,
  type Vendor1099Classification,
  type Form1099,
} from './services/1099-reporting.js';

export {
  calculateTaxProvision,
  reconcileDeferredTax,
  type TaxProvision,
  type DeferredTaxReconciliation,
} from './services/tax-provision.js';

export {
  analyzeTaxLiability,
  prepareAuditPackage,
  type TaxLiabilityAnalysis,
  type AuditPackage,
} from './services/compliance-analytics.js';
