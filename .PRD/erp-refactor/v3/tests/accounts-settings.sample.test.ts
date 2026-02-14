import { describe, it, expect } from 'vitest';
import { AccountsSettingsSchema, AccountsSettingsInsertSchema } from '../types/accounts-settings.js';

describe('AccountsSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountsSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "unlink_payment_on_cancellation_of_invoice": "1",
      "unlink_advance_payment_on_cancelation_of_order": "1",
      "delete_linked_ledger_entries": "0",
      "enable_immutable_ledger": "0",
      "check_supplier_invoice_uniqueness": "0",
      "automatically_fetch_payment_terms": "0",
      "enable_common_party_accounting": "0",
      "allow_multi_currency_invoices_against_single_party_account": "0",
      "confirm_before_resetting_posting_date": "1",
      "enable_accounting_dimensions": "0",
      "enable_discounts_and_margin": "0",
      "merge_similar_account_heads": "0",
      "book_deferred_entries_based_on": "Days",
      "automatically_process_deferred_accounting_entry": "1",
      "book_deferred_entries_via_journal_entry": "0",
      "submit_journal_entries": "0",
      "determine_address_tax_category_from": "Billing Address",
      "add_taxes_from_item_tax_template": "1",
      "add_taxes_from_taxes_and_charges_template": "0",
      "book_tax_discount_loss": "0",
      "round_row_wise_tax": "0",
      "show_inclusive_tax_in_print": "0",
      "show_taxes_as_table_in_print": "0",
      "show_payment_schedule_in_print": "0",
      "maintain_same_internal_transaction_rate": "0",
      "fetch_valuation_rate_for_internal_transaction": "0",
      "maintain_same_rate_action": "Stop",
      "role_to_override_stop_action": "LINK-role_to_override_stop_action-001",
      "allow_stale": "1",
      "allow_pegged_currencies_exchange_rates": "0",
      "stale_days": "1",
      "auto_reconcile_payments": "0",
      "auto_reconciliation_job_trigger": "15",
      "reconciliation_queue_size": "5",
      "exchange_gain_loss_posting_date": "Payment",
      "enable_loyalty_point_program": "0",
      "over_billing_allowance": 100,
      "role_allowed_to_over_bill": "LINK-role_allowed_to_over_bill-001",
      "credit_controller": "LINK-credit_controller-001",
      "make_payment_via_journal_entry": "0",
      "calculate_depr_using_total_days": "0",
      "book_asset_depreciation_entry_automatically": "1",
      "role_to_notify_on_depreciation_failure": "LINK-role_to_notify_on_depreciation_failure-001",
      "ignore_account_closing_balance": "0",
      "use_legacy_controller_for_pcv": "1",
      "general_ledger_remarks_length": "0",
      "receivable_payable_remarks_length": "0",
      "receivable_payable_fetch_method": "Buffered Cursor",
      "default_ageing_range": "30, 60, 90, 120",
      "ignore_is_opening_check_for_reporting": "0",
      "show_balance_in_coa": "1",
      "enable_party_matching": "0",
      "enable_fuzzy_matching": "0",
      "create_pr_in_draft_status": "1",
      "use_legacy_budget_controller": "0"
  };

  it('validates a correct Accounts Settings object', () => {
    const result = AccountsSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountsSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountsSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
