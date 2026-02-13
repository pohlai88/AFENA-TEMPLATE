import { describe, it, expect } from 'vitest';
import { ProspectSchema, ProspectInsertSchema } from '../types/prospect.js';

describe('Prospect Zod validation', () => {
  const validSample = {
      "id": "TEST-Prospect-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company_name": "Sample Company Name",
      "customer_group": "LINK-customer_group-001",
      "no_of_employees": "1-10",
      "annual_revenue": 100,
      "market_segment": "LINK-market_segment-001",
      "industry": "LINK-industry-001",
      "territory": "LINK-territory-001",
      "prospect_owner": "LINK-prospect_owner-001",
      "website": "Sample Website",
      "fax": "+1-555-0100",
      "company": "LINK-company-001",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "open_activities_html": "Sample text for open_activities_html",
      "all_activities_html": "Sample text for all_activities_html",
      "notes_html": "Sample text for notes_html"
  };

  it('validates a correct Prospect object', () => {
    const result = ProspectSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProspectInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = ProspectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProspectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
