/**
 * @see FIN-CB-REC-01 — Bank reconciliation sessions close immutably with traceability
 */

export { findMatches } from './calculators/match-engine';
export type { BankLine, LedgerEntry, MatchCandidate } from './calculators/match-engine';
export { evaluateReconSignOff } from './calculators/recon-signoff';
export type { SignOffEvidence } from './calculators/recon-signoff';

export { analyzeOutstandingItems } from './calculators/outstanding-items';
export type { OutstandingItem, OutstandingItemsResult } from './calculators/outstanding-items';

export { monitorIntradayBalances } from './calculators/intraday-monitor';
export type { BalanceAlert, IntradayEntry, IntradayResult } from './calculators/intraday-monitor';

export { reconcileMultiCurrency } from './calculators/multi-currency-recon';
export type {
  MultiCurrencyEntry,
  MultiCurrencyReconResult,
} from './calculators/multi-currency-recon';

export {
  closeReconciliation,
  reconcile,
  reconcileWithDbRules,
} from './services/reconciliation-service';
export type { ReconciliationResult } from './services/reconciliation-service';

export { getAllMatchingRules, getMatchingRulesForAccount } from './queries/matching-rules-query';
export type { MatchingRuleReadModel } from './queries/matching-rules-query';

export {
  getItemsByStatement,
  getReconciliationItemById,
  getUnmatchedBankItems,
} from './queries/recon-query';
export type { ReconciliationItemReadModel } from './queries/recon-query';
