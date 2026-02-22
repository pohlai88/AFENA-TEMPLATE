/**
 * Financial Instruments — IFRS 9 / IAS 32
 *
 * Calculators: classifyInstrument, computeEffectiveInterest, computeFairValueChange
 * Queries:     getFinancialInstrument
 * Commands:    buildFvChangeIntent, buildEirAccrualIntent
 * Service:     fetchInstrument, recordFvChange, accrueInterest
 */

// ── Calculators ─────────────────────────────────────────
export {
  classifyInstrument,
  computeEffectiveInterest,
  computeFairValueChange
} from './calculators/fi-calc';
export type { ClassificationResult, EirResult, FvChangeResult } from './calculators/fi-calc';

export { splitCompoundInstrument } from './calculators/compound-instrument';
export type { CompoundInstrumentInput, CompoundInstrumentResult } from './calculators/compound-instrument';

export { evaluateDerecognition } from './calculators/derecognition';
export type { DerecognitionResult, TransferDetails } from './calculators/derecognition';

export { evaluateEclStageTransition } from './calculators/ecl-stage-transition';
export type { EclStageTransitionInput, EclStageTransitionResult } from './calculators/ecl-stage-transition';

// ── Queries ─────────────────────────────────────────────
export { getFinancialInstrument } from './queries/fi-query';
export type { FinancialInstrumentReadModel } from './queries/fi-query';

// ── Commands ────────────────────────────────────────────
export { buildEirAccrualIntent, buildFvChangeIntent } from './commands/fi-intent';

// ── Service ─────────────────────────────────────────────
export { accrueInterest, fetchInstrument, recordFvChange } from './services/fi-service';
