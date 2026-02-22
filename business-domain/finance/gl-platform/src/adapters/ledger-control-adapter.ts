/**
 * LedgerControlPort Adapter
 *
 * Fulfills the LedgerControlPort interface defined in afenda-canon/ports.
 * Backed by real Drizzle queries against ledgers + posting_periods tables.
 */
import type {
  CompanyId,
  DomainContext,
  FiscalPeriodKey,
  LedgerControlPort,
  LedgerId,
  LedgerInfo,
  OrgId,
  PeriodInfo,
  PeriodStatus,
} from 'afenda-canon';
import { asCompanyId, asFiscalPeriodKey, asLedgerId } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { ledgers, postingPeriods } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export function createLedgerControlAdapter(db: DbSession, ctx: DomainContext): LedgerControlPort {
  return {
    async getLedger(_orgId: OrgId, ledgerId: LedgerId): Promise<LedgerInfo | null> {
      const rows = await db.read((tx) =>
        tx
          .select({
            ledgerId: ledgers.id,
            ledgerType: ledgers.ledgerType,
            companyId: ledgers.companyId,
            baseCurrency: ledgers.currencyCode,
            isActive: ledgers.isActive,
          })
          .from(ledgers)
          .where(and(eq(ledgers.orgId, ctx.orgId), eq(ledgers.id, ledgerId))),
      );

      if (rows.length === 0) return null;

      const r = rows[0]!;
      return {
        ledgerId: asLedgerId(r.ledgerId),
        ledgerType: r.ledgerType as LedgerInfo['ledgerType'],
        companyId: asCompanyId(r.companyId ?? ''),
        baseCurrency: r.baseCurrency,
        isActive: r.isActive,
      };
    },

    async getPeriodStatus(
      _orgId: OrgId,
      ledgerId: LedgerId,
      companyId: CompanyId,
      periodKey: FiscalPeriodKey,
    ): Promise<PeriodStatus | null> {
      const [fiscalYear, periodNumber] = periodKey.split('-');
      if (!fiscalYear || !periodNumber) return null;

      const rows = await db.read((tx) =>
        tx
          .select({ status: postingPeriods.status })
          .from(postingPeriods)
          .where(
            and(
              eq(postingPeriods.orgId, ctx.orgId),
              eq(postingPeriods.ledgerId, ledgerId),
              eq(postingPeriods.companyId, companyId),
              eq(postingPeriods.fiscalYear, fiscalYear),
              eq(postingPeriods.periodNumber, periodNumber),
            ),
          ),
      );

      if (rows.length === 0) return null;

      // Map DB status to port status
      const dbStatus = rows[0]!.status;
      const statusMap: Record<string, PeriodStatus> = {
        open: 'open',
        'soft-close': 'soft_close',
        'hard-close': 'hard_close',
      };
      return statusMap[dbStatus] ?? 'open';
    },

    async isPeriodOpen(
      _orgId: OrgId,
      ledgerId: LedgerId,
      companyId: CompanyId,
      periodKey: FiscalPeriodKey,
    ): Promise<boolean> {
      const status = await this.getPeriodStatus(_orgId, ledgerId, companyId, periodKey);
      return status === 'open';
    },

    async listPeriods(
      _orgId: OrgId,
      ledgerId: LedgerId,
      companyId: CompanyId,
    ): Promise<readonly PeriodInfo[]> {
      const rows = await db.read((tx) =>
        tx
          .select({
            fiscalYear: postingPeriods.fiscalYear,
            periodNumber: postingPeriods.periodNumber,
            ledgerId: postingPeriods.ledgerId,
            companyId: postingPeriods.companyId,
            status: postingPeriods.status,
            startDate: postingPeriods.startDate,
            endDate: postingPeriods.endDate,
          })
          .from(postingPeriods)
          .where(
            and(
              eq(postingPeriods.orgId, ctx.orgId),
              eq(postingPeriods.ledgerId, ledgerId),
              eq(postingPeriods.companyId, companyId),
            ),
          ),
      );

      const statusMap: Record<string, PeriodStatus> = {
        open: 'open',
        'soft-close': 'soft_close',
        'hard-close': 'hard_close',
      };

      return rows.map((r) => ({
        periodKey: asFiscalPeriodKey(`${r.fiscalYear}-${r.periodNumber}`),
        ledgerId: asLedgerId(r.ledgerId),
        companyId: asCompanyId(r.companyId ?? ''),
        status: statusMap[r.status] ?? 'open',
        startDate: r.startDate,
        endDate: r.endDate,
      }));
    },
  };
}
