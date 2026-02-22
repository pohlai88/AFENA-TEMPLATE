// ── Port Interfaces (cross-cutting domain reads) ─────────
// Ports return domain DTOs, never Drizzle row types.
// Domain packages consume ports; adapters in the implementing package fulfill them.

export type {
  LedgerControlPort,
  LedgerInfo,
  PeriodInfo,
  PeriodStatus,
} from './ledger-control-port';

export type { FxRateInfo, FxRatePort, FxRateType } from './fx-rate-port';

export type { TaxRateInfo, TaxRatePort, TaxType } from './tax-rate-port';

export type {
  AccountingReadPort,
  JournalEntrySummary,
  TrialBalanceRow,
} from './accounting-read-port';

export type { PartyAddress, PartyInfo, PartyMasterPort, PartyType } from './party-master-port';

export type { DocumentNumberPort, NumberSequenceInfo } from './document-number-port';
