// Form scaffold for Subscription
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Subscription } from '../types/subscription.js';

interface SubscriptionFormProps {
  initialData?: Partial<Subscription>;
  onSubmit: (data: Partial<Subscription>) => void;
  mode: 'create' | 'edit';
}

export function SubscriptionForm({ initialData = {}, onSubmit, mode }: SubscriptionFormProps) {
  const [formData, setFormData] = useState<Partial<Subscription>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Subscription' : 'New Subscription'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.party_type ?? '')}
                onChange={e => {
                  handleChange('party_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="party_type"
              />
              {/* Link indicator */}
              {formData.party_type && (
                <button
                  type="button"
                  onClick={() => handleChange('party_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party</label>
            <input
              type="text"
              value={String(formData.party ?? '')}
              onChange={e => handleChange('party', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Trialing">Trialing</option>
              <option value="Active">Active</option>
              <option value="Grace Period">Grace Period</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
      {/* Section: Subscription Period */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Subscription Period</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription End Date</label>
            <input
              type="date"
              value={String(formData.end_date ?? '')}
              onChange={e => handleChange('end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cancelation Date</label>
            <input
              type="date"
              value={String(formData.cancelation_date ?? '')}
              onChange={e => handleChange('cancelation_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trial Period Start Date</label>
            <input
              type="date"
              value={String(formData.trial_period_start ?? '')}
              onChange={e => handleChange('trial_period_start', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.trial_period_start && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Trial Period End Date</label>
            <input
              type="date"
              value={String(formData.trial_period_end ?? '')}
              onChange={e => handleChange('trial_period_end', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.follow_calendar_months}
              onChange={e => handleChange('follow_calendar_months', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Follow Calendar Months</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.generate_new_invoices_past_due_date}
              onChange={e => handleChange('generate_new_invoices_past_due_date', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Generate New Invoices Past Due Date</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.submit_invoice}
              onChange={e => handleChange('submit_invoice', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Submit Generated Invoices</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Invoice Start Date</label>
            <input
              type="date"
              value={String(formData.current_invoice_start ?? '')}
              onChange={e => handleChange('current_invoice_start', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Invoice End Date</label>
            <input
              type="date"
              value={String(formData.current_invoice_end ?? '')}
              onChange={e => handleChange('current_invoice_end', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days Until Due</label>
            <input
              type="number"
              step="1"
              value={formData.days_until_due != null ? Number(formData.days_until_due) : ''}
              onChange={e => handleChange('days_until_due', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Generate Invoice At</label>
            <select
              value={String(formData.generate_invoice_at ?? '')}
              onChange={e => handleChange('generate_invoice_at', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="End of the current subscription period">End of the current subscription period</option>
              <option value="Beginning of the current subscription period">Beginning of the current subscription period</option>
              <option value="Days before the current subscription period">Days before the current subscription period</option>
            </select>
          </div>
          {formData.generate_invoice_at ==== "Days before the current subscription period" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Days</label>
            <input
              type="number"
              step="1"
              value={formData.number_of_days != null ? Number(formData.number_of_days) : ''}
              onChange={e => handleChange('number_of_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.cancel_at_period_end}
              onChange={e => handleChange('cancel_at_period_end', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Cancel At End Of Period</label>
          </div>
        </div>
      </div>
      {/* Section: Plans */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Plans</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: plans → Subscription Plan Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Plans</label>
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
                  {(Array.isArray(formData.plans) ? (formData.plans as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.plans) ? formData.plans : [])];
                            rows.splice(idx, 1);
                            handleChange('plans', rows);
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
                  onClick={() => handleChange('plans', [...(Array.isArray(formData.plans) ? formData.plans : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Taxes */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Taxes</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.party_type ==== 'Customer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Taxes and Charges Template (→ Sales Taxes and Charges Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Taxes and Charges Template..."
                value={String(formData.sales_tax_template ?? '')}
                onChange={e => {
                  handleChange('sales_tax_template', e.target.value);
                  // TODO: Implement async search for Sales Taxes and Charges Template
                  // fetch(`/api/resource/Sales Taxes and Charges Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Taxes and Charges Template"
                data-fieldname="sales_tax_template"
              />
              {/* Link indicator */}
              {formData.sales_tax_template && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_tax_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.party_type ==== 'Supplier' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Taxes and Charges Template (→ Purchase Taxes and Charges Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Taxes and Charges Template..."
                value={String(formData.purchase_tax_template ?? '')}
                onChange={e => {
                  handleChange('purchase_tax_template', e.target.value);
                  // TODO: Implement async search for Purchase Taxes and Charges Template
                  // fetch(`/api/resource/Purchase Taxes and Charges Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Taxes and Charges Template"
                data-fieldname="purchase_tax_template"
              />
              {/* Link indicator */}
              {formData.purchase_tax_template && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_tax_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: Discounts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Discounts</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply Additional Discount On</label>
            <select
              value={String(formData.apply_additional_discount ?? '')}
              onChange={e => handleChange('apply_additional_discount', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Grand Total">Grand Total</option>
              <option value="Net Total">Net Total</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Discount Percentage</label>
            <input
              type="number"
              step="any"
              value={formData.additional_discount_percentage != null ? Number(formData.additional_discount_percentage) : ''}
              onChange={e => handleChange('additional_discount_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Discount Amount</label>
            <input
              type="number"
              step="any"
              value={formData.additional_discount_amount != null ? Number(formData.additional_discount_amount) : ''}
              onChange={e => handleChange('additional_discount_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Accounting Dimensions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Dimensions</h4>
        <div className="grid grid-cols-2 gap-4">
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