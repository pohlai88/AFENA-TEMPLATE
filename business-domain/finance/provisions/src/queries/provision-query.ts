/**
 * Provision Queries — Drizzle-based read operations
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { provisionMovements, provisions } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type ProvisionReadModel = {
  id: string;
  provisionNo: string;
  name: string;
  provisionType: string;
  bestEstimateMinor: number;
  presentValueMinor: number | null;
  discountRate: string | null;
  currencyCode: string;
  recognitionDate: string;
  expectedSettlementDate: string | null;
  isActive: boolean;
};

export type ProvisionMovementReadModel = {
  id: string;
  provisionId: string;
  movementType: string;
  amountMinor: number;
  movementDate: string;
  periodKey: string | null;
  reason: string | null;
};

export async function getProvision(
  db: DbSession,
  ctx: DomainContext,
  provisionId: string,
): Promise<ProvisionReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(provisions)
      .where(and(eq(provisions.orgId, ctx.orgId), eq(provisions.id, provisionId), eq(provisions.isDeleted, false)))
      .limit(1),
  );

  const row = rows[0];
  if (!row) throw new Error(`Provision ${provisionId} not found`);

  return {
    id: row.id,
    provisionNo: row.provisionNo,
    name: row.name,
    provisionType: row.provisionType,
    bestEstimateMinor: Number(row.bestEstimateMinor),
    presentValueMinor: row.presentValueMinor ? Number(row.presentValueMinor) : null,
    discountRate: row.discountRate,
    currencyCode: row.currencyCode,
    recognitionDate: String(row.recognitionDate),
    expectedSettlementDate: row.expectedSettlementDate ? String(row.expectedSettlementDate) : null,
    isActive: row.isActive ?? true,
  };
}

export async function getProvisionMovements(
  db: DbSession,
  ctx: DomainContext,
  provisionId: string,
): Promise<ProvisionMovementReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(provisionMovements)
      .where(
        and(eq(provisionMovements.orgId, ctx.orgId), eq(provisionMovements.provisionId, provisionId)),
      ),
  );

  return rows.map((r) => ({
    id: r.id,
    provisionId: r.provisionId,
    movementType: r.movementType,
    amountMinor: Number(r.amountMinor),
    movementDate: String(r.movementDate),
    periodKey: r.periodKey,
    reason: r.reason,
  }));
}
