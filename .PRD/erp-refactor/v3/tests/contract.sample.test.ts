import { describe, it, expect } from 'vitest';
import { ContractSchema, ContractInsertSchema } from '../types/contract.js';

describe('Contract Zod validation', () => {
  const validSample = {
      "id": "TEST-Contract-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "party_type": "Customer",
      "is_signed": "0",
      "party_name": "LINK-party_name-001",
      "party_user": "LINK-party_user-001",
      "status": "Unsigned",
      "fulfilment_status": "N/A",
      "party_full_name": "Sample Party Full Name",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "signee": "Sample Signee",
      "signed_on": "2024-01-15T10:30:00.000Z",
      "ip_address": "Sample IP Address",
      "contract_template": "LINK-contract_template-001",
      "contract_terms": "Sample text for contract_terms",
      "requires_fulfilment": "0",
      "fulfilment_deadline": "2024-01-15",
      "signee_company": "/files/sample.png",
      "signed_by_company": "LINK-signed_by_company-001",
      "document_type": "Quotation",
      "document_name": "LINK-document_name-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Contract object', () => {
    const result = ContractSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ContractInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "party_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).party_type;
    const result = ContractSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ContractSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
