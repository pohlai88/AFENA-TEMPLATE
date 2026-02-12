import { z } from 'zod';

export const META_ALIAS_SCOPE_TYPES = [
  'org',
  'team',
  'role',
  'user',
  'locale',
  'app_area',
] as const;
export type MetaAliasScopeType = (typeof META_ALIAS_SCOPE_TYPES)[number];
export const metaAliasScopeTypeSchema = z.enum(META_ALIAS_SCOPE_TYPES);
