/**
 * @afenda-payroll
 * 
 * Enterprise payroll processing and tax compliance.
 */

export {
  processPayroll,
  calculateGrossToNet,
  type PayrollRun,
  type GrossToNet,
} from './services/payroll-processing.js';

export {
  calculateWithholding,
  determineTaxStatus,
  type TaxWithholding,
  type TaxStatus,
} from './services/tax-withholding.js';

export {
  generateW2,
  reconcile941,
  type W2Form,
  type Form941Reconciliation,
} from './services/year-end-reporting.js';

export {
  applyGarnishment,
  calculateGarnishment,
  type Garnishment,
  type GarnishmentCalculation,
} from './services/garnishments.js';

export {
  analyzeLaborCost,
  distributeCost,
  type LaborCostAnalysis,
  type CostDistribution,
} from './services/payroll-analytics.js';
