/**
 * @afenda-benefits
 * 
 * Enterprise benefits administration and enrollment management.
 */

export {
  enrollEmployee,
  processOpenEnrollment,
  type EmployeeEnrollment,
  type OpenEnrollmentResult,
} from './services/enrollment.js';

export {
  submitClaim,
  adjudicateClaim,
  type BenefitsClaim,
  type ClaimAdjudication,
} from './services/claims.js';

export {
  initiateCOBRA,
  calculateCOBRAPremium,
  type COBRAEnrollment,
  type COBRAPremium,
} from './services/cobra.js';

export {
  contributeFSA,
  reimburseExpense,
  type FSAContribution,
  type ExpenseReimbursement,
} from './services/fsa.js';

export {
  analyzeBenefitsUtilization,
  calculateBenefitsCost,
  type BenefitsUtilization,
  type BenefitsCost,
} from './services/benefits-analytics.js';
