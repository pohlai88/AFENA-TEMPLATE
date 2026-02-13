import { describe, it, expect } from 'vitest';
import { WarrantyClaimSchema, WarrantyClaimInsertSchema } from '../types/warranty-claim.js';

describe('WarrantyClaim Zod validation', () => {
  const validSample = {
      "id": "TEST-WarrantyClaim-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "status": "Open",
      "complaint_date": "Today",
      "customer": "LINK-customer-001",
      "serial_no": "LINK-serial_no-001",
      "complaint": "Sample text for complaint",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "warranty_amc_status": "Under Warranty",
      "warranty_expiry_date": "2024-01-15",
      "amc_expiry_date": "2024-01-15",
      "resolution_date": "2024-01-15T10:30:00.000Z",
      "resolved_by": "LINK-resolved_by-001",
      "resolution_details": "Sample text for resolution_details",
      "customer_name": "Sample Customer Name",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "+1-555-0100",
      "contact_email": "test@example.com",
      "territory": "LINK-territory-001",
      "customer_group": "LINK-customer_group-001",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "service_address": "Sample text for service_address",
      "company": "LINK-company-001",
      "complaint_raised_by": "Sample Raised By",
      "from_company": "Sample From Company",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Warranty Claim object', () => {
    const result = WarrantyClaimSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WarrantyClaimInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = WarrantyClaimSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WarrantyClaimSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
