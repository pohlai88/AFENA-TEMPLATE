import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const AUTH_SCOPE_TYPES = ['company', 'site', 'team'] as const;
export type AuthScopeType = (typeof AUTH_SCOPE_TYPES)[number];
export const authScopeTypeSchema = z.enum(AUTH_SCOPE_TYPES);

export const AUTH_SCOPE_TYPE_METADATA = {
    company: {
        label: 'Company',
        description: 'Company entity type',
        tone: 'info',
        sortOrder: 1,
    },
    site: {
        label: 'Site',
        description: 'Site entity type',
        tone: 'neutral',
        sortOrder: 2,
    },
    team: {
        label: 'Team',
        description: 'Team entity type',
        tone: 'neutral',
        sortOrder: 3,
    },
} as const satisfies Record<AuthScopeType, BaseEnumMetadata>;

export const authScopeTypeKit = createEnumKit(
    AUTH_SCOPE_TYPES,
    authScopeTypeSchema,
    AUTH_SCOPE_TYPE_METADATA
);

export const {
    isValid: isValidAuthScopeType,
    assert: assertAuthScopeType,
    getLabel: getAuthScopeTypeLabel,
    getMeta: getAuthScopeTypeMeta,
    labels: AUTH_SCOPE_TYPE_LABELS,
} = authScopeTypeKit;
