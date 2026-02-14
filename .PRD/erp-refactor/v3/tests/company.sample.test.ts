import { describe, it, expect } from 'vitest';
import { CompanySchema, CompanyInsertSchema } from '../types/company.js';

describe('Company Zod validation', () => {
  const validSample = {
      "id": "TEST-Company-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company_name": "Sample Company",
      "abbr": "Sample Abbr",
      "default_currency": "LINK-default_currency-001",
      "country": "LINK-country-001",
      "is_group": "0",
      "default_holiday_list": "LINK-default_holiday_list-001",
      "default_letter_head": "LINK-default_letter_head-001",
      "tax_id": "Sample Tax ID",
      "domain": "Sample Domain",
      "date_of_establishment": "2024-01-15",
      "parent_company": "LINK-parent_company-001",
      "reporting_currency": "LINK-reporting_currency-001",
      "company_logo": "/files/sample.png",
      "date_of_incorporation": "2024-01-15",
      "phone_no": "+1-555-0100",
      "email": "test@example.com",
      "company_description": "Sample text for company_description",
      "date_of_commencement": "2024-01-15",
      "fax": "+1-555-0100",
      "website": "Sample Website",
      "address_html": "Sample text for address_html",
      "registration_details": "console.log(\"hello\");",
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample old_parent",
      "create_chart_of_accounts_based_on": "Standard Template",
      "existing_company": "LINK-existing_company-001",
      "chart_of_accounts": "Option1",
      "default_bank_account": "LINK-default_bank_account-001",
      "default_cash_account": "LINK-default_cash_account-001",
      "default_receivable_account": "LINK-default_receivable_account-001",
      "default_payable_account": "LINK-default_payable_account-001",
      "write_off_account": "LINK-write_off_account-001",
      "unrealized_profit_loss_account": "LINK-unrealized_profit_loss_account-001",
      "allow_account_creation_against_child_company": "0",
      "default_expense_account": "LINK-default_expense_account-001",
      "default_income_account": "LINK-default_income_account-001",
      "default_discount_account": "LINK-default_discount_account-001",
      "payment_terms": "LINK-payment_terms-001",
      "cost_center": "LINK-cost_center-001",
      "default_finance_book": "LINK-default_finance_book-001",
      "exchange_gain_loss_account": "LINK-exchange_gain_loss_account-001",
      "unrealized_exchange_gain_loss_account": "LINK-unrealized_exchange_gain_loss_account-001",
      "round_off_account": "LINK-round_off_account-001",
      "round_off_cost_center": "LINK-round_off_cost_center-001",
      "round_off_for_opening": "LINK-round_off_for_opening-001",
      "default_deferred_revenue_account": "LINK-default_deferred_revenue_account-001",
      "default_deferred_expense_account": "LINK-default_deferred_expense_account-001",
      "book_advance_payments_in_separate_party_account": "0",
      "reconcile_on_advance_payment_date": "0",
      "reconciliation_takes_effect_on": "Oldest Of Invoice Or Advance",
      "default_advance_received_account": "LINK-default_advance_received_account-001",
      "default_advance_paid_account": "LINK-default_advance_paid_account-001",
      "auto_exchange_rate_revaluation": "0",
      "auto_err_frequency": "Daily",
      "submit_err_jv": "0",
      "exception_budget_approver_role": "LINK-exception_budget_approver_role-001",
      "accumulated_depreciation_account": "LINK-accumulated_depreciation_account-001",
      "depreciation_expense_account": "LINK-depreciation_expense_account-001",
      "series_for_depreciation_entry": "Sample Series for Asset Depreciation Entry (Journal Entry)",
      "disposal_account": "LINK-disposal_account-001",
      "depreciation_cost_center": "LINK-depreciation_cost_center-001",
      "capital_work_in_progress_account": "LINK-capital_work_in_progress_account-001",
      "asset_received_but_not_billed": "LINK-asset_received_but_not_billed-001",
      "accounts_frozen_till_date": "2024-01-15",
      "role_allowed_for_frozen_entries": "LINK-role_allowed_for_frozen_entries-001",
      "default_buying_terms": "LINK-default_buying_terms-001",
      "sales_monthly_history": "Sample text for sales_monthly_history",
      "monthly_sales_target": 100,
      "total_monthly_sales": 100,
      "default_selling_terms": "LINK-default_selling_terms-001",
      "default_sales_contact": "LINK-default_sales_contact-001",
      "default_warehouse_for_sales_return": "LINK-default_warehouse_for_sales_return-001",
      "credit_limit": 100,
      "transactions_annual_history": "console.log(\"hello\");",
      "purchase_expense_account": "LINK-purchase_expense_account-001",
      "service_expense_account": "LINK-service_expense_account-001",
      "purchase_expense_contra_account": "LINK-purchase_expense_contra_account-001",
      "enable_perpetual_inventory": "1",
      "enable_item_wise_inventory_account": "0",
      "enable_provisional_accounting_for_non_stock_items": "0",
      "default_inventory_account": "LINK-default_inventory_account-001",
      "valuation_method": "FIFO",
      "stock_adjustment_account": "LINK-stock_adjustment_account-001",
      "stock_received_but_not_billed": "LINK-stock_received_but_not_billed-001",
      "default_provisional_account": "LINK-default_provisional_account-001",
      "default_in_transit_warehouse": "LINK-default_in_transit_warehouse-001",
      "default_operating_cost_account": "LINK-default_operating_cost_account-001",
      "default_wip_warehouse": "LINK-default_wip_warehouse-001",
      "default_fg_warehouse": "LINK-default_fg_warehouse-001",
      "default_scrap_warehouse": "LINK-default_scrap_warehouse-001"
  };

  it('validates a correct Company object', () => {
    const result = CompanySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CompanyInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company_name;
    const result = CompanySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CompanySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
