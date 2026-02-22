import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { fixedAssets } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type AssetReadModel = {
  assetId: string;
  description: string;
  costMinor: number;
  salvageMinor: number;
  usefulLifeMonths: number;
  acquisitionDateIso: string;
  depreciationMethod: string;
};

export async function getAsset(
  db: DbSession,
  ctx: DomainContext,
  assetId: string,
): Promise<AssetReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        assetId: fixedAssets.id,
        description: fixedAssets.name,
        costMinor: fixedAssets.acquisitionCost,
        salvageMinor: fixedAssets.salvageValue,
        usefulLifeMonths: fixedAssets.usefulLife,
        acquisitionDateIso: fixedAssets.acquisitionDate,
        depreciationMethod: fixedAssets.depreciationMethod,
      })
      .from(fixedAssets)
      .where(
        and(
          eq(fixedAssets.orgId, ctx.orgId),
          eq(fixedAssets.id, assetId),
          eq(fixedAssets.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Fixed asset not found: ${assetId}`, { assetId });
  }

  const r = rows[0]!;
  return {
    assetId: r.assetId,
    description: r.description,
    costMinor: Number(r.costMinor ?? 0),
    salvageMinor: Number(r.salvageMinor ?? 0),
    usefulLifeMonths: r.usefulLifeMonths ?? 0,
    acquisitionDateIso: String(r.acquisitionDateIso ?? ''),
    depreciationMethod: r.depreciationMethod ?? 'straight_line',
  };
}
