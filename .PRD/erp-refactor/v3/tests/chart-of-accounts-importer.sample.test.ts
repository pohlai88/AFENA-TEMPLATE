import { describe, it, expect } from 'vitest';
import { ChartOfAccountsImporterSchema, ChartOfAccountsImporterInsertSchema } from '../types/chart-of-accounts-importer.js';

describe('ChartOfAccountsImporter Zod validation', () => {
  const validSample = {
      "id": "TEST-ChartOfAccountsImporter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "import_file": "/files/sample.png",
      "chart_tree": "Sample text for chart_tree"
  };

  it('validates a correct Chart of Accounts Importer object', () => {
    const result = ChartOfAccountsImporterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ChartOfAccountsImporterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ChartOfAccountsImporterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
