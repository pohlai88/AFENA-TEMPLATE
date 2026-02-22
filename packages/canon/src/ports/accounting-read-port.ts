import type { CompanyId, FiscalPeriodKey, LedgerId } from '../types/branded';
import type { OrgId } from '../types/ids';

/**
 * AccountingReadPort — cross-cutting read interface for accounting data.
 *
 * Implemented by: accounting adapter
 * Consumed by: financial-close, statutory-reporting, consolidation
 *
 * Rule: Returns domain DTOs, never Drizzle row types.
 */

export interface TrialBalanceRow {
  accountId: string;
  accountCode: string;
  accountName: string;
  debitMinor: number;
  creditMinor: number;
  netMinor: number;
  currency: string;
}

export interface JournalEntrySummary {
  journalId: string;
  entryNo: string;
  entryType: string;
  postingStatus: string;
  totalDebitMinor: number;
  totalCreditMinor: number;
  currency: string;
  postedAt?: string;
}

export interface AccountingReadPort {
  /** Get the trial balance for a company/ledger at a point in time. */
  getTrialBalance(
    orgId: OrgId,
    companyId: CompanyId,
    ledgerId: LedgerId,
    asOf: string,
  ): Promise<readonly TrialBalanceRow[]>;

  /** Get the trial balance for a specific period. */
  getTrialBalanceByPeriod(
    orgId: OrgId,
    companyId: CompanyId,
    ledgerId: LedgerId,
    periodKey: FiscalPeriodKey,
  ): Promise<readonly TrialBalanceRow[]>;

  /** Get a journal entry with its lines. */
  getJournalEntry(orgId: OrgId, journalId: string): Promise<JournalEntrySummary | null>;

  /** List journal entries for a period (for close review). */
  listJournalEntries(
    orgId: OrgId,
    companyId: CompanyId,
    periodKey: FiscalPeriodKey,
    options?: { entryType?: string; limit?: number },
  ): Promise<readonly JournalEntrySummary[]>;
}
