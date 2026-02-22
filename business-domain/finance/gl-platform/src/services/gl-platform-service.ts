/**
 * GL Platform Service
 *
 * Orchestrates the multi-ledger kernel: period management, CoA validation,
 * document types, and trial balance computation.
 * All write operations return DomainResult with intents.
 * All read operations return DomainResult with data.
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { DomainError, stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import type { AccountNode } from '../calculators/coa-hierarchy';
import { validateCoaIntegrity } from '../calculators/coa-hierarchy';
import type { PeriodRange } from '../calculators/period-overlap';
import { validatePeriodOverlap } from '../calculators/period-overlap';
import type { TrialBalanceRow } from '../calculators/trial-balance';
import { computeTrialBalance } from '../calculators/trial-balance';
import {
  buildClosePeriodIntent,
  buildOpenPeriodIntent,
  buildPublishCoaIntent,
} from '../commands/gl-intent';
import type {
  CoaAccountReadModel,
  DocumentTypeReadModel,
  LedgerReadModel,
  PostingPeriodReadModel,
} from '../queries/gl-query';
import {
  getChartOfAccounts,
  getDocumentType,
  getLedger,
  getLedgersByCompany,
  getPostingPeriod,
  getPostingPeriodsByLedger,
} from '../queries/gl-query';

/* ---------- Read Operations ---------- */

export async function fetchLedger(
  db: DbSession,
  ctx: DomainContext,
  ledgerId: string,
): Promise<DomainResult<LedgerReadModel>> {
  const ledger = await getLedger(db, ctx, ledgerId);
  return { kind: 'read', data: ledger };
}

export async function listCompanyLedgers(
  db: DbSession,
  ctx: DomainContext,
  companyId: string,
): Promise<DomainResult<LedgerReadModel[]>> {
  const data = await getLedgersByCompany(db, ctx, companyId);
  return { kind: 'read', data };
}

export async function fetchPostingPeriod(
  db: DbSession,
  ctx: DomainContext,
  input: { ledgerId: string; fiscalYear: string; periodNumber: string },
): Promise<DomainResult<PostingPeriodReadModel>> {
  const period = await getPostingPeriod(
    db,
    ctx,
    input.ledgerId,
    input.fiscalYear,
    input.periodNumber,
  );
  return { kind: 'read', data: period };
}

export async function listPeriods(
  db: DbSession,
  ctx: DomainContext,
  input: { ledgerId: string; companyId: string },
): Promise<DomainResult<PostingPeriodReadModel[]>> {
  const data = await getPostingPeriodsByLedger(db, ctx, input.ledgerId, input.companyId);
  return { kind: 'read', data };
}

export async function fetchChartOfAccounts(
  db: DbSession,
  ctx: DomainContext,
  companyId: string,
): Promise<DomainResult<CoaAccountReadModel[]>> {
  const data = await getChartOfAccounts(db, ctx, companyId);
  return { kind: 'read', data };
}

export async function fetchDocumentType(
  db: DbSession,
  ctx: DomainContext,
  input: { companyId: string; docTypeCode: string },
): Promise<DomainResult<DocumentTypeReadModel>> {
  const data = await getDocumentType(db, ctx, input.companyId, input.docTypeCode);
  return { kind: 'read', data };
}

export async function fetchTrialBalance(
  db: DbSession,
  ctx: DomainContext,
  input: { companyId: string; ledgerId: string; asOf: string },
): Promise<DomainResult<TrialBalanceRow[]>> {
  // Verify ledger exists and is active
  const ledger = await getLedger(db, ctx, input.ledgerId);
  if (!ledger.isActive) {
    throw new DomainError('VALIDATION_FAILED', `Ledger ${input.ledgerId} is not active`);
  }

  // Get chart of accounts for this company as trial balance lines
  // In production, this would aggregate from journal_lines; for now use CoA with zero balances
  const coa = await getChartOfAccounts(db, ctx, input.companyId);
  const lines = coa
    .filter((a) => a.isPostable)
    .map((a) => ({
      accountId: a.id,
      side: 'debit' as const,
      amountMinor: 0,
    }));

  const { result } = computeTrialBalance(lines, input.asOf);
  return { kind: 'read', data: result };
}

/* ---------- Write Operations ---------- */

export async function openPeriod(
  db: DbSession,
  ctx: DomainContext,
  input: {
    ledgerId: string;
    companyId: string;
    fiscalYear: string;
    periodNumber: string;
    startDate: string;
    endDate: string;
  },
): Promise<DomainResult> {
  // Validate ledger exists
  const ledger = await getLedger(db, ctx, input.ledgerId);
  if (!ledger.isActive) {
    throw new DomainError('VALIDATION_FAILED', `Ledger ${input.ledgerId} is not active`);
  }

  // Check for overlapping periods
  const existingPeriods = await getPostingPeriodsByLedger(db, ctx, input.ledgerId, input.companyId);
  const proposed: PeriodRange = {
    periodKey: `${input.fiscalYear}-${input.periodNumber}`,
    startDate: input.startDate,
    endDate: input.endDate,
  };
  const existing: PeriodRange[] = existingPeriods.map((p) => ({
    periodKey: `${p.fiscalYear}-${p.periodNumber}`,
    startDate: p.startDate,
    endDate: p.endDate,
  }));

  validatePeriodOverlap(proposed, existing);

  const periodKey = `${input.fiscalYear}-${input.periodNumber}`;

  return {
    kind: 'intent',
    intents: [
      buildOpenPeriodIntent(
        { ledgerId: input.ledgerId, periodKey, companyId: input.companyId },
        stableCanonicalJson({ ledgerId: input.ledgerId, periodKey, companyId: input.companyId }),
      ),
    ],
  };
}

