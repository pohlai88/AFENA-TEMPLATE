import { describe, it, expect } from 'vitest';
import { CustomsTariffNumberSchema, CustomsTariffNumberInsertSchema } from '../types/customs-tariff-number.js';

describe('CustomsTariffNumber Zod validation', () => {
  const validSample = {
      "id": "TEST-CustomsTariffNumber-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "tariff_number": "Sample Tariff Number",
      "description": "Sample Description"
  };

  it('validates a correct Customs Tariff Number object', () => {
    const result = CustomsTariffNumberSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomsTariffNumberInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "tariff_number" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).tariff_number;
    const result = CustomsTariffNumberSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomsTariffNumberSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
