import { describe, it, expect } from 'vitest';
import { ChequePrintTemplateSchema, ChequePrintTemplateInsertSchema } from '../types/cheque-print-template.js';

describe('ChequePrintTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-ChequePrintTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "settings": "Sample text for settings",
      "has_print_format": "0",
      "bank_name": "Sample Bank Name",
      "cheque_size": "Regular",
      "starting_position_from_top_edge": 1,
      "cheque_width": "20.00",
      "cheque_height": "9.00",
      "scanned_cheque": "/files/sample.png",
      "is_account_payable": "1",
      "acc_pay_dist_from_top_edge": "1.00",
      "acc_pay_dist_from_left_edge": "9.00",
      "message_to_show": "Acc. Payee",
      "date_settings": "Sample text for date_settings",
      "date_dist_from_top_edge": "1.00",
      "date_dist_from_left_edge": "15.00",
      "payer_name_from_top_edge": "2.00",
      "payer_name_from_left_edge": "3.00",
      "html_19": "Sample text for html_19",
      "amt_in_words_from_top_edge": "3.00",
      "amt_in_words_from_left_edge": "4.00",
      "amt_in_word_width": "15.00",
      "amt_in_words_line_spacing": "0.50",
      "amt_in_figures_from_top_edge": "3.50",
      "amt_in_figures_from_left_edge": "16.00",
      "account_no_settings": "Sample text for account_no_settings",
      "acc_no_dist_from_top_edge": "5.00",
      "acc_no_dist_from_left_edge": "4.00",
      "signatory_from_top_edge": "6.00",
      "signatory_from_left_edge": "15.00",
      "cheque_print_preview": "Sample text for cheque_print_preview"
  };

  it('validates a correct Cheque Print Template object', () => {
    const result = ChequePrintTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ChequePrintTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "bank_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).bank_name;
    const result = ChequePrintTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ChequePrintTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
