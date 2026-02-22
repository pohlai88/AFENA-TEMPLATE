import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

export const AUTH_SCOPES = ['org', 'self', 'company', 'site', 'team'] as const;
export type AuthScope = (typeof AUTH_SCOPES)[number];
export const authScopeSchema = z.enum(AUTH_SCOPES);

// ============================================================================
// Metadata (SSOT)
// ============================================================================

export interface AuthScopeMetadata extends BaseEnumMetadata {
    hierarchical: boolean;
    level?: number;
}

export const AUTH_SCOPE_METADATA = {
    org: {
        label: 'Organization',
        description: 'Organization-wide scope',
        tone: 'info',
        hierarchical: true,
        level: 1,
        sortOrder: 1,
    },
    company: {
        label: 'Company',
        description: 'Company-level scope',
        tone: 'info',
        hierarchical: true,
        level: 2,
        sortOrder: 2,
    },
    site: {
        label: 'Site',
        description: 'Site-level scope',
        tone: 'neutral',
        hierarchical: true,
        level: 3,
        sortOrder: 3,
    },
    team: {
        label: 'Team',
        description: 'Team-level scope',
        tone: 'neutral',
        hierarchical: true,
        level: 4,
        sortOrder: 4,
    },
    self: {
        label: 'Self',
        description: 'User-specific scope',
        tone: 'success',
        hierarchical: false,
        sortOrder: 5,
    },
} as const satisfies Record<AuthScope, AuthScopeMetadata>;

// ============================================================================
// Enum Kit
// ============================================================================

export const authScopeKit = createEnumKit(AUTH_SCOPES, authScopeSchema, AUTH_SCOPE_METADATA);

export const {
    isValid: isValidAuthScope,
    assert: assertAuthScope,
    getLabel: getAuthScopeLabel,
    getMeta: getAuthScopeMeta,
    labels: AUTH_SCOPE_LABELS,
} = authScopeKit;

// ============================================================================
// Semantic Subsets
// ============================================================================

export const HIERARCHICAL_AUTH_SCOPES = createSubset(['org', 'company', 'site', 'team'] as const);

// ============================================================================
// Semantic Predicates
// ============================================================================

export const isHierarchicalAuthScope = (s: AuthScope) => HIERARCHICAL_AUTH_SCOPES.has(s);
