/**
 * Hedge Accounting Queries — Drizzle-based read operations
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { hedgeDesignations, hedgeEffectivenessTests } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type HedgeDesignationReadModel = {
  id: string;
  hedgeType: string;
  hedgingInstrumentId: string;
  hedgedItem: string;
  designationDate: string;
  hedgedRisk: string;
};

export type EffectivenessTestReadModel = {
  id: string;
  designationId: string;
  testDate: string;
  testMethod: string;
  effectivenessRatio: string | null;
  instrumentFvChangeMinor: number;
  hedgedItemFvChangeMinor: number;
};

export async function getHedgeDesignation(
  db: DbSession,
  ctx: DomainContext,
  designationId: string,
): Promise<HedgeDesignationReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(hedgeDesignations)
      .where(and(eq(hedgeDesignations.orgId, ctx.orgId), eq(hedgeDesignations.id, designationId), eq(hedgeDesignations.isDeleted, false)))
      .limit(1),
  );

  const row = rows[0];
  if (!row) throw new Error(`Hedge designation ${designationId} not found`);

  return {
    id: row.id,
    hedgeType: row.hedgeType,
    hedgingInstrumentId: row.hedgingInstrumentId,
    hedgedItem: row.hedgedItem,
    designationDate: String(row.designationDate),
    hedgedRisk: row.hedgedRisk,
  };
}

export async function getEffectivenessTest(
  db: DbSession,
  ctx: DomainContext,
  testId: string,
): Promise<EffectivenessTestReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(hedgeEffectivenessTests)
      .where(
        and(eq(hedgeEffectivenessTests.orgId, ctx.orgId), eq(hedgeEffectivenessTests.id, testId), eq(hedgeEffectivenessTests.isDeleted, false)),
      )
      .limit(1),
  );

  const row = rows[0];
  if (!row) throw new Error(`Effectiveness test ${testId} not found`);

  return {
    id: row.id,
    designationId: row.designationId,
    testDate: String(row.testDate),
    testMethod: row.testMethod,
    effectivenessRatio: row.effectivenessRatio,
    instrumentFvChangeMinor: row.instrumentFvChangeMinor,
    hedgedItemFvChangeMinor: row.hedgedItemFvChangeMinor,
  };
}
