import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { DunningCustomer, DunningResult } from '../calculators/dunning-letters';
import { generateDunningActions } from '../calculators/dunning-letters';
import { buildDunningRunCreateIntent } from '../commands/dunning-intent';
import type { DunningNoticeReadModel, DunningRunReadModel } from '../queries/dunning-query';
import { getDunningNoticesByRun, getDunningRuns } from '../queries/dunning-query';

/**
 * Run the dunning engine: compute escalating actions for overdue customers
 * and emit an intent to create the dunning run + notices.
 *
 * @see CM-06 — Dunning: Escalating Letters
 */
export async function createDunningRun(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    runDate: string;
    cutoffDate: string;
    overdueCustomers: DunningCustomer[];
  },
): Promise<DomainResult<DunningResult>> {
  // Empty customer list is a valid no-op — return empty result without an intent.
  if (input.overdueCustomers.length === 0) {
    return { kind: 'read', data: { actions: [] } };
  }

  const calc = generateDunningActions(input.overdueCustomers);

  const intent = buildDunningRunCreateIntent(
    {
      runDate: input.runDate,
      cutoffDate: input.cutoffDate,
      notices: calc.result.actions.map((a) => ({
        customerId: a.customerId,
        noticeLevel: a.noticeLevel,
        actionType: a.action,
        amountOutstandingMinor: a.overdueMinor,
      })),
    },
    stableCanonicalJson({
      runDate: input.runDate,
      cutoffDate: input.cutoffDate,
      customerCount: input.overdueCustomers.length,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * List dunning runs, optionally filtered by status.
 */
export async function listDunningRuns(
  db: DbSession,
  ctx: DomainContext,
  input: { status?: string },
): Promise<DomainResult<DunningRunReadModel[]>> {
  const runs = await getDunningRuns(db, ctx, input);
  return { kind: 'read', data: runs };
}

/**
 * Get notices for a specific dunning run.
 */
export async function getDunningRunNotices(
  db: DbSession,
  ctx: DomainContext,
  input: { dunningRunId: string },
): Promise<DomainResult<DunningNoticeReadModel[]>> {
  const notices = await getDunningNoticesByRun(db, ctx, input);
  return { kind: 'read', data: notices };
}
