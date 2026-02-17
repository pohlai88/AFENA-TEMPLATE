// UOM Conversion
export {
  resolveConversion,
  convertQuantity,
  convertUom,
  type ResolvedConversion,
  type ConversionResult,
} from './services/uom-conversion.js';

// Lot Recall & Traceability
export {
  traceForward,
  traceBackward,
  traceRecall,
  type AffectedMovement,
  type RecallTraceResult,
} from './services/lot-recall.js';

// Manufacturing Engine
export {
  explodeBom,
  explodeBomFromDb,
  calculateCostRollup,
  getCostRollup,
  generateWipJournalEntries,
  type WipMovementType,
  type BomExplosionLine,
  type BomExplosionResult,
  type CostRollupResult,
  type WipJournalSpec,
  type WipJournalEntry,
} from './services/manufacturing-engine.js';

// Landed Cost Allocation
export {
  allocateLandedCost,
  type ReceiptLineInput,
  type LandedCostLineAllocation,
  type LandedCostAllocationResult,
} from './services/landed-cost-engine.js';

// Three-Way Match
export {
  evaluateMatch,
  matchDocumentLines,
  overrideMatchException,
  type MatchInput,
  type MatchTolerance,
  type MatchEvaluation,
} from './services/three-way-match.js';
