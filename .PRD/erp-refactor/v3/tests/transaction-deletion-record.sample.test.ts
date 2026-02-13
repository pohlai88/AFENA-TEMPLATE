import { describe, it, expect } from 'vitest';
import { TransactionDeletionRecordSchema, TransactionDeletionRecordInsertSchema } from '../types/transaction-deletion-record.js';

describe('TransactionDeletionRecord Zod validation', () => {
  const validSample = {
      "id": "TEST-TransactionDeletionRecord-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "status": "Queued",
      "error_log": "Sample text for error_log",
      "delete_bin_data_status": "Pending",
      "delete_leads_and_addresses_status": "Pending",
      "reset_company_default_values_status": "Pending",
      "clear_notifications_status": "Pending",
      "initialize_doctypes_table_status": "Pending",
      "delete_transactions_status": "Pending",
      "amended_from": "LINK-amended_from-001",
      "process_in_single_transaction": "0"
  };

  it('validates a correct Transaction Deletion Record object', () => {
    const result = TransactionDeletionRecordSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TransactionDeletionRecordInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = TransactionDeletionRecordSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TransactionDeletionRecordSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
