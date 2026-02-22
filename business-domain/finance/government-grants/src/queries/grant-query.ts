import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { governmentGrantItems } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type GrantReadModel = {
  id: string;
  grantNo: string;
  grantType: string;
  periodKey: string;
  currencyCode: string;
  grantAmountMinor: number;
  amortisedMinor: number;
  deferredMinor: number;
  relatedAssetId: string | null;
  conditions: string | null;
  isActive: boolean;
};

export async function getGrant(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<GrantReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: governmentGrantItems.id,
        grantNo: governmentGrantItems.grantNo,
        grantType: governmentGrantItems.grantType,
        periodKey: governmentGrantItems.periodKey,
        currencyCode: governmentGrantItems.currencyCode,
        grantAmountMinor: governmentGrantItems.grantAmountMinor,
        amortisedMinor: governmentGrantItems.amortisedMinor,
        deferredMinor: governmentGrantItems.deferredMinor,
        relatedAssetId: governmentGrantItems.relatedAssetId,
        conditions: governmentGrantItems.conditions,
        isActive: governmentGrantItems.isActive,
      })
      .from(governmentGrantItems)
      .where(
        and(
          eq(governmentGrantItems.orgId, ctx.orgId),
          eq(governmentGrantItems.companyId, ctx.companyId),
          eq(governmentGrantItems.id, id),
          eq(governmentGrantItems.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Grant not found: ${id}`);
  return rows[0]!;
}

export async function listActiveGrants(
  db: DbSession,
  ctx: DomainContext,
  periodKey: string,
): Promise<GrantReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: governmentGrantItems.id,
        grantNo: governmentGrantItems.grantNo,
        grantType: governmentGrantItems.grantType,
        periodKey: governmentGrantItems.periodKey,
        currencyCode: governmentGrantItems.currencyCode,
        grantAmountMinor: governmentGrantItems.grantAmountMinor,
        amortisedMinor: governmentGrantItems.amortisedMinor,
        deferredMinor: governmentGrantItems.deferredMinor,
        relatedAssetId: governmentGrantItems.relatedAssetId,
        conditions: governmentGrantItems.conditions,
        isActive: governmentGrantItems.isActive,
      })
      .from(governmentGrantItems)
      .where(
        and(
          eq(governmentGrantItems.orgId, ctx.orgId),
          eq(governmentGrantItems.companyId, ctx.companyId),
          eq(governmentGrantItems.periodKey, periodKey),
          eq(governmentGrantItems.isActive, true),
          eq(governmentGrantItems.isDeleted, false),
        ),
      ),
  );
}
