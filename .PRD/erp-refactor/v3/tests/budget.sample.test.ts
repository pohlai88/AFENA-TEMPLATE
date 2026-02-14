import { describe, it, expect } from 'vitest';
import { BudgetSchema, BudgetInsertSchema } from '../types/budget.js';

describe('Budget Zod validation', () => {
  const validSample = {
      "id": "TEST-Budget-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "BUDGET-.########",
      "budget_against": "Cost Center",
      "company": "LINK-company-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "account": "LINK-account-001",
      "amended_from": "LINK-amended_from-001",
      "from_fiscal_year": "LINK-from_fiscal_year-001",
      "to_fiscal_year": "LINK-to_fiscal_year-001",
      "budget_start_date": "2024-01-15",
      "budget_end_date": "2024-01-15",
      "distribution_frequency": "Monthly",
      "budget_amount": 100,
      "distribute_equally": "1",
      "budget_distribution_total": 100,
      "applicable_on_material_request": "0",
      "action_if_annual_budget_exceeded_on_mr": "Stop",
      "action_if_accumulated_monthly_budget_exceeded_on_mr": "Warn",
      "applicable_on_purchase_order": "0",
      "action_if_annual_budget_exceeded_on_po": "Stop",
      "action_if_accumulated_monthly_budget_exceeded_on_po": "Warn",
      "applicable_on_booking_actual_expenses": "0",
      "action_if_annual_budget_exceeded": "Stop",
      "action_if_accumulated_monthly_budget_exceeded": "Warn",
      "applicable_on_cumulative_expense": "0",
      "action_if_annual_exceeded_on_cumulative_expense": "Stop",
      "action_if_accumulated_monthly_exceeded_on_cumulative_expense": "Stop",
      "revision_of": "Sample Revision Of"
  };

  it('validates a correct Budget object', () => {
    const result = BudgetSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BudgetInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = BudgetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BudgetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
