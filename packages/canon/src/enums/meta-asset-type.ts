import { z } from 'zod';

export const META_ASSET_TYPES = [
  'table',
  'column',
  'view',
  'pipeline',
  'report',
  'api',
  'business_object',
  'policy',
  'metric',
] as const;
export type MetaAssetType = (typeof META_ASSET_TYPES)[number];
export const metaAssetTypeSchema = z.enum(META_ASSET_TYPES);
