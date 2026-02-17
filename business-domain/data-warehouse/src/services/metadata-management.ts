import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const RegisterDataAssetParams = z.object({
  assetName: z.string(),
  assetType: z.enum(['table', 'view', 'report', 'dashboard', 'dataset']),
  owner: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
});

export interface DataAsset {
  assetId: string;
  assetName: string;
  assetType: string;
  owner: string;
  registeredAt: Date;
  status: 'active' | 'deprecated' | 'archived';
}

export async function registerDataAsset(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RegisterDataAssetParams>,
): Promise<Result<DataAsset>> {
  const validated = RegisterDataAssetParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ assetId: 'asset-1', assetName: validated.data.assetName, assetType: validated.data.assetType, owner: validated.data.owner, registeredAt: new Date(), status: 'active' });
}

export const TrackDataLineageParams = z.object({
  assetId: z.string(),
  depth: z.number().default(3),
});

export interface DataLineage {
  assetId: string;
  upstreamSources: Array<{ sourceId: string; sourceName: string; transformations: string[] }>;
  downstreamConsumers: Array<{ consumerId: string; consumerName: string }>;
  lineageDepth: number;
}

export async function trackDataLineage(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof TrackDataLineageParams>,
): Promise<Result<DataLineage>> {
  const validated = TrackDataLineageParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ assetId: validated.data.assetId, upstreamSources: [{ sourceId: 'src-1', sourceName: 'oltp_sales', transformations: ['aggregate', 'join'] }], downstreamConsumers: [{ consumerId: 'rpt-1', consumerName: 'Sales Dashboard' }], lineageDepth: validated.data.depth });
}
