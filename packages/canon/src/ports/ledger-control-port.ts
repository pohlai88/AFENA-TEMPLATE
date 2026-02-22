import type { CompanyId, FiscalPeriodKey, LedgerId } from '../types/branded';
import type { OrgId } from '../types/ids';

/**
 * LedgerControlPort — cross-cutting read interface for GL period and ledger controls.
 *
 * Implemented by: gl-platform adapter
 * Consumed by: all finance packages that post balance-impacting entries
 *
 * Rule: Returns domain DTOs, never Drizzle row types.
 */

export type PeriodStatus = 'open' | 'soft_close' | 'hard_close';

export interface LedgerInfo {
  ledgerId: LedgerId;
  ledgerType: 'ifrs' | 'statutory' | 'tax' | 'management';
  companyId: CompanyId;
  baseCurrency: string;
  isActive: boolean;
}

export interface PeriodInfo {
  periodKey: FiscalPeriodKey;
  ledgerId: LedgerId;
  companyId: CompanyId;
  status: PeriodStatus;
  startDate: string;
  endDate: string;
}

export interface LedgerControlPort {
  /** Validate that a ledger exists and is active for the given company. */
  getLedger(orgId: OrgId, ledgerId: LedgerId): Promise<LedgerInfo | null>;

  /** Get the posting period status for a given ledger, company, and period. */
  getPeriodStatus(
    orgId: OrgId,
    ledgerId: LedgerId,
    companyId: CompanyId,
    periodKey: FiscalPeriodKey,
  ): Promise<PeriodStatus | null>;

  /** Check if a period is open for posting. */
  isPeriodOpen(
    orgId: OrgId,
    ledgerId: LedgerId,
    companyId: CompanyId,
    periodKey: FiscalPeriodKey,
  ): Promise<boolean>;

  /** Get all periods for a ledger/company (e.g., for close checklist). */
  listPeriods(
    orgId: OrgId,
    ledgerId: LedgerId,
    companyId: CompanyId,
  ): Promise<readonly PeriodInfo[]>;
}
