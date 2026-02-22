import type { DomainContext, DomainResult } from 'afenda-canon';
import { DomainError, stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { EliminationEntry, IntercompanyBalance } from '../calculators/elimination';
import { computeEliminations } from '../calculators/elimination';
import type {
  TranslatedEntry,
  TranslationRates,
  TrialBalanceEntry,
} from '../calculators/fx-translation';
import { translateTrialBalance } from '../calculators/fx-translation';
import {
  buildConsolidationEliminateIntent,
  buildConsolidationTranslateIntent,
} from '../commands/consol-intent';
import { getUnmatchedIcBalances } from '../queries/consol-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getEliminations(
  _db: DbSession,
  _ctx: DomainContext,
  input: { balances: IntercompanyBalance[] },
): Promise<DomainResult<EliminationEntry[]>> {
  const calc = computeEliminations(input.balances);
  return { kind: 'read', data: calc.result };
}

export async function getTranslatedTrialBalance(
  _db: DbSession,
  _ctx: DomainContext,
  input: { entries: TrialBalanceEntry[]; rates: TranslationRates; targetCurrency: string },
): Promise<DomainResult<TranslatedEntry[]>> {
  const calc = translateTrialBalance(input.entries, input.rates, input.targetCurrency);
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Load IC balances from DB for a subsidiary, compute eliminations,
 * and emit a `consolidation.eliminate` intent.
 */
export async function eliminateFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: { subsidiaryId: string; periodKey: string },
): Promise<DomainResult<EliminationEntry[]>> {
  const rows = await getUnmatchedIcBalances(db, ctx, input.subsidiaryId);

  const balances: IntercompanyBalance[] = rows.map((r) => ({
    fromCompanyId: r.fromCompanyId,
    toCompanyId: r.toCompanyId,
    accountId: r.accountId ?? 'unknown',
    amountMinor: r.amountMinor,
    currency: r.currency,
  }));

  const calc = computeEliminations(balances);

  const intent = buildConsolidationEliminateIntent(
    {
      subsidiaryId: input.subsidiaryId,
      periodKey: input.periodKey,
      eliminationEntries: calc.result.map((e) => ({
        accountId: e.accountId,
        side: e.side,
        amountMinor: e.amountMinor,
      })),
    },
    stableCanonicalJson({
      type: 'consolidation.eliminate',
      subsidiaryId: input.subsidiaryId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * Translate a trial balance for a subsidiary and emit
 * a `consolidation.translate` intent with the CTA amount.
 */
export async function translateAndEmit(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    subsidiaryId: string;
    periodKey: string;
    entries: TrialBalanceEntry[];
    rates: TranslationRates;
    targetCurrency: string;
  },
): Promise<DomainResult<TranslatedEntry[]>> {
  const calc = translateTrialBalance(input.entries, input.rates, input.targetCurrency);

  // CTA = sum of translation differences
  const ctaAmountMinor = calc.result.reduce(
    (sum, e) => sum + (e.translatedMinor - e.originalMinor),
    0,
  );

  const intent = buildConsolidationTranslateIntent(
    {
      subsidiaryId: input.subsidiaryId,
      periodKey: input.periodKey,
      targetCurrency: input.targetCurrency,
      ctaAmountMinor,
    },
    stableCanonicalJson({
      type: 'consolidation.translate',
      subsidiaryId: input.subsidiaryId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/* ── Group Structure ──────────────────────────────────────── */

/**
 * @see FIN-GRP-STRUCT-01 — Group structure versioned by effective date.
 *
 * Records an ownership change (acquisition, disposal, restructure)
 * with an effective date so that consolidation runs use the correct
 * ownership percentage for each period.
 */
export type OwnershipChange = {
  subsidiaryId: string;
  parentCompanyId: string;
  ownershipPct: number;
  effectiveDate: string;
  changeType: 'acquisition' | 'disposal' | 'restructure' | 'step_acquisition';
};

/** IFRS 10/11, IAS 28 consolidation method thresholds */
export const CONSOLIDATION_THRESHOLDS = {
  /** >50% ownership → full consolidation (IFRS 10) */
  fullConsolidation: 50,
  /** 20-50% ownership → equity method (IAS 28) */
  equityMethod: 20,
  /** <20% ownership → fair value / cost method */
} as const;

export type ConsolidationMethod = 'full' | 'equity' | 'fair_value';

export type GroupOwnershipResult = {
  subsidiaryId: string;
  parentCompanyId: string;
  ownershipPct: number;
  effectiveDate: string;
  changeType: string;
  consolidationMethod: ConsolidationMethod;
  isConsolidated: boolean;
};

export async function updateGroupOwnership(
  _db: DbSession,
  _ctx: DomainContext,
  input: OwnershipChange,
): Promise<DomainResult<GroupOwnershipResult>> {
  if (input.ownershipPct < 0 || input.ownershipPct > 100) {
    throw new DomainError('VALIDATION_FAILED', 'Ownership percentage must be between 0 and 100');
  }

  const consolidationMethod: ConsolidationMethod =
    input.ownershipPct > CONSOLIDATION_THRESHOLDS.fullConsolidation
      ? 'full'
      : input.ownershipPct >= CONSOLIDATION_THRESHOLDS.equityMethod
        ? 'equity'
        : 'fair_value';

  const isConsolidated = consolidationMethod === 'full';

  const data: GroupOwnershipResult = {
    subsidiaryId: input.subsidiaryId,
    parentCompanyId: input.parentCompanyId,
    ownershipPct: input.ownershipPct,
    effectiveDate: input.effectiveDate,
    changeType: input.changeType,
    consolidationMethod,
    isConsolidated,
  };

  return {
    kind: 'intent+read',
    data,
    intents: [
      buildConsolidationEliminateIntent(
        {
          subsidiaryId: input.subsidiaryId,
          periodKey: input.effectiveDate,
          eliminationEntries: [
            {
              accountId: `equity-investment-${input.subsidiaryId}`,
              side: 'debit' as const,
              amountMinor: 0, // Placeholder — actual amount computed during period close
            },
          ],
          sourceType: 'ownership_change',
          ownershipPct: input.ownershipPct,
          consolidationMethod,
        },
        stableCanonicalJson({
          type: 'group.ownership.update',
          subsidiaryId: input.subsidiaryId,
          effectiveDate: input.effectiveDate,
          ownershipPct: input.ownershipPct,
        }),
      ),
    ],
  };
}
