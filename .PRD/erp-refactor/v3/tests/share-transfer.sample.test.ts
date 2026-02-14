import { describe, it, expect } from 'vitest';
import { ShareTransferSchema, ShareTransferInsertSchema } from '../types/share-transfer.js';

describe('ShareTransfer Zod validation', () => {
  const validSample = {
      "id": "TEST-ShareTransfer-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "transfer_type": "Issue",
      "date": "2024-01-15",
      "from_shareholder": "LINK-from_shareholder-001",
      "from_folio_no": "Sample From Folio No",
      "to_shareholder": "LINK-to_shareholder-001",
      "to_folio_no": "Sample To Folio No",
      "equity_or_liability_account": "LINK-equity_or_liability_account-001",
      "asset_account": "LINK-asset_account-001",
      "share_type": "LINK-share_type-001",
      "from_no": 1,
      "rate": 100,
      "no_of_shares": 1,
      "to_no": 1,
      "amount": 100,
      "company": "LINK-company-001",
      "remarks": "Sample text for remarks",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Share Transfer object', () => {
    const result = ShareTransferSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShareTransferInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "transfer_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).transfer_type;
    const result = ShareTransferSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShareTransferSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
