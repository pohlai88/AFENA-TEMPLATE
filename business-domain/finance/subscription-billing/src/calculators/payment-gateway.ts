import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see SB-03 — Invoice generation on billing cycle trigger
 * G-15 / SB-10 — Payment Gateway Hook (PCI DSS Compliant)
 *
 * Validates and prepares payment gateway requests for subscription billing.
 * Computes retry eligibility, idempotency keys, and maps gateway-specific
 * error codes to standardised decline reasons.
 *
 * Pure function — no I/O. Actual gateway calls are side effects handled
 * by the workflow outbox / IO worker.
 */

export type PaymentMethod = {
  methodId: string;
  type: 'card' | 'bank_debit' | 'wallet' | 'invoice';
  lastFour: string;
  expiryIso: string | null;
  isDefault: boolean;
};

export type GatewayChargeRequest = {
  subscriptionId: string;
  invoiceId: string;
  amountMinor: number;
  currency: string;
  paymentMethod: PaymentMethod;
  attemptNumber: number;
  maxAttempts: number;
  previousDeclineCode: string | null;
  /** ISO timestamp for current time — injected for determinism */
  nowIso: string;
};

export type DeclineCategory =
  | 'hard_decline'
  | 'soft_decline'
  | 'fraud'
  | 'expired'
  | 'insufficient_funds';

export type GatewayChargeResult = {
  subscriptionId: string;
  invoiceId: string;
  amountMinor: number;
  currency: string;
  idempotencyKey: string;
  eligible: boolean;
  declineCategory: DeclineCategory | null;
  retryEligible: boolean;
  nextRetryDelayMs: number | null;
  shouldDunning: boolean;
  gatewayPayload: {
    amount: number;
    currency: string;
    paymentMethodId: string;
    idempotencyKey: string;
    metadata: Record<string, string>;
  };
};

const HARD_DECLINE_CODES = new Set([
  'card_declined_hard',
  'do_not_honor',
  'stolen_card',
  'lost_card',
  'pickup_card',
  'restricted_card',
  'security_violation',
  'fraudulent',
]);

const EXPIRED_CODES = new Set(['expired_card', 'invalid_expiry']);

const FRAUD_CODES = new Set(['fraudulent', 'suspected_fraud', 'high_risk']);

const RETRY_BACKOFF_MS = [0, 3_600_000, 86_400_000, 259_200_000, 604_800_000];

/**
 * Prepare a gateway charge request with retry logic and decline classification.
 */
export function prepareGatewayCharge(
  request: GatewayChargeRequest,
): CalculatorResult<GatewayChargeResult> {
  if (request.amountMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Charge amount must be positive');
  }
  if (request.attemptNumber < 1) {
    throw new DomainError('VALIDATION_FAILED', 'attemptNumber must be >= 1');
  }
  if (request.maxAttempts < 1) {
    throw new DomainError('VALIDATION_FAILED', 'maxAttempts must be >= 1');
  }

  const idempotencyKey = `sub_${request.subscriptionId}_inv_${request.invoiceId}_att_${request.attemptNumber}`;

  let declineCategory: DeclineCategory | null = null;
  if (request.previousDeclineCode) {
    if (HARD_DECLINE_CODES.has(request.previousDeclineCode)) {
      declineCategory = 'hard_decline';
    } else if (FRAUD_CODES.has(request.previousDeclineCode)) {
      declineCategory = 'fraud';
    } else if (EXPIRED_CODES.has(request.previousDeclineCode)) {
      declineCategory = 'expired';
    } else if (request.previousDeclineCode === 'insufficient_funds') {
      declineCategory = 'insufficient_funds';
    } else {
      declineCategory = 'soft_decline';
    }
  }

  const isExpired =
    request.paymentMethod.expiryIso !== null &&
    request.paymentMethod.expiryIso < request.nowIso.slice(0, 7);

  const retryEligible =
    !isExpired &&
    declineCategory !== 'hard_decline' &&
    declineCategory !== 'fraud' &&
    request.attemptNumber < request.maxAttempts;

  const nextRetryDelayMs = retryEligible
    ? (RETRY_BACKOFF_MS[request.attemptNumber] ?? RETRY_BACKOFF_MS[RETRY_BACKOFF_MS.length - 1]!)
    : null;

  const shouldDunning = !retryEligible && request.attemptNumber >= request.maxAttempts;

  const eligible = !isExpired && declineCategory !== 'hard_decline' && declineCategory !== 'fraud';

  return {
    result: {
      subscriptionId: request.subscriptionId,
      invoiceId: request.invoiceId,
      amountMinor: request.amountMinor,
      currency: request.currency,
      idempotencyKey,
      eligible,
      declineCategory,
      retryEligible,
      nextRetryDelayMs,
      shouldDunning,
      gatewayPayload: {
        amount: request.amountMinor,
        currency: request.currency,
        paymentMethodId: request.paymentMethod.methodId,
        idempotencyKey,
        metadata: {
          subscription_id: request.subscriptionId,
          invoice_id: request.invoiceId,
          attempt: String(request.attemptNumber),
        },
      },
    },
    inputs: request,
    explanation: `Gateway charge: ${request.currency} ${request.amountMinor} for sub ${request.subscriptionId}, attempt ${request.attemptNumber}/${request.maxAttempts}, eligible=${eligible}, retry=${retryEligible}`,
  };
}
