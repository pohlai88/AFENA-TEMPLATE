/**
 * Provisions — IAS 37 Provisions, Contingent Liabilities & Contingent Assets
 *
 * Calculators: recogniseProvision, unwindDiscount
 * Queries:     getProvision, getProvisionMovements
 * Commands:    buildProvisionIntent, buildProvisionUtiliseIntent, buildProvisionReverseIntent
 * Service:     fetchProvision, recognise, utilise, reverse
 */

// ── Calculators ─────────────────────────────────────────
export { recogniseProvision, unwindDiscount } from './calculators/provision-calc';
export type { ProvisionResult, UnwindResult } from './calculators/provision-calc';

export { evaluateOnerousContract } from './calculators/onerous-contract';
export type { OnerousContractInput, OnerousContractResult } from './calculators/onerous-contract';

export { computeProvisionUtilisation } from './calculators/provision-utilisation';
export type { ProvisionUtilisationInput, ProvisionUtilisationResult } from './calculators/provision-utilisation';

export { computeProvisionReversal } from './calculators/provision-reversal';
export type { ProvisionReversalInput, ProvisionReversalResult } from './calculators/provision-reversal';

export { assessContingentLiability } from './calculators/contingent-liability-assessment';
export type { ContingentLiabilityInput, ContingentLiabilityResult } from './calculators/contingent-liability-assessment';

// ── Queries ─────────────────────────────────────────────
export { getProvision, getProvisionMovements } from './queries/provision-query';
export type { ProvisionMovementReadModel, ProvisionReadModel } from './queries/provision-query';

// ── Commands ────────────────────────────────────────────
export {
  buildProvisionIntent,
  buildProvisionReverseIntent,
  buildProvisionUtiliseIntent
} from './commands/provision-intent';

// ── Service ─────────────────────────────────────────────
export {
  fetchProvision,
  fetchProvisionMovements,
  recognise,
  reverse,
  utilise
} from './services/provision-service';