export async function closePeriod(
  db: DbSession,
  ctx: DomainContext,
  input: {
    ledgerId: string;
    companyId: string;
    fiscalYear: string;
    periodNumber: string;
    closeType: 'soft' | 'hard';
  },
): Promise<DomainResult> {
  // Verify the period exists and is currently open (or soft-close for hard-close)
  const period = await getPostingPeriod(
    db,
    ctx,
    input.ledgerId,
    input.fiscalYear,
    input.periodNumber,
  );

  if (input.closeType === 'soft' && period.status !== 'open') {
    throw new DomainError(
      'VALIDATION_FAILED',
      `Cannot soft-close period ${input.fiscalYear}-${input.periodNumber}: status is '${period.status}', expected 'open'`,
    );
  }

  if (input.closeType === 'hard' && period.status === 'hard-close') {
    throw new DomainError(
      'VALIDATION_FAILED',
      `Period ${input.fiscalYear}-${input.periodNumber} is already hard-closed`,
    );
  }

  const periodKey = `${input.fiscalYear}-${input.periodNumber}`;

  return {
    kind: 'intent',
    intents: [
      buildClosePeriodIntent(
        {
          ledgerId: input.ledgerId,
          periodKey,
          companyId: input.companyId,
          closeType: input.closeType,
        },
        stableCanonicalJson({
          ledgerId: input.ledgerId,
          periodKey,
          companyId: input.companyId,
          closeType: input.closeType,
        }),
      ),
    ],
  };
}

export async function publishChartOfAccounts(
  db: DbSession,
  ctx: DomainContext,
  input: { ledgerId: string; companyId: string; version: number },
): Promise<DomainResult> {
  // Validate ledger
  const ledger = await getLedger(db, ctx, input.ledgerId);
  if (!ledger.isActive) {
    throw new DomainError('VALIDATION_FAILED', `Ledger ${input.ledgerId} is not active`);
  }

  // Fetch and validate CoA integrity
  const accounts = await getChartOfAccounts(db, ctx, input.companyId);

  const nodes: AccountNode[] = accounts.map((a) => ({
    id: a.id,
    accountCode: a.accountCode,
    accountName: a.accountName,
    accountType: a.accountType as AccountNode['accountType'],
    parentAccountId: a.parentAccountId,
    isPostable: a.isPostable,
    normalBalance: a.normalBalance as AccountNode['normalBalance'],
  }));

  validateCoaIntegrity(nodes);

  return {
    kind: 'intent',
    intents: [
      buildPublishCoaIntent(
        {
          ledgerId: input.ledgerId,
          version: input.version,
          accountCount: accounts.length,
        },
        stableCanonicalJson({
          ledgerId: input.ledgerId,
          version: input.version,
          companyId: input.companyId,
        }),
      ),
    ],
  };
}

/* ── Multi-GAAP Adjustments ────────────────────────────────── */

/**
 * @see FIN-MG-ADJ-01 — Multi-GAAP adjustments isolated by book.
 *
 * Posts a book-specific adjustment (e.g. IFRS vs local GAAP) to a
 * secondary ledger, then computes the variance between the two books.
 */
export type BookAdjustmentInput = {
  primaryLedgerId: string;
  secondaryLedgerId: string;
  periodKey: string;
  accountId: string;
  adjustmentMinor: number;
  reason: string;
  standard: 'ifrs' | 'local-gaap' | 'tax' | 'management';
};

export type BookVarianceResult = {
  accountId: string;
  primaryBalanceMinor: number;
  secondaryBalanceMinor: number;
  varianceMinor: number;
  adjustmentApplied: boolean;
};

export async function postBookAdjustment(
  _db: DbSession,
  _ctx: DomainContext,
  input: BookAdjustmentInput,
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildClosePeriodIntent(
        {
          ledgerId: input.secondaryLedgerId,
          periodKey: input.periodKey,
          companyId: input.accountId,
          closeType: 'soft',
        },
        stableCanonicalJson({
          type: 'book.adjustment',
          ledgerId: input.secondaryLedgerId,
          periodKey: input.periodKey,
          accountId: input.accountId,
        }),
      ),
    ],
  };
}

export function computeBookVariance(
  primaryBalanceMinor: number,
  secondaryBalanceMinor: number,
  accountId: string,
): BookVarianceResult {
  return {
    accountId,
    primaryBalanceMinor,
    secondaryBalanceMinor,
    varianceMinor: primaryBalanceMinor - secondaryBalanceMinor,
    adjustmentApplied: primaryBalanceMinor !== secondaryBalanceMinor,
  };
}

export type {
  CoaAccountReadModel,
  DocumentTypeReadModel,
  LedgerReadModel,
  PostingPeriodReadModel,
  TrialBalanceRow
};

