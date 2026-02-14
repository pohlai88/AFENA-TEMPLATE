import { describe, it, expect } from 'vitest';
import { OpeningInvoiceCreationToolSchema, OpeningInvoiceCreationToolInsertSchema } from '../types/opening-invoice-creation-tool.js';

describe('OpeningInvoiceCreationTool Zod validation', () => {
  const validSample = {
      "id": "TEST-OpeningInvoiceCreationTool-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "create_missing_party": "0",
      "invoice_type": "Sales",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001"
  };

  it('validates a correct Opening Invoice Creation Tool object', () => {
    const result = OpeningInvoiceCreationToolSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OpeningInvoiceCreationToolInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = OpeningInvoiceCreationToolSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OpeningInvoiceCreationToolSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
