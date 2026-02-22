/**
 * Transfer Pricing Service
 *
 * Orchestrates TP operations:
 * - Fetches TP policies and prior calculations
 * - Computes arm's-length price using the policy's method
 * - Returns computation result + intent
 * - Publishes policy versions
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { TpCalculationInput, TpPliConfig } from '../calculators/tp-engine';
import { computeTransferPrice } from '../calculators/tp-engine';
import { buildComputePriceIntent, buildPublishPolicyIntent } from '../commands/tp-intent';
import {
  getActivePolicies,
  getCalculationsByPolicy,
  getTpCalculation,
  getTpPolicy,
} from '../queries/tp-query';

/* ---------- Read Operations ---------- */

export async function fetchPolicies(db: DbSession, ctx: DomainContext): Promise<DomainResult> {
  const policies = await getActivePolicies(db, ctx);
  return { kind: 'read', data: { policies } };
}

export async function fetchPolicy(
  db: DbSession,
  ctx: DomainContext,
  policyId: string,
): Promise<DomainResult> {
  const policy = await getTpPolicy(db, ctx, policyId);
  return { kind: 'read', data: { policy } };
}

export async function fetchCalculation(
  db: DbSession,
  ctx: DomainContext,
  calculationId: string,
): Promise<DomainResult> {
  const calc = await getTpCalculation(db, ctx, calculationId);
  return { kind: 'read', data: { calculation: calc } };
}

export async function fetchCalculationHistory(
  db: DbSession,
  ctx: DomainContext,
  policyId: string,
  fiscalYear?: string,
): Promise<DomainResult> {
  const calcs = await getCalculationsByPolicy(db, ctx, policyId, fiscalYear);
  return { kind: 'read', data: { calculations: calcs } };
}

/* ---------- Write Operations ---------- */

/**
 * Compute transfer price for an intercompany transaction.
 */
export async function computePrice(
  db: DbSession,
  ctx: DomainContext,
  input: {
    policyId: string;
    transactionId: string;
    transactionValueMinor: number;
    currencyCode: string;
    pliOverride?: TpPliConfig;
    effectiveAt: string;
  },
): Promise<DomainResult> {
  // 1. Fetch policy
  const policy = await getTpPolicy(db, ctx, input.policyId);

  // 2. Parse arm's-length range from policy
  const armRange = (policy.armLengthRange as { low: number; median: number; high: number }) ?? {
    low: 0,
    median: 0,
    high: 0,
  };

  // 3. Build calculation input
  const calcInput: TpCalculationInput = {
    method: policy.tpMethod,
    transactionValueMinor: input.transactionValueMinor,
    currencyCode: input.currencyCode,
    pliConfig: input.pliOverride ?? (policy.pliConfig as TpPliConfig) ?? {},
    armLengthRange: armRange,
  };

  // 4. Compute
  const { result: tpResult } = computeTransferPrice(calcInput);

  // 5. Build intent
  return {
    kind: 'intent+read',
    data: { result: tpResult },
    intents: [
      buildComputePriceIntent(
        {
          transactionId: input.transactionId,
          policyId: input.policyId,
          effectiveAt: input.effectiveAt,
          computedPriceMinor: tpResult.computedPriceMinor,
          armLengthRange: {
            lowMinor: Math.round(armRange.low * input.transactionValueMinor),
            highMinor: Math.round(armRange.high * input.transactionValueMinor),
          },
        },
        stableCanonicalJson({
          transactionId: input.transactionId,
          policyId: input.policyId,
        }),
      ),
    ],
  };
}

/**
 * Publish a new version of a TP policy.
 */
export async function publishPolicy(
  db: DbSession,
  ctx: DomainContext,
  input: { policyId: string; version: number },
): Promise<DomainResult> {
  const policy = await getTpPolicy(db, ctx, input.policyId);

  return {
    kind: 'intent',
    intents: [
      buildPublishPolicyIntent({
        policyId: input.policyId,
        version: input.version,
        method: policy.tpMethod,
      }),
    ],
  };
}
