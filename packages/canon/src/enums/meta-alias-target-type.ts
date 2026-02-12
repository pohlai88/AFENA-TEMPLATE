import { z } from 'zod';

export const META_ALIAS_TARGET_TYPES = [
  'asset',
  'custom_field',
  'metric',
  'view_field',
  'enum_value',
] as const;
export type MetaAliasTargetType = (typeof META_ALIAS_TARGET_TYPES)[number];
export const metaAliasTargetTypeSchema = z.enum(META_ALIAS_TARGET_TYPES);
