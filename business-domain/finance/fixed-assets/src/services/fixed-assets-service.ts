import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { DepreciationMethod, DepreciationResult } from '../calculators/depreciation';
import { calculateDepreciation } from '../calculators/depreciation';
import type { DisposalResult } from '../calculators/disposal';
import { computeDisposalGainLoss } from '../calculators/disposal';
import type { RevaluationResult } from '../calculators/revaluation';
import { computeRevaluation } from '../calculators/revaluation';
import {
  buildAssetDepreciateIntent,
  buildAssetDisposalIntent,
  buildAssetRevalueIntent,
} from '../commands/fixed-assets-intent';
import { getAsset } from '../queries/fixed-assets-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getDepreciation(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    costMinor: number;
    salvageMinor: number;
    usefulLifeMonths: number;
    method: DepreciationMethod;
    elapsedMonths: number;
  },
): Promise<DomainResult<DepreciationResult>> {
  const calc = calculateDepreciation(
    input.costMinor,
    input.salvageMinor,
    input.usefulLifeMonths,
    input.method,
    input.elapsedMonths,
  );
  return { kind: 'read', data: calc.result };
}

export async function getDisposalGainLoss(
  _db: DbSession,
  _ctx: DomainContext,
  input: { netBookValueMinor: number; proceedsMinor: number },
): Promise<DomainResult<DisposalResult>> {
  const calc = computeDisposalGainLoss(input.netBookValueMinor, input.proceedsMinor);
  return { kind: 'read', data: calc.result };
}

export async function getRevaluation(
  _db: DbSession,
  _ctx: DomainContext,
  input: { currentNbvMinor: number; fairValueMinor: number },
): Promise<DomainResult<RevaluationResult>> {
  const calc = computeRevaluation(input.currentNbvMinor, input.fairValueMinor);
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Load an asset from DB, compute depreciation, and emit an
 * `asset.depreciate` intent.
 */
export async function depreciateAssetFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: { assetId: string; periodKey: string; elapsedMonths: number },
): Promise<DomainResult<DepreciationResult>> {
  const asset = await getAsset(db, ctx, input.assetId);

  const method = asset.depreciationMethod as DepreciationMethod;
  const calc = calculateDepreciation(
    asset.costMinor,
    asset.salvageMinor,
    asset.usefulLifeMonths,
    method,
    input.elapsedMonths,
  );

  const intent = buildAssetDepreciateIntent(
    {
      assetId: asset.assetId,
      periodKey: input.periodKey,
      depreciationMinor: calc.result.periodDepreciationMinor,
      method,
    },
    stableCanonicalJson({
      type: 'asset.depreciate',
      assetId: asset.assetId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * @see FIN-FA-DEPR-01 — Run depreciation for a batch of assets and post to GL.
 *
 * Iterates over asset IDs, computes depreciation for each, and emits
 * one intent per asset. The accounting-hub derives GL journal lines.
 */
export async function runDepreciationBatchAndPost(
  db: DbSession,
  ctx: DomainContext,
  input: { assetIds: string[]; periodKey: string; elapsedMonths: number },
): Promise<DomainResult<{ results: DepreciationResult[]; totalDepreciationMinor: number }>> {
  const results: DepreciationResult[] = [];
  const intents = [];

  for (const assetId of input.assetIds) {
    const asset = await getAsset(db, ctx, assetId);
    const method = asset.depreciationMethod as DepreciationMethod;
    const calc = calculateDepreciation(
      asset.costMinor,
      asset.salvageMinor,
      asset.usefulLifeMonths,
      method,
      input.elapsedMonths,
    );
    results.push(calc.result);
    intents.push(
      buildAssetDepreciateIntent(
        {
          assetId: asset.assetId,
          periodKey: input.periodKey,
          depreciationMinor: calc.result.periodDepreciationMinor,
          method,
        },
        stableCanonicalJson({ assetId: asset.assetId, periodKey: input.periodKey }),
      ),
    );
  }

  const totalDepreciationMinor = results.reduce((s, r) => s + r.periodDepreciationMinor, 0);
  return { kind: 'intent+read', data: { results, totalDepreciationMinor }, intents };
}

/**
 * Dispose of an asset and emit an `asset.dispose` intent.
 */
export async function disposeAssetFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    proceedsMinor: number;
    disposalDateIso: string;
    nbvMinor: number;
    reason: string;
  },
): Promise<DomainResult<DisposalResult>> {
  const asset = await getAsset(db, ctx, input.assetId);
  const calc = computeDisposalGainLoss(input.nbvMinor, input.proceedsMinor);

  const intent = buildAssetDisposalIntent(
    {
      assetId: asset.assetId,
      disposalDate: input.disposalDateIso,
      proceedsMinor: input.proceedsMinor,
      reason: input.reason,
    },
    stableCanonicalJson({ type: 'asset.dispose', assetId: asset.assetId }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * Revalue an asset and emit an `asset.revalue` intent.
 */
export async function revalueAssetFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    currentNbvMinor: number;
    fairValueMinor: number;
    revaluationDateIso: string;
    valuerId?: string;
  },
): Promise<DomainResult<RevaluationResult>> {
  const asset = await getAsset(db, ctx, input.assetId);
  const calc = computeRevaluation(input.currentNbvMinor, input.fairValueMinor);

  const intent = buildAssetRevalueIntent(
    {
      assetId: asset.assetId,
      newFairValueMinor: input.fairValueMinor,
      revaluationDate: input.revaluationDateIso,
      ...(input.valuerId ? { valuerId: input.valuerId } : {}),
    },
    stableCanonicalJson({ type: 'asset.revalue', assetId: asset.assetId }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}
