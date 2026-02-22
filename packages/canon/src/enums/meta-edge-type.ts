import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const META_EDGE_TYPES = [
  'ingests',
  'transforms',
  'serves',
  'derives',
  'posts_to',
  'affects',
] as const;
export type MetaEdgeType = (typeof META_EDGE_TYPES)[number];
export const metaEdgeTypeSchema = z.enum(META_EDGE_TYPES);

export const META_EDGE_TYPE_METADATA = {
  ingests: {
    label: 'Ingests',
    description: 'Data ingestion relationship',
    tone: 'info',
    sortOrder: 1,
  },
  transforms: {
    label: 'Transforms',
    description: 'Data transformation relationship',
    tone: 'success',
    sortOrder: 2,
  },
  serves: {
    label: 'Serves',
    description: 'Data serving relationship',
    tone: 'info',
    sortOrder: 3,
  },
  derives: {
    label: 'Derives',
    description: 'Data derivation relationship',
    tone: 'neutral',
    sortOrder: 4,
  },
  posts_to: {
    label: 'Posts To',
    description: 'Posting relationship',
    tone: 'neutral',
    sortOrder: 5,
  },
  affects: {
    label: 'Affects',
    description: 'Impact relationship',
    tone: 'warning',
    sortOrder: 6,
  },
} as const satisfies Record<MetaEdgeType, BaseEnumMetadata>;

export const metaEdgeTypeKit = createEnumKit(
  META_EDGE_TYPES,
  metaEdgeTypeSchema,
  META_EDGE_TYPE_METADATA
);

export const {
  isValid: isValidMetaEdgeType,
  assert: assertMetaEdgeType,
  getLabel: getMetaEdgeTypeLabel,
  getMeta: getMetaEdgeTypeMeta,
  labels: META_EDGE_TYPE_LABELS,
} = metaEdgeTypeKit;
