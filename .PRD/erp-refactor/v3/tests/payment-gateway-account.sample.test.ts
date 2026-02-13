import { describe, it, expect } from 'vitest';
import { PaymentGatewayAccountSchema, PaymentGatewayAccountInsertSchema } from '../types/payment-gateway-account.js';

describe('PaymentGatewayAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentGatewayAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "payment_gateway": "LINK-payment_gateway-001",
      "payment_channel": "Email",
      "company": "LINK-company-001",
      "is_default": "0",
      "payment_account": "LINK-payment_account-001",
      "currency": "Read Only Value",
      "message": "Please click on the link below to make your payment",
      "message_examples": "Sample text for message_examples"
  };

  it('validates a correct Payment Gateway Account object', () => {
    const result = PaymentGatewayAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentGatewayAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "payment_gateway" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).payment_gateway;
    const result = PaymentGatewayAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentGatewayAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
