import { describe, it, expect } from 'vitest';
import { BankStatementImportSchema, BankStatementImportInsertSchema } from '../types/bank-statement-import.js';

describe('BankStatementImport Zod validation', () => {
  const validSample = {
      "id": "TEST-BankStatementImport-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "bank_account": "LINK-bank_account-001",
      "bank": "LINK-bank-001",
      "import_mt940_fromat": "0",
      "custom_delimiters": "0",
      "delimiter_options": ",;\\t|",
      "google_sheets_url": "Sample Import from Google Sheets",
      "html_5": "Sample text for html_5",
      "import_file": "/files/sample.png",
      "status": "Pending",
      "template_options": "console.log(\"hello\");",
      "use_csv_sniffer": "0",
      "template_warnings": "console.log(\"hello\");",
      "import_warnings": "Sample text for import_warnings",
      "import_preview": "Sample text for import_preview",
      "show_failed_logs": "0",
      "import_log_preview": "Sample text for import_log_preview",
      "reference_doctype": "Bank Transaction",
      "import_type": "Insert New Records",
      "submit_after_import": "1",
      "mute_emails": "1"
  };

  it('validates a correct Bank Statement Import object', () => {
    const result = BankStatementImportSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankStatementImportInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = BankStatementImportSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankStatementImportSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
