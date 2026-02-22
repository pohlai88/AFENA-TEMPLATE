import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

export const PAYMENT_STATUSES = ['unpaid', 'partial', 'paid', 'overpaid', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

// ============================================================================
// Metadata (SSOT)
// ============================================================================

export interface PaymentStatusMetadata extends BaseEnumMetadata {
    terminal: boolean;
    requiresAction: boolean;
}

export const PAYMENT_STATUS_METADATA = {
    unpaid: {
        label: 'Unpaid',
        description: 'No payment received',
        tone: 'danger',
        terminal: false,
        requiresAction: true,
        sortOrder: 1,
    },
    partial: {
        label: 'Partial',
        description: 'Partially paid',
        tone: 'warning',
        terminal: false,
        requiresAction: true,
        sortOrder: 2,
    },
    paid: {
        label: 'Paid',
        description: 'Fully paid',
        tone: 'success',
        terminal: false,
        requiresAction: false,
        sortOrder: 3,
    },
    overpaid: {
        label: 'Overpaid',
        description: 'Payment exceeds amount due',
        tone: 'info',
        terminal: false,
        requiresAction: true,
        sortOrder: 4,
    },
    refunded: {
        label: 'Refunded',
        description: 'Payment refunded; terminal state',
        tone: 'neutral',
        terminal: true,
        requiresAction: false,
        sortOrder: 5,
    },
} as const satisfies Record<PaymentStatus, PaymentStatusMetadata>;

// ============================================================================
// Enum Kit
// ============================================================================

export const paymentStatusKit = createEnumKit(
    PAYMENT_STATUSES,
    paymentStatusSchema,
    PAYMENT_STATUS_METADATA
);

export const {
    isValid: isValidPaymentStatus,
    assert: assertPaymentStatus,
    getLabel: getPaymentStatusLabel,
    getMeta: getPaymentStatusMeta,
    labels: PAYMENT_STATUS_LABELS,
} = paymentStatusKit;

// ============================================================================
// Semantic Subsets
// ============================================================================

export const UNPAID_PAYMENT_STATUSES = createSubset(['unpaid', 'partial'] as const);
export const PAID_PAYMENT_STATUSES = createSubset(['paid', 'overpaid'] as const);
export const TERMINAL_PAYMENT_STATUSES = createSubset(['refunded'] as const);

// ============================================================================
// Semantic Predicates
// ============================================================================

export const isUnpaidPaymentStatus = (s: PaymentStatus) => UNPAID_PAYMENT_STATUSES.has(s);
export const isPaidPaymentStatus = (s: PaymentStatus) => PAID_PAYMENT_STATUSES.has(s);
export const isTerminalPaymentStatus = (s: PaymentStatus) => TERMINAL_PAYMENT_STATUSES.has(s);
export const requiresActionPaymentStatus = (s: PaymentStatus) =>
    PAYMENT_STATUS_METADATA[s].requiresAction;
