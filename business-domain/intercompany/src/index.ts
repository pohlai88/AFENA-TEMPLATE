/**
 * @afenda/intercompany
 *
 * Intercompany transaction management for multi-entity organizations.
 */

export {
  createIntercompanyTransaction,
  matchIntercompanyTransactions,
  generateEliminationEntries,
  getUnmatchedTransactions,
  type IntercompanyPairResult,
  type EliminationEntry,
  type MatchedPair,
} from './services/intercompany-engine.js';
