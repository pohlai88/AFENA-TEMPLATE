/**
 * Intangible Assets Service — IAS 38
 *
 * Read ops: fetchAsset
 * Write ops: capitalise, amortise, impair
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { calculateAmortisation, capitaliseRnD } from '../calculators/intangible-calc';
import {
  buildAmortiseIntent,
  buildCapitaliseIntent,
  buildImpairIntent,
} from '../commands/intangible-intent';
import { getIntangibleAsset } from '../queries/intangible-query';

/* ---------- Read Operations ---------- */

export async function fetchAsset(
  db: DbSession,
  ctx: DomainContext,
  assetId: string,
): Promise<DomainResult> {
  const asset = await getIntangibleAsset(db, ctx, assetId);
  return { kind: 'read', data: { asset } };
}

/* ---------- Write Operations ---------- */

export async function capitalise(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    assetId: string;
    phase: 'research' | 'development';
    costsMinor: number;
    periodKey: string;
    criteriaMet: boolean;
  },
): Promise<DomainResult> {
  const { result: calc } = capitaliseRnD({
    phase: input.phase,
    costsMinor: input.costsMinor,
    criteriaMet: input.criteriaMet,
  });

  if (!calc.shouldCapitalise) {
    return { kind: 'read', data: { capitalised: false, explanation: calc.explanation } };
  }

  return {
    kind: 'intent',
    intents: [
      buildCapitaliseIntent({
        assetId: input.assetId,
        phase: input.phase,
        costsMinor: calc.capitaliseAmountMinor,
        periodKey: input.periodKey,
        criteriaMet: input.criteriaMet,
      }),
    ],
  };
}

export async function amortise(
  db: DbSession,
  ctx: DomainContext,
  input: { assetId: string; periodKey: string },
): Promise<DomainResult> {
  const asset = await getIntangibleAsset(db, ctx, input.assetId);

  if (asset.usefulLifeType === 'indefinite') {
    return {
      kind: 'read',
      data: { amortised: false, explanation: 'Indefinite-life asset — no amortisation' },
    };
  }

  const { result: calc } = calculateAmortisation({
    acquisitionCostMinor: asset.acquisitionCostMinor,
    residualValueMinor: asset.residualValueMinor,
    accumulatedAmortisationMinor: asset.accumulatedAmortizationMinor,
    accumulatedImpairmentMinor: asset.accumulatedImpairmentMinor,
    usefulLifeMonths: asset.usefulLifeMonths ?? 120,
    method: (asset.amortizationMethod ?? 'straight-line') as
      | 'straight-line'
      | 'units-of-production'
      | 'reducing-balance',
  });

  return {
    kind: 'intent',
    intents: [
      buildAmortiseIntent({
        assetId: input.assetId,
        periodKey: input.periodKey,
        amortisationMinor: calc.periodAmortisationMinor,
        method: (asset.amortizationMethod ?? 'straight-line') as
          | 'straight-line'
          | 'units-of-production'
          | 'reducing-balance',
      }),
    ],
  };
}

export async function impair(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    assetId: string;
    impairmentMinor: number;
    recoverableAmountMinor: number;
    impairmentDate: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildImpairIntent({
        assetId: input.assetId,
        impairmentMinor: input.impairmentMinor,
        recoverableAmountMinor: input.recoverableAmountMinor,
        impairmentDate: input.impairmentDate,
      }),
    ],
  };
}
