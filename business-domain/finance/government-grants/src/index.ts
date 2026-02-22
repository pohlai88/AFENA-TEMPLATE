/**
 * Government Grants — IAS 20
 */

/** @see FIN-GG-REC-01 — Government grant queries (IAS 20) */
export { getGrant, listActiveGrants } from './queries/grant-query';
export type { GrantReadModel } from './queries/grant-query';

export { computeGrantAmortisation } from './calculators/grant-calc';
export type { GrantAmortisationResult } from './calculators/grant-calc';

export { evaluateGrantRecognition } from './calculators/grant-recognition-evaluation';
export type { GrantRecognitionTestInput, GrantRecognitionTestResult } from './calculators/grant-recognition-evaluation';

export { computeCapitalApproachGrant } from './calculators/capital-approach-grant';
export type { CapitalApproachGrantInput, CapitalApproachGrantResult } from './calculators/capital-approach-grant';

export { computeIncomeApproachGrant } from './calculators/income-approach-grant';
export type { IncomeApproachGrantInput, IncomeApproachGrantResult } from './calculators/income-approach-grant';

export { computeGrantRepayment } from './calculators/grant-repayment';
export type { GrantRepaymentInput, GrantRepaymentResult } from './calculators/grant-repayment';

export { buildGrantAmortiseIntent, buildGrantRecogniseIntent } from './commands/grant-intent';

/** @see FIN-GG-REC-01 — Government grant service: recognise + amortise (IAS 20) */
export { amortiseGrant, recogniseGrant } from './services/grant-service';
