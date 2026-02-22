/**
 * GL Platform Queries
 *
 * Real Drizzle queries against ledgers, posting_periods, chart_of_accounts,
 * document_types, and number_sequences tables.
 */
import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { chartOfAccounts, documentTypes, ledgers, postingPeriods } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

/* ---------- Read Models ---------- */

export type LedgerReadModel = {
  id: string;
  ledgerCode: string;
  name: string;
  ledgerType: string;
  chartOfAccountsId: string | null;
  currencyCode: string;
  calendarType: string;
  fiscalYearStartMonth: string;
  isPrimary: boolean;
  isActive: boolean;
  companyId: string | null;
};

export type PostingPeriodReadModel = {
  id: string;
  ledgerId: string;
  fiscalYear: string;
  periodNumber: string;
  startDate: string;
  endDate: string;
  status: string;
  companyId: string | null;
};

export type CoaAccountReadModel = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  parentAccountId: string | null;
  isPostable: boolean;
  normalBalance: string;
  currency: string | null;
  isActive: boolean;
  companyId: string | null;
};

export type DocumentTypeReadModel = {
  id: string;
  docTypeCode: string;
  name: string;
  category: string;
  numberPrefix: string | null;
  numberAllocation: string;
  allowReversal: boolean;
  isActive: boolean;
  companyId: string | null;
};

/* ---------- Queries ---------- */

export async function getLedger(
  db: DbSession,
  ctx: DomainContext,
  ledgerId: string,
): Promise<LedgerReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: ledgers.id,
        ledgerCode: ledgers.ledgerCode,
        name: ledgers.name,
        ledgerType: ledgers.ledgerType,
        chartOfAccountsId: ledgers.chartOfAccountsId,
        currencyCode: ledgers.currencyCode,
        calendarType: ledgers.calendarType,
        fiscalYearStartMonth: ledgers.fiscalYearStartMonth,
        isPrimary: ledgers.isPrimary,
        isActive: ledgers.isActive,
        companyId: ledgers.companyId,
      })
      .from(ledgers)
      .where(and(eq(ledgers.orgId, ctx.orgId), eq(ledgers.id, ledgerId), eq(ledgers.isDeleted, false))),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Ledger not found: ${ledgerId}`, { ledgerId });
  }

  return rows[0]!;
}

export async function getLedgersByCompany(
  db: DbSession,
  ctx: DomainContext,
  companyId: string,
): Promise<LedgerReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: ledgers.id,
        ledgerCode: ledgers.ledgerCode,
        name: ledgers.name,
        ledgerType: ledgers.ledgerType,
        chartOfAccountsId: ledgers.chartOfAccountsId,
        currencyCode: ledgers.currencyCode,
        calendarType: ledgers.calendarType,
        fiscalYearStartMonth: ledgers.fiscalYearStartMonth,
        isPrimary: ledgers.isPrimary,
        isActive: ledgers.isActive,
        companyId: ledgers.companyId,
      })
      .from(ledgers)
      .where(
        and(
          eq(ledgers.orgId, ctx.orgId),
          eq(ledgers.companyId, companyId),
          eq(ledgers.isActive, true),
          eq(ledgers.isDeleted, false),
        ),
      ),
  );
}

export async function getPostingPeriod(
  db: DbSession,
  ctx: DomainContext,
  ledgerId: string,
  fiscalYear: string,
  periodNumber: string,
): Promise<PostingPeriodReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: postingPeriods.id,
        ledgerId: postingPeriods.ledgerId,
        fiscalYear: postingPeriods.fiscalYear,
        periodNumber: postingPeriods.periodNumber,
        startDate: postingPeriods.startDate,
        endDate: postingPeriods.endDate,
        status: postingPeriods.status,
        companyId: postingPeriods.companyId,
      })
      .from(postingPeriods)
      .where(
        and(
          eq(postingPeriods.orgId, ctx.orgId),
          eq(postingPeriods.ledgerId, ledgerId),
          eq(postingPeriods.fiscalYear, fiscalYear),
          eq(postingPeriods.periodNumber, periodNumber),
          eq(postingPeriods.isDeleted, false),
        ),
      ),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Posting period not found: ${fiscalYear}-${periodNumber}`, {
      ledgerId,
      fiscalYear,
      periodNumber,
    });
  }

  return rows[0]!;
}

export async function getPostingPeriodsByLedger(
  db: DbSession,
  ctx: DomainContext,
  ledgerId: string,
  companyId: string,
): Promise<PostingPeriodReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: postingPeriods.id,
        ledgerId: postingPeriods.ledgerId,
        fiscalYear: postingPeriods.fiscalYear,
        periodNumber: postingPeriods.periodNumber,
        startDate: postingPeriods.startDate,
        endDate: postingPeriods.endDate,
        status: postingPeriods.status,
        companyId: postingPeriods.companyId,
      })
      .from(postingPeriods)
      .where(
        and(
          eq(postingPeriods.orgId, ctx.orgId),
          eq(postingPeriods.ledgerId, ledgerId),
          eq(postingPeriods.companyId, companyId),
          eq(postingPeriods.isDeleted, false),
        ),
      ),
  );
}

export async function getChartOfAccounts(
  db: DbSession,
  ctx: DomainContext,
  companyId: string,
): Promise<CoaAccountReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: chartOfAccounts.id,
        accountCode: chartOfAccounts.accountCode,
        accountName: chartOfAccounts.accountName,
        accountType: chartOfAccounts.accountType,
        parentAccountId: chartOfAccounts.parentAccountId,
        isPostable: chartOfAccounts.isPostable,
        normalBalance: chartOfAccounts.normalBalance,
        currency: chartOfAccounts.currency,
        isActive: chartOfAccounts.isActive,
        companyId: chartOfAccounts.companyId,
      })
      .from(chartOfAccounts)
      .where(
        and(
          eq(chartOfAccounts.orgId, ctx.orgId),
          eq(chartOfAccounts.companyId, companyId),
          eq(chartOfAccounts.isActive, true),
          eq(chartOfAccounts.isDeleted, false),
        ),
      ),
  );
}

export async function getDocumentType(
  db: DbSession,
  ctx: DomainContext,
  companyId: string,
  docTypeCode: string,
): Promise<DocumentTypeReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: documentTypes.id,
        docTypeCode: documentTypes.docTypeCode,
        name: documentTypes.name,
        category: documentTypes.category,
        numberPrefix: documentTypes.numberPrefix,
        numberAllocation: documentTypes.numberAllocation,
        allowReversal: documentTypes.allowReversal,
        isActive: documentTypes.isActive,
        companyId: documentTypes.companyId,
      })
      .from(documentTypes)
      .where(
        and(
          eq(documentTypes.orgId, ctx.orgId),
          eq(documentTypes.companyId, companyId),
          eq(documentTypes.docTypeCode, docTypeCode),
          eq(documentTypes.isDeleted, false),
        ),
      ),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Document type not found: ${docTypeCode}`, {
      companyId,
      docTypeCode,
    });
  }

  return rows[0]!;
}
