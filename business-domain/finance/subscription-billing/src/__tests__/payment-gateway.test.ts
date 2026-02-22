import { describe, expect, it } from 'vitest';
import { prepareGatewayCharge } from '../calculators/payment-gateway';

const baseRequest = {
  subscriptionId: 'sub-1',
  invoiceId: 'inv-1',
  amountMinor: 9900,
  currency: 'USD',
  paymentMethod: {
    methodId: 'pm-1',
    type: 'card' as const,
    lastFour: '4242',
    expiryIso: '2028-12',
    isDefault: true,
  },
  attemptNumber: 1,
  maxAttempts: 4,
  previousDeclineCode: null,
  nowIso: '2024-06-15T00:00:00.000Z',
};

describe('prepareGatewayCharge', () => {
  it('produces eligible charge on first attempt with no prior decline', () => {
    const { result } = prepareGatewayCharge(baseRequest);
    expect(result.eligible).toBe(true);
    expect(result.retryEligible).toBe(true);
    expect(result.declineCategory).toBeNull();
    expect(result.shouldDunning).toBe(false);
    expect(result.idempotencyKey).toBe('sub_sub-1_inv_inv-1_att_1');
  });

  it('generates correct gateway payload', () => {
    const { result } = prepareGatewayCharge(baseRequest);
    expect(result.gatewayPayload.amount).toBe(9900);
    expect(result.gatewayPayload.currency).toBe('USD');
    expect(result.gatewayPayload.paymentMethodId).toBe('pm-1');
    expect(result.gatewayPayload.metadata.subscription_id).toBe('sub-1');
  });

  it('classifies hard decline and blocks retry', () => {
    const { result } = prepareGatewayCharge({
      ...baseRequest,
      attemptNumber: 2,
      previousDeclineCode: 'do_not_honor',
    });
    expect(result.declineCategory).toBe('hard_decline');
    expect(result.eligible).toBe(false);
    expect(result.retryEligible).toBe(false);
  });

  it('classifies fraud and blocks retry', () => {
    const { result } = prepareGatewayCharge({
      ...baseRequest,
      attemptNumber: 2,
      previousDeclineCode: 'suspected_fraud',
    });
    expect(result.declineCategory).toBe('fraud');
    expect(result.eligible).toBe(false);
    expect(result.retryEligible).toBe(false);
  });

  it('classifies soft decline and allows retry', () => {
    const { result } = prepareGatewayCharge({
      ...baseRequest,
      attemptNumber: 2,
      previousDeclineCode: 'generic_decline',
    });
    expect(result.declineCategory).toBe('soft_decline');
    expect(result.retryEligible).toBe(true);
    expect(result.nextRetryDelayMs).toBeGreaterThan(0);
  });

  it('triggers dunning when max attempts exhausted', () => {
    const { result } = prepareGatewayCharge({
      ...baseRequest,
      attemptNumber: 4,
      maxAttempts: 4,
      previousDeclineCode: 'insufficient_funds',
    });
    expect(result.shouldDunning).toBe(true);
    expect(result.retryEligible).toBe(false);
  });

  it('classifies insufficient_funds correctly', () => {
    const { result } = prepareGatewayCharge({
      ...baseRequest,
      attemptNumber: 2,
      previousDeclineCode: 'insufficient_funds',
    });
    expect(result.declineCategory).toBe('insufficient_funds');
    expect(result.retryEligible).toBe(true);
  });

  it('throws for zero amount', () => {
    expect(() => prepareGatewayCharge({ ...baseRequest, amountMinor: 0 })).toThrow('positive');
  });

  it('throws for invalid attemptNumber', () => {
    expect(() => prepareGatewayCharge({ ...baseRequest, attemptNumber: 0 })).toThrow(
      'attemptNumber',
    );
  });
});
