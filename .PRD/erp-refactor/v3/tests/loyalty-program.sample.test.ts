import { describe, it, expect } from 'vitest';
import { LoyaltyProgramSchema, LoyaltyProgramInsertSchema } from '../types/loyalty-program.js';

describe('LoyaltyProgram Zod validation', () => {
  const validSample = {
      "id": "TEST-LoyaltyProgram-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "loyalty_program_name": "Sample Loyalty Program Name",
      "loyalty_program_type": "Single Tier Program",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "customer_group": "LINK-customer_group-001",
      "customer_territory": "LINK-customer_territory-001",
      "auto_opt_in": "0",
      "conversion_factor": 1,
      "expiry_duration": 1,
      "expense_account": "LINK-expense_account-001",
      "company": "LINK-company-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "loyalty_program_help": "Sample text for loyalty_program_help"
  };

  it('validates a correct Loyalty Program object', () => {
    const result = LoyaltyProgramSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LoyaltyProgramInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "loyalty_program_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).loyalty_program_name;
    const result = LoyaltyProgramSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LoyaltyProgramSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
