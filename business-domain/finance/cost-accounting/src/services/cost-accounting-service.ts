import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { AllocatedCost, AllocationBase } from '../calculators/cost-allocation';
import { allocateCost } from '../calculators/cost-allocation';
import type { CostComponent } from '../calculators/standard-cost';
import { computeStandardCost } from '../calculators/standard-cost';
import type { VarianceResult } from '../calculators/variance-analysis';
import { computeVariance } from '../calculators/variance-analysis';
import { buildCostAllocationIntent } from '../commands/cost-intent';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getCostAllocation(
  _db: DbSession,
  _ctx: DomainContext,
  input: { totalCostMinor: number; bases: AllocationBase[] },
): Promise<DomainResult<AllocatedCost[]>> {
  const calc = allocateCost(input.totalCostMinor, input.bases);
  return { kind: 'read', data: calc.result };
}

export async function getStandardCost(
  _db: DbSession,
  _ctx: DomainContext,
  input: { components: CostComponent[] },
): Promise<DomainResult<number>> {
  const calc = computeStandardCost(input.components);
  return { kind: 'read', data: calc.result };
}

export async function getCostVariance(
  _db: DbSession,
  _ctx: DomainContext,
  input: { standardMinor: number; actualMinor: number },
): Promise<DomainResult<VarianceResult>> {
  const calc = computeVariance(input.standardMinor, input.actualMinor);
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Allocate costs across cost centers and emit a `cost.allocate` intent.
 */
export async function allocateCostAndEmit(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    allocationRunId: string;
    periodKey: string;
    poolAccountId: string;
    totalCostMinor: number;
    bases: AllocationBase[];
  },
): Promise<DomainResult<AllocatedCost[]>> {
  const calc = allocateCost(input.totalCostMinor, input.bases);

  const intent = buildCostAllocationIntent(
    {
      allocationRunId: input.allocationRunId,
      periodKey: input.periodKey,
      poolAccountId: input.poolAccountId,
      allocations: calc.result.map((a) => ({
        costCenterId: a.centerId,
        amountMinor: a.allocatedMinor,
      })),
    },
    stableCanonicalJson({
      type: 'cost.allocate',
      runId: input.allocationRunId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}
