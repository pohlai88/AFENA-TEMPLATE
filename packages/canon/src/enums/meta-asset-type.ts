import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

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

export const META_ASSET_TYPE_METADATA = {
  table: {
    label: 'Table',
    description: 'Database table',
    tone: 'neutral',
    sortOrder: 1,
  },
  column: {
    label: 'Column',
    description: 'Table column',
    tone: 'neutral',
    sortOrder: 2,
  },
  view: {
    label: 'View',
    description: 'Database view',
    tone: 'info',
    sortOrder: 3,
  },
  pipeline: {
    label: 'Pipeline',
    description: 'Data pipeline',
    tone: 'success',
    sortOrder: 4,
  },
  report: {
    label: 'Report',
    description: 'Report definition',
    tone: 'info',
    sortOrder: 5,
  },
  api: {
    label: 'API',
    description: 'API endpoint',
    tone: 'info',
    sortOrder: 6,
  },
  business_object: {
    label: 'Business Object',
    description: 'Business object definition',
    tone: 'neutral',
    sortOrder: 7,
  },
  policy: {
    label: 'Policy',
    description: 'Access policy',
    tone: 'warning',
    sortOrder: 8,
  },
  metric: {
    label: 'Metric',
    description: 'Business metric',
    tone: 'success',
    sortOrder: 9,
  },
} as const satisfies Record<MetaAssetType, BaseEnumMetadata>;

export const metaAssetTypeKit = createEnumKit(
  META_ASSET_TYPES,
  metaAssetTypeSchema,
  META_ASSET_TYPE_METADATA
);

export const {
  isValid: isValidMetaAssetType,
  assert: assertMetaAssetType,
  getLabel: getMetaAssetTypeLabel,
  getMeta: getMetaAssetTypeMeta,
  labels: META_ASSET_TYPE_LABELS,
} = metaAssetTypeKit;
