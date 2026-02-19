import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

export const AUTH_VERBS = ['create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore'] as const;
export type AuthVerb = (typeof AUTH_VERBS)[number];
export const authVerbSchema = z.enum(AUTH_VERBS);

// ============================================================================
// Metadata (SSOT)
// ============================================================================

export interface AuthVerbMetadata extends BaseEnumMetadata {
    family: 'crud' | 'lifecycle' | 'recovery';
}

export const AUTH_VERB_METADATA = {
    create: {
        label: 'Create',
        description: 'Create new record',
        tone: 'success',
        family: 'crud',
        sortOrder: 1,
    },
    update: {
        label: 'Update',
        description: 'Modify existing record',
        tone: 'info',
        family: 'crud',
        sortOrder: 2,
    },
    delete: {
        label: 'Delete',
        description: 'Soft delete record',
        tone: 'danger',
        family: 'crud',
        sortOrder: 3,
    },
    submit: {
        label: 'Submit',
        description: 'Submit for approval',
        tone: 'info',
        family: 'lifecycle',
        sortOrder: 4,
    },
    cancel: {
        label: 'Cancel',
        description: 'Cancel submission or process',
        tone: 'warning',
        family: 'lifecycle',
        sortOrder: 5,
    },
    amend: {
        label: 'Amend',
        description: 'Amend submitted record',
        tone: 'warning',
        family: 'lifecycle',
        sortOrder: 6,
    },
    approve: {
        label: 'Approve',
        description: 'Approve submission',
        tone: 'success',
        family: 'lifecycle',
        sortOrder: 7,
    },
    reject: {
        label: 'Reject',
        description: 'Reject submission',
        tone: 'danger',
        family: 'lifecycle',
        sortOrder: 8,
    },
    restore: {
        label: 'Restore',
        description: 'Restore deleted record',
        tone: 'info',
        family: 'recovery',
        sortOrder: 9,
    },
} as const satisfies Record<AuthVerb, AuthVerbMetadata>;

// ============================================================================
// Enum Kit
// ============================================================================

export const authVerbKit = createEnumKit(AUTH_VERBS, authVerbSchema, AUTH_VERB_METADATA);

export const {
    isValid: isValidAuthVerb,
    assert: assertAuthVerb,
    getLabel: getAuthVerbLabel,
    getMeta: getAuthVerbMeta,
    labels: AUTH_VERB_LABELS,
} = authVerbKit;

// ============================================================================
// Semantic Subsets
// ============================================================================

export const CRUD_AUTH_VERBS = createSubset(['create', 'update', 'delete'] as const);
export const LIFECYCLE_AUTH_VERBS = createSubset(['submit', 'cancel', 'amend', 'approve', 'reject'] as const);
export const RECOVERY_AUTH_VERBS = createSubset(['restore'] as const);

// ============================================================================
// Semantic Predicates
// ============================================================================

export const isCrudAuthVerb = (v: AuthVerb) => CRUD_AUTH_VERBS.has(v);
export const isLifecycleAuthVerb = (v: AuthVerb) => LIFECYCLE_AUTH_VERBS.has(v);
export const isRecoveryAuthVerb = (v: AuthVerb) => RECOVERY_AUTH_VERBS.has(v);
