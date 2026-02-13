import { describe, it, expect } from 'vitest';
import { SalesPartnerSchema, SalesPartnerInsertSchema } from '../types/sales-partner.js';

describe('SalesPartner Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesPartner-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "partner_name": "Sample Sales Partner Name",
      "partner_type": "LINK-partner_type-001",
      "territory": "LINK-territory-001",
      "commission_rate": 1,
      "address_desc": "Sample text for address_desc",
      "address_html": "Sample text for address_html",
      "contact_desc": "Sample text for contact_desc",
      "contact_html": "Sample text for contact_html",
      "show_in_website": "0",
      "referral_code": "Sample Referral Code",
      "route": "Sample Route",
      "logo": "/files/sample.png",
      "partner_website": "Sample Partner website",
      "introduction": "Sample text for introduction",
      "description": "Sample text for description"
  };

  it('validates a correct Sales Partner object', () => {
    const result = SalesPartnerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesPartnerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "partner_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).partner_name;
    const result = SalesPartnerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesPartnerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
