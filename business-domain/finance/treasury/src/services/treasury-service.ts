import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { CashForecastResult } from '../calculators/cash-forecast';
import { forecastCashFlow } from '../calculators/cash-forecast';
import type { CashPositionSummary } from '../calculators/cash-position';
import { computeCashPosition } from '../calculators/cash-position';
import { buildCashTransferIntent } from '../commands/treasury-intent';
import { getCashAccount, listActiveCashAccounts } from '../queries/treasury-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getCashPosition(
  db: DbSession,
  ctx: DomainContext,
): Promise<DomainResult<CashPositionSummary>> {
  const accounts = await listActiveCashAccounts(db, ctx);
  const mapped = accounts.map((a) => ({
    accountId: a.id,
    currency: a.currencyCode,
    balanceMinor: a.bookBalanceMinor,
    bankName: a.bankName,
  }));
  const calc = computeCashPosition(mapped);
  return { kind: 'read', data: calc.result };
}

export async function getCashForecast(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    startingBalanceMinor: number;
    inflows: Parameters<typeof forecastCashFlow>[1];
    outflows: Parameters<typeof forecastCashFlow>[2];
    horizonDays: number;
    startDateIso: string;
  },
): Promise<DomainResult<CashForecastResult>> {
  const calc = forecastCashFlow(
    input.startingBalanceMinor,
    input.inflows,
    input.outflows,
    input.horizonDays,
    input.startDateIso,
  );
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Execute a cash transfer between two accounts and emit
 * a `treasury.transfer` intent.
 */
export async function transferCash(
  db: DbSession,
  ctx: DomainContext,
  input: {
    fromAccountId: string;
    toAccountId: string;
    amountMinor: number;
    currency: string;
    transferDate: string;
    memo?: string;
  },
): Promise<DomainResult<{ amountMinor: number; currency: string }>> {
  await getCashAccount(db, ctx, input.fromAccountId);
  await getCashAccount(db, ctx, input.toAccountId);

  const intent = buildCashTransferIntent(
    {
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      amountMinor: input.amountMinor,
      currency: input.currency,
      transferDate: input.transferDate,
      ...(input.memo != null ? { memo: input.memo } : {}),
    },
    stableCanonicalJson({
      type: 'treasury.transfer',
      from: input.fromAccountId,
      to: input.toAccountId,
      date: input.transferDate,
    }),
  );

  return {
    kind: 'intent+read',
    data: { amountMinor: input.amountMinor, currency: input.currency },
    intents: [intent],
  };
}
