import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

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

export const META_ALIAS_SCOPE_TYPE_METADATA = {
  org: {
    label: 'Organization',
    description: 'Organization-wide alias scope',
    tone: 'info',
    sortOrder: 1,
  },
  team: {
    label: 'Team',
    description: 'Team-specific alias scope',
    tone: 'neutral',
    sortOrder: 2,
  },
  role: {
    label: 'Role',
    description: 'Role-based alias scope',
    tone: 'neutral',
    sortOrder: 3,
  },
  user: {
    label: 'User',
    description: 'User-specific alias scope',
    tone: 'success',
    sortOrder: 4,
  },
  locale: {
    label: 'Locale',
    description: 'Locale-specific alias scope',
    tone: 'neutral',
    sortOrder: 5,
  },
  app_area: {
    label: 'App Area',
    description: 'Application area-specific alias scope',
    tone: 'neutral',
    sortOrder: 6,
  },
} as const satisfies Record<MetaAliasScopeType, BaseEnumMetadata>;

export const metaAliasScopeTypeKit = createEnumKit(
  META_ALIAS_SCOPE_TYPES,
  metaAliasScopeTypeSchema,
  META_ALIAS_SCOPE_TYPE_METADATA
);

export const {
  isValid: isValidMetaAliasScopeType,
  assert: assertMetaAliasScopeType,
  getLabel: getMetaAliasScopeTypeLabel,
  getMeta: getMetaAliasScopeTypeMeta,
  labels: META_ALIAS_SCOPE_TYPE_LABELS,
} = metaAliasScopeTypeKit;
