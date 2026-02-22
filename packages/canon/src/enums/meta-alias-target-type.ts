import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const META_ALIAS_TARGET_TYPES = [
  'asset',
  'custom_field',
  'metric',
  'view_field',
  'enum_value',
] as const;
export type MetaAliasTargetType = (typeof META_ALIAS_TARGET_TYPES)[number];
export const metaAliasTargetTypeSchema = z.enum(META_ALIAS_TARGET_TYPES);

export const META_ALIAS_TARGET_TYPE_METADATA = {
  asset: {
    label: 'Asset',
    description: 'Metadata asset',
    tone: 'neutral',
    sortOrder: 1,
  },
  custom_field: {
    label: 'Custom Field',
    description: 'Custom field definition',
    tone: 'info',
    sortOrder: 2,
  },
  metric: {
    label: 'Metric',
    description: 'Business metric',
    tone: 'success',
    sortOrder: 3,
  },
  view_field: {
    label: 'View Field',
    description: 'View field definition',
    tone: 'neutral',
    sortOrder: 4,
  },
  enum_value: {
    label: 'Enum Value',
    description: 'Enumeration value',
    tone: 'neutral',
    sortOrder: 5,
  },
} as const satisfies Record<MetaAliasTargetType, BaseEnumMetadata>;

export const metaAliasTargetTypeKit = createEnumKit(
  META_ALIAS_TARGET_TYPES,
  metaAliasTargetTypeSchema,
  META_ALIAS_TARGET_TYPE_METADATA
);

export const {
  isValid: isValidMetaAliasTargetType,
  assert: assertMetaAliasTargetType,
  getLabel: getMetaAliasTargetTypeLabel,
  getMeta: getMetaAliasTargetTypeMeta,
  labels: META_ALIAS_TARGET_TYPE_LABELS,
} = metaAliasTargetTypeKit;
