import { describe, it, expect } from 'vitest';
import { ShareBalanceSchema, ShareBalanceInsertSchema } from '../types/share-balance.js';

describe('ShareBalance Zod validation', () => {
  const validSample = {
      "id": "TEST-ShareBalance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "share_type": "LINK-share_type-001",
      "from_no": 1,
      "rate": 100,
      "no_of_shares": 1,
      "to_no": 1,
      "amount": 100,
      "is_company": "0",
      "current_state": "Issued"
  };

  it('validates a correct Share Balance object', () => {
    const result = ShareBalanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShareBalanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "share_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).share_type;
    const result = ShareBalanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShareBalanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
