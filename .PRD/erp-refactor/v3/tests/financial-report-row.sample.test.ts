import { describe, it, expect } from 'vitest';
import { FinancialReportRowSchema, FinancialReportRowInsertSchema } from '../types/financial-report-row.js';

describe('FinancialReportRow Zod validation', () => {
  const validSample = {
      "id": "TEST-FinancialReportRow-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "reference_code": "Sample Line Reference",
      "display_name": "Sample Display Name",
      "indentation_level": 1,
      "data_source": "Account Data",
      "balance_type": "Opening Balance",
      "fieldtype": "Currency",
      "color": "#3498db",
      "bold_text": "0",
      "italic_text": "0",
      "hidden_calculation": "0",
      "hide_when_empty": "0",
      "reverse_sign": "0",
      "include_in_charts": "0",
      "advanced_filtering": "0",
      "filters_editor": "Sample text for filters_editor",
      "calculation_formula": "console.log(\"hello\");",
      "formula_description": "Sample text for formula_description"
  };

  it('validates a correct Financial Report Row object', () => {
    const result = FinancialReportRowSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = FinancialReportRowInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = FinancialReportRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
