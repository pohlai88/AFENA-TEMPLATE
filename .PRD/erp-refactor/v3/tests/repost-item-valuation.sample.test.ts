import { describe, it, expect } from 'vitest';
import { RepostItemValuationSchema, RepostItemValuationInsertSchema } from '../types/repost-item-valuation.js';

describe('RepostItemValuation Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostItemValuation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "based_on": "Transaction",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "posting_date": "2024-01-15",
      "posting_time": "10:30:00",
      "status": "Queued",
      "company": "LINK-company-001",
      "reposting_reference": "Sample Reposting Reference",
      "repost_only_accounting_ledgers": "0",
      "allow_negative_stock": "1",
      "via_landed_cost_voucher": "0",
      "allow_zero_rate": "0",
      "recreate_stock_ledgers": "0",
      "amended_from": "LINK-amended_from-001",
      "error_log": "Sample text for error_log",
      "reposting_data_file": "/files/sample.png",
      "items_to_be_repost": "console.log(\"hello\");",
      "distinct_item_and_warehouse": "console.log(\"hello\");",
      "total_reposting_count": 1,
      "current_index": 1,
      "gl_reposting_index": "0",
      "affected_transactions": "console.log(\"hello\");"
  };

  it('validates a correct Repost Item Valuation object', () => {
    const result = RepostItemValuationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostItemValuationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "based_on" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).based_on;
    const result = RepostItemValuationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostItemValuationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
