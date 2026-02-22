/**
 * Transfer Pricing Queries
 *
 * Read operations against tp_policies and tp_calculations tables.
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { tpCalculations, tpPolicies } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

/* ---------- Read Models ---------- */

export interface TpPolicyReadModel {
  id: string;
  orgId: string;
  policyCode: string;
  name: string;
  tpMethod: 'cup' | 'rpm' | 'cpm' | 'tnmm' | 'psm';
  transactionType: string;
  testedPartyId: string;
  counterpartyId: string;
  pliConfig: unknown; // JSONB
  armLengthRange: unknown; // JSONB
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface TpCalculationReadModel {
  id: string;
  orgId: string;
  policyId: string;
  fiscalYear: string;
  calculationDate: string;
  appliedMethod: string;
  transactionValueMinor: number;
  currencyCode: string;
  pliValue: string | null;
  rangeLow: string | null;
  rangeMedian: string | null;
  rangeHigh: string | null;
  result: string;
  adjustmentMinor: number;
  calculationDetails: unknown;
  notes: string | null;
}

/* ---------- Queries ---------- */

export async function getTpPolicy(
  db: DbSession,
  ctx: DomainContext,
  policyId: string,
): Promise<TpPolicyReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(tpPolicies)
      .where(and(eq(tpPolicies.orgId, ctx.orgId), eq(tpPolicies.id, policyId), eq(tpPolicies.isDeleted, false))),
  );
  if (rows.length === 0) throw new Error(`TP policy ${policyId} not found`);
  return rows[0] as TpPolicyReadModel;
}

export async function getActivePolicies(
  db: DbSession,
  ctx: DomainContext,
): Promise<TpPolicyReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(tpPolicies)
      .where(and(eq(tpPolicies.orgId, ctx.orgId), eq(tpPolicies.isActive, true), eq(tpPolicies.isDeleted, false))),
  );
  return rows as TpPolicyReadModel[];
}

export async function getTpCalculation(
  db: DbSession,
  ctx: DomainContext,
  calculationId: string,
): Promise<TpCalculationReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(tpCalculations)
      .where(and(eq(tpCalculations.orgId, ctx.orgId), eq(tpCalculations.id, calculationId), eq(tpCalculations.isDeleted, false))),
  );
  if (rows.length === 0) throw new Error(`TP calculation ${calculationId} not found`);
  return rows[0] as TpCalculationReadModel;
}

export async function getCalculationsByPolicy(
  db: DbSession,
  ctx: DomainContext,
  policyId: string,
  fiscalYear?: string,
): Promise<TpCalculationReadModel[]> {
  const rows = await db.read((tx) => {
    const conditions = [eq(tpCalculations.orgId, ctx.orgId), eq(tpCalculations.policyId, policyId), eq(tpCalculations.isDeleted, false)];
    if (fiscalYear) {
      conditions.push(eq(tpCalculations.fiscalYear, fiscalYear));
    }
    return tx
      .select()
      .from(tpCalculations)
      .where(and(...conditions));
  });
  return rows as TpCalculationReadModel[];
}
