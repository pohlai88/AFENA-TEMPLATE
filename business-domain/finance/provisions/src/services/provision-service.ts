/**
 * Provision Service — IAS 37
 *
 * Read ops: fetchProvision, fetchProvisionMovements
 * Write ops: recognise, utilise, reverse
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { recogniseProvision } from '../calculators/provision-calc';
import {
  buildProvisionIntent,
  buildProvisionReverseIntent,
  buildProvisionUtiliseIntent,
} from '../commands/provision-intent';
import { getProvision, getProvisionMovements } from '../queries/provision-query';

/* ---------- Read Operations ---------- */

export async function fetchProvision(
  db: DbSession,
  ctx: DomainContext,
  provisionId: string,
): Promise<DomainResult> {
  const provision = await getProvision(db, ctx, provisionId);
  return { kind: 'read', data: { provision } };
}

export async function fetchProvisionMovements(
  db: DbSession,
  ctx: DomainContext,
  provisionId: string,
): Promise<DomainResult> {
  const movements = await getProvisionMovements(db, ctx, provisionId);
  return { kind: 'read', data: { movements } };
}

/* ---------- Write Operations ---------- */

export async function recognise(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    provisionId: string;
    obligationType:
      | 'legal'
      | 'constructive'
      | 'onerous-contract'
      | 'decommissioning'
      | 'warranty'
      | 'restructuring';
    bestEstimateMinor: number;
    discountRate?: number;
    recognitionDate: string;
    isProbable: boolean;
    canEstimate: boolean;
  },
): Promise<DomainResult> {
  const { result: calcResult } = recogniseProvision({
    isProbable: input.isProbable,
    canEstimate: input.canEstimate,
    bestEstimateMinor: input.bestEstimateMinor,
    ...(input.discountRate != null ? { discountRate: input.discountRate } : {}),
  });

  if (!calcResult.shouldRecognise) {
    return { kind: 'read', data: { recognised: false, explanation: calcResult.explanation } };
  }

  return {
    kind: 'intent',
    intents: [
      buildProvisionIntent(
        {
          provisionId: input.provisionId,
          obligationType: input.obligationType,
          bestEstimateMinor: calcResult.bestEstimateMinor,
          ...(input.discountRate != null ? { discountRate: input.discountRate } : {}),
          recognitionDate: input.recognitionDate,
        },
        stableCanonicalJson({ provisionId: input.provisionId }),
      ),
    ],
  };
}

export async function utilise(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    provisionId: string;
    amountMinor: number;
    utilisationDate: string;
    reason: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildProvisionUtiliseIntent({
        provisionId: input.provisionId,
        amountMinor: input.amountMinor,
        utilisationDate: input.utilisationDate,
        reason: input.reason,
      }),
    ],
  };
}

export async function reverse(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    provisionId: string;
    amountMinor: number;
    reversalDate: string;
    reason: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildProvisionReverseIntent({
        provisionId: input.provisionId,
        amountMinor: input.amountMinor,
        reversalDate: input.reversalDate,
        reason: input.reason,
      }),
    ],
  };
}
