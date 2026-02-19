import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

/**
 * Document lifecycle statuses for transactional documents.
 *
 * @remarks
 * Typical flow: draft → submitted → active → cancelled/amended
 */
export const DOC_STATUSES = ['draft', 'submitted', 'active', 'cancelled', 'amended'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
export const docStatusSchema = z.enum(DOC_STATUSES);

// ============================================================================
// Metadata (SSOT)
// ============================================================================

/** Extended metadata for doc statuses */
export interface DocStatusMetadata extends BaseEnumMetadata {
    /** Whether status is terminal (no further transitions) */
    terminal: boolean;
    /** Whether document is editable in this status */
    editable: boolean;
}

/**
 * Complete metadata for all doc statuses.
 * This is the SINGLE SOURCE OF TRUTH - labels are derived from here.
 */
export const DOC_STATUS_METADATA = {
    draft: {
        label: 'Draft',
        description: 'Initial state; fully editable.',
        tone: 'neutral',
        editable: true,
        terminal: false,
        sortOrder: 1,
    },
    submitted: {
        label: 'Submitted',
        description: 'Awaiting approval; read-only.',
        tone: 'info',
        editable: false,
        terminal: false,
        sortOrder: 2,
    },
    active: {
        label: 'Active',
        description: 'Approved and in effect.',
        tone: 'success',
        editable: false,
        terminal: false,
        sortOrder: 3,
    },
    amended: {
        label: 'Amended',
        description: 'Superseded by amendment; terminal.',
        tone: 'warning',
        editable: false,
        terminal: true,
        sortOrder: 4,
    },
    cancelled: {
        label: 'Cancelled',
        description: 'Aborted; terminal.',
        tone: 'danger',
        editable: false,
        terminal: true,
        sortOrder: 5,
    },
} as const satisfies Record<DocStatus, DocStatusMetadata>;

// ============================================================================
// Enum Kit (all standard helpers)
// ============================================================================

export const docStatusKit = createEnumKit(DOC_STATUSES, docStatusSchema, DOC_STATUS_METADATA);

export const {
    isValid: isValidDocStatus,
    assert: assertDocStatus,
    getLabel: getDocStatusLabel,
    getMeta: getDocStatusMeta,
    labels: DOC_STATUS_LABELS,
} = docStatusKit;

// ============================================================================
// Semantic Subsets
// ============================================================================

/** Terminal statuses (no further transitions) */
export const TERMINAL_DOC_STATUSES = createSubset(['cancelled', 'amended'] as const);

/** Editable statuses */
export const EDITABLE_DOC_STATUSES = createSubset(['draft'] as const);

/** Active/in-flight statuses */
export const ACTIVE_DOC_STATUSES = createSubset(['submitted', 'active'] as const);

// ============================================================================
// Semantic Predicates
// ============================================================================

/** Check if status is terminal (O(1)) */
export const isTerminalDocStatus = (s: DocStatus) => TERMINAL_DOC_STATUSES.has(s);

/** Check if status allows editing (O(1)) */
export const isEditableDocStatus = (s: DocStatus) => EDITABLE_DOC_STATUSES.has(s);

/** Check if status is active/in-flight (O(1)) */
export const isActiveDocStatus = (s: DocStatus) => ACTIVE_DOC_STATUSES.has(s);
