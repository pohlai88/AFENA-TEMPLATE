import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { ProfitabilityResult } from '../calculators/project-profitability';
import { computeProjectProfitability } from '../calculators/project-profitability';
import type { ProjectCost, WipResult } from '../calculators/wip-valuation';
import { computeWipValuation } from '../calculators/wip-valuation';
import { buildProjectCostPostingIntent } from '../commands/project-intent';
import { getProject } from '../queries/project-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getWipValuation(
  _db: DbSession,
  _ctx: DomainContext,
  input: { costs: ProjectCost[]; revenueRecognizedMinor: number; budgetCostMinor: number },
): Promise<DomainResult<WipResult>> {
  const calc = computeWipValuation(
    input.costs,
    input.revenueRecognizedMinor,
    input.budgetCostMinor,
  );
  return { kind: 'read', data: calc.result };
}

export async function getProjectProfitability(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    revenueMinor: number;
    costMinor: number;
    budgetRevenueMinor: number;
    budgetCostMinor: number;
  },
): Promise<DomainResult<ProfitabilityResult>> {
  const calc = computeProjectProfitability(
    input.revenueMinor,
    input.costMinor,
    input.budgetRevenueMinor,
    input.budgetCostMinor,
  );
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Post a cost entry against a project loaded from DB and emit
 * a `project.cost` intent.
 */
export async function postProjectCostFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    projectId: string;
    costType: 'labor' | 'material' | 'overhead' | 'subcontract';
    amountMinor: number;
    periodKey: string;
  },
): Promise<DomainResult<{ projectId: string; costType: string; amountMinor: number }>> {
  const project = await getProject(db, ctx, input.projectId);

  const intent = buildProjectCostPostingIntent(
    {
      projectId: project.projectId,
      costType: input.costType,
      amountMinor: input.amountMinor,
      periodKey: input.periodKey,
    },
    stableCanonicalJson({
      type: 'project.cost',
      projectId: project.projectId,
      periodKey: input.periodKey,
      costType: input.costType,
    }),
  );

  return {
    kind: 'intent+read',
    data: {
      projectId: project.projectId,
      costType: input.costType,
      amountMinor: input.amountMinor,
    },
    intents: [intent],
  };
}
