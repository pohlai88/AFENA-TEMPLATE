// Form scaffold for Budget
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Budget } from '../types/budget.js';

interface BudgetFormProps {
  initialData?: Partial<Budget>;
  onSubmit: (data: Partial<Budget>) => void;
  mode: 'create' | 'edit';
}

export function BudgetForm({ initialData = {}, onSubmit, mode }: BudgetFormProps) {
  const [formData, setFormData] = useState<Partial<Budget>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Budget' : 'New Budget'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Against</label>
            <select
              value={String(formData.budget_against ?? '')}
              onChange={e => handleChange('budget_against', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Cost Center">Cost Center</option>
              <option value="Project">Project</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.budget_against === 'Cost Center' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.cost_center ?? '')}
                onChange={e => {
                  handleChange('cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="cost_center"
              />
              {/* Link indicator */}
              {formData.cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('cost_center', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.budget_against === 'Project' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Project (→ Project)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={String(formData.project ?? '')}
                onChange={e => {
                  handleChange('project', e.target.value);
                  // TODO: Implement async search for Project
                  // fetch(`/api/resource/Project?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project"
                data-fieldname="project"
              />
              {/* Link indicator */}
              {formData.project && (
                <button
                  type="button"
                  onClick={() => handleChange('project', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.account ?? '')}
                onChange={e => {
                  handleChange('account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="account"
              />
              {/* Link indicator */}
              {formData.account && (
                <button
                  type="button"
                  onClick={() => handleChange('account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Budget)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Budget..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Budget
                  // fetch(`/api/resource/Budget?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Budget"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Fiscal Year (→ Fiscal Year)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Fiscal Year..."
                value={String(formData.from_fiscal_year ?? '')}
                onChange={e => {
                  handleChange('from_fiscal_year', e.target.value);
                  // TODO: Implement async search for Fiscal Year
                  // fetch(`/api/resource/Fiscal Year?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Fiscal Year"
                data-fieldname="from_fiscal_year"
              />
              {/* Link indicator */}
              {formData.from_fiscal_year && (
                <button
                  type="button"
                  onClick={() => handleChange('from_fiscal_year', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Fiscal Year (→ Fiscal Year)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Fiscal Year..."
                value={String(formData.to_fiscal_year ?? '')}
                onChange={e => {
                  handleChange('to_fiscal_year', e.target.value);
                  // TODO: Implement async search for Fiscal Year
                  // fetch(`/api/resource/Fiscal Year?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Fiscal Year"
                data-fieldname="to_fiscal_year"
              />
              {/* Link indicator */}
              {formData.to_fiscal_year && (
                <button
                  type="button"
                  onClick={() => handleChange('to_fiscal_year', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Start Date</label>
            <input
              type="date"
              value={String(formData.budget_start_date ?? '')}
              onChange={e => handleChange('budget_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget End Date</label>
            <input
              type="date"
              value={String(formData.budget_end_date ?? '')}
              onChange={e => handleChange('budget_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distribution Frequency</label>
            <select
              value={String(formData.distribution_frequency ?? '')}
              onChange={e => handleChange('distribution_frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Amount</label>
            <input
              type="number"
              step="any"
              value={formData.budget_amount != null ? Number(formData.budget_amount) : ''}
              onChange={e => handleChange('budget_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: section_break_nwug */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.distribute_equally}
              onChange={e => handleChange('distribute_equally', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Distribute Equally</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_fpdt */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: budget_distribution → Budget Distribution */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Budget Distribution</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.budget_distribution) ? (formData.budget_distribution as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.budget_distribution) ? formData.budget_distribution : [])];
                            rows.splice(idx, 1);
                            handleChange('budget_distribution', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('budget_distribution', [...(Array.isArray(formData.budget_distribution) ? formData.budget_distribution : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_wkqb */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Distribution Total</label>
            <input
              type="number"
              step="any"
              value={formData.budget_distribution_total != null ? Number(formData.budget_distribution_total) : ''}
              onChange={e => handleChange('budget_distribution_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Control Action */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Control Action</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.applicable_on_material_request}
              onChange={e => handleChange('applicable_on_material_request', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Applicable on Material Request</label>
          </div>
          {formData.applicable_on_material_request === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Annual Budget Exceeded on MR</label>
            <select
              value={String(formData.action_if_annual_budget_exceeded_on_mr ?? '')}
              onChange={e => handleChange('action_if_annual_budget_exceeded_on_mr', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
          {formData.applicable_on_material_request === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Accumulated Monthly Budget Exceeded on MR</label>
            <select
              value={String(formData.action_if_accumulated_monthly_budget_exceeded_on_mr ?? '')}
              onChange={e => handleChange('action_if_accumulated_monthly_budget_exceeded_on_mr', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.applicable_on_purchase_order}
              onChange={e => handleChange('applicable_on_purchase_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Applicable on Purchase Order</label>
          </div>
          {formData.applicable_on_purchase_order === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Annual Budget Exceeded on PO</label>
            <select
              value={String(formData.action_if_annual_budget_exceeded_on_po ?? '')}
              onChange={e => handleChange('action_if_annual_budget_exceeded_on_po', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
          {formData.applicable_on_purchase_order === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Accumulated Monthly Budget Exceeded on PO</label>
            <select
              value={String(formData.action_if_accumulated_monthly_budget_exceeded_on_po ?? '')}
              onChange={e => handleChange('action_if_accumulated_monthly_budget_exceeded_on_po', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_16 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.applicable_on_booking_actual_expenses}
              onChange={e => handleChange('applicable_on_booking_actual_expenses', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Applicable on booking actual expenses</label>
          </div>
          {formData.applicable_on_booking_actual_expenses === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Annual Budget Exceeded on Actual</label>
            <select
              value={String(formData.action_if_annual_budget_exceeded ?? '')}
              onChange={e => handleChange('action_if_annual_budget_exceeded', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
          {formData.applicable_on_booking_actual_expenses === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Accumulated Monthly Budget Exceeded on Actual</label>
            <select
              value={String(formData.action_if_accumulated_monthly_budget_exceeded ?? '')}
              onChange={e => handleChange('action_if_accumulated_monthly_budget_exceeded', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
        </div>
      </div>
      {/* Section: Control Action for Cumulative Expense */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Control Action for Cumulative Expense</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.applicable_on_cumulative_expense}
              onChange={e => handleChange('applicable_on_cumulative_expense', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Applicable on Cumulative Expense</label>
          </div>
          {formData.applicable_on_cumulative_expense === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Anual Budget Exceeded on Cumulative Expense</label>
            <select
              value={String(formData.action_if_annual_exceeded_on_cumulative_expense ?? '')}
              onChange={e => handleChange('action_if_annual_exceeded_on_cumulative_expense', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
          {formData.applicable_on_cumulative_expense === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Accumulative Monthly Budget Exceeded on Cumulative Expense</label>
            <select
              value={String(formData.action_if_accumulated_monthly_exceeded_on_cumulative_expense ?? '')}
              onChange={e => handleChange('action_if_accumulated_monthly_exceeded_on_cumulative_expense', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
              <option value="Ignore">Ignore</option>
            </select>
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_kkan */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Revision Of</label>
            <input
              type="text"
              value={String(formData.revision_of ?? '')}
              onChange={e => handleChange('revision_of', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}