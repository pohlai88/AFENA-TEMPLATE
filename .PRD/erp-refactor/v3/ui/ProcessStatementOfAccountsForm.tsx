// Form scaffold for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProcessStatementOfAccounts } from '../types/process-statement-of-accounts.js';

interface ProcessStatementOfAccountsFormProps {
  initialData?: Partial<ProcessStatementOfAccounts>;
  onSubmit: (data: Partial<ProcessStatementOfAccounts>) => void;
  mode: 'create' | 'edit';
}

export function ProcessStatementOfAccountsForm({ initialData = {}, onSubmit, mode }: ProcessStatementOfAccountsFormProps) {
  const [formData, setFormData] = useState<Partial<ProcessStatementOfAccounts>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Process Statement Of Accounts' : 'New Process Statement Of Accounts'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Report</label>
            <select
              value={String(formData.report ?? '')}
              onChange={e => handleChange('report', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="General Ledger">General Ledger</option>
              <option value="Accounts Receivable">Accounts Receivable</option>
            </select>
          </div>
      {/* Section: Report Filters */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Report Filters</h4>
        <div className="grid grid-cols-2 gap-4">
          {(!formData.enable_auto_email && formData.report === 'General Ledger'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.from_date ?? '')}
              onChange={e => handleChange('from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.report === 'Accounts Receivable'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          {(formData.report === 'General Ledger'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Categorize By</label>
            <select
              value={String(formData.categorize_by ?? '')}
              onChange={e => handleChange('categorize_by', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Categorize by Voucher">Categorize by Voucher</option>
              <option value="Categorize by Voucher (Consolidated)">Categorize by Voucher (Consolidated)</option>
            </select>
          </div>
          )}
          {/* Child table: cost_center → PSOA Cost Center */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Cost Center</label>
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
                  {(Array.isArray(formData.cost_center) ? (formData.cost_center as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.cost_center) ? formData.cost_center : [])];
                            rows.splice(idx, 1);
                            handleChange('cost_center', rows);
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
                  onClick={() => handleChange('cost_center', [...(Array.isArray(formData.cost_center) ? formData.cost_center : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          {(formData.report === 'Accounts Receivable'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Territory (→ Territory)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Territory..."
                value={String(formData.territory ?? '')}
                onChange={e => {
                  handleChange('territory', e.target.value);
                  // TODO: Implement async search for Territory
                  // fetch(`/api/resource/Territory?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Territory"
                data-fieldname="territory"
              />
              {/* Link indicator */}
              {formData.territory && (
                <button
                  type="button"
                  onClick={() => handleChange('territory', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_exchange_rate_revaluation_journals}
              onChange={e => handleChange('ignore_exchange_rate_revaluation_journals', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Exchange Rate Revaluation and Gain / Loss Journals</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_cr_dr_notes}
              onChange={e => handleChange('ignore_cr_dr_notes', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore System Generated Credit / Debit Notes</label>
          </div>
          {(!formData.enable_auto_email && formData.report === 'General Ledger'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Finance Book (→ Finance Book)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Finance Book..."
                value={String(formData.finance_book ?? '')}
                onChange={e => {
                  handleChange('finance_book', e.target.value);
                  // TODO: Implement async search for Finance Book
                  // fetch(`/api/resource/Finance Book?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Finance Book"
                data-fieldname="finance_book"
              />
              {/* Link indicator */}
              {formData.finance_book && (
                <button
                  type="button"
                  onClick={() => handleChange('finance_book', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {(formData.report === 'General Ledger'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.currency ?? '')}
                onChange={e => {
                  handleChange('currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="currency"
              />
              {/* Link indicator */}
              {formData.currency && (
                <button
                  type="button"
                  onClick={() => handleChange('currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(formData.report === 'General Ledger'); && (
          {/* Child table: project → PSOA Project */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Project</label>
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
                  {(Array.isArray(formData.project) ? (formData.project as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.project) ? formData.project : [])];
                            rows.splice(idx, 1);
                            handleChange('project', rows);
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
                  onClick={() => handleChange('project', [...(Array.isArray(formData.project) ? formData.project : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          {(formData.report === 'Accounts Receivable'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Terms Template (→ Payment Terms Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Terms Template..."
                value={String(formData.payment_terms_template ?? '')}
                onChange={e => {
                  handleChange('payment_terms_template', e.target.value);
                  // TODO: Implement async search for Payment Terms Template
                  // fetch(`/api/resource/Payment Terms Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Terms Template"
                data-fieldname="payment_terms_template"
              />
              {/* Link indicator */}
              {formData.payment_terms_template && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_terms_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(formData.report === 'Accounts Receivable'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner (→ Sales Partner)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Partner..."
                value={String(formData.sales_partner ?? '')}
                onChange={e => {
                  handleChange('sales_partner', e.target.value);
                  // TODO: Implement async search for Sales Partner
                  // fetch(`/api/resource/Sales Partner?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Partner"
                data-fieldname="sales_partner"
              />
              {/* Link indicator */}
              {formData.sales_partner && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_partner', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(formData.report === 'Accounts Receivable'); && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Person (→ Sales Person)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Person..."
                value={String(formData.sales_person ?? '')}
                onChange={e => {
                  handleChange('sales_person', e.target.value);
                  // TODO: Implement async search for Sales Person
                  // fetch(`/api/resource/Sales Person?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Person"
                data-fieldname="sales_person"
              />
              {/* Link indicator */}
              {formData.sales_person && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_remarks}
              onChange={e => handleChange('show_remarks', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Remarks</label>
          </div>
          {(formData.report === 'Accounts Receivable'); && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.based_on_payment_terms}
              onChange={e => handleChange('based_on_payment_terms', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Based On Payment Terms</label>
          </div>
          )}
          {(formData.report === 'Accounts Receivable'); && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_future_payments}
              onChange={e => handleChange('show_future_payments', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Future Payments</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: Customers */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Customers</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Customers By</label>
            <select
              value={String(formData.customer_collection ?? '')}
              onChange={e => handleChange('customer_collection', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Customer Group">Customer Group</option>
              <option value="Territory">Territory</option>
              <option value="Sales Partner">Sales Partner</option>
              <option value="Sales Person">Sales Person</option>
            </select>
          </div>
          {formData.customer_collection !==== '' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient</label>
            <input
              type="text"
              value={String(formData.collection_name ?? '')}
              onChange={e => handleChange('collection_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.primary_mandatory}
              onChange={e => handleChange('primary_mandatory', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Send To Primary Contact</label>
          </div>
          {(formData.report === 'General Ledger'); && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_net_values_in_party_account}
              onChange={e => handleChange('show_net_values_in_party_account', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Net Values in Party Account</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: column_break_17 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: customers → Process Statement Of Accounts Customer */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customers</label>
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
                  {(Array.isArray(formData.customers) ? (formData.customers as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.customers) ? formData.customers : [])];
                            rows.splice(idx, 1);
                            handleChange('customers', rows);
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
                  onClick={() => handleChange('customers', [...(Array.isArray(formData.customers) ? formData.customers : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Print Preferences */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Print Preferences</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Print Format (→ Print Format)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Print Format..."
                value={String(formData.print_format ?? '')}
                onChange={e => {
                  handleChange('print_format', e.target.value);
                  // TODO: Implement async search for Print Format
                  // fetch(`/api/resource/Print Format?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Print Format"
                data-fieldname="print_format"
              />
              {/* Link indicator */}
              {formData.print_format && (
                <button
                  type="button"
                  onClick={() => handleChange('print_format', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Orientation</label>
            <select
              value={String(formData.orientation ?? '')}
              onChange={e => handleChange('orientation', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Landscape">Landscape</option>
              <option value="Portrait">Portrait</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_break}
              onChange={e => handleChange('include_break', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Page Break After Each SoA</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_ageing}
              onChange={e => handleChange('include_ageing', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Ageing Summary</label>
          </div>
          {formData.include_ageing ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Ageing Based On</label>
            <select
              value={String(formData.ageing_based_on ?? '')}
              onChange={e => handleChange('ageing_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Due Date">Due Date</option>
              <option value="Posting Date">Posting Date</option>
            </select>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Letter Head (→ Letter Head)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Letter Head..."
                value={String(formData.letter_head ?? '')}
                onChange={e => {
                  handleChange('letter_head', e.target.value);
                  // TODO: Implement async search for Letter Head
                  // fetch(`/api/resource/Letter Head?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Letter Head"
                data-fieldname="letter_head"
              />
              {/* Link indicator */}
              {formData.letter_head && (
                <button
                  type="button"
                  onClick={() => handleChange('letter_head', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Terms and Conditions (→ Terms and Conditions)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Terms and Conditions..."
                value={String(formData.terms_and_conditions ?? '')}
                onChange={e => {
                  handleChange('terms_and_conditions', e.target.value);
                  // TODO: Implement async search for Terms and Conditions
                  // fetch(`/api/resource/Terms and Conditions?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Terms and Conditions"
                data-fieldname="terms_and_conditions"
              />
              {/* Link indicator */}
              {formData.terms_and_conditions && (
                <button
                  type="button"
                  onClick={() => handleChange('terms_and_conditions', '')}
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
      {/* Section: Email Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Email Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_auto_email}
              onChange={e => handleChange('enable_auto_email', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Auto Email</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sender (→ Email Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Email Account..."
                value={String(formData.sender ?? '')}
                onChange={e => {
                  handleChange('sender', e.target.value);
                  // TODO: Implement async search for Email Account
                  // fetch(`/api/resource/Email Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Email Account"
                data-fieldname="sender"
              />
              {/* Link indicator */}
              {formData.sender && (
                <button
                  type="button"
                  onClick={() => handleChange('sender', '')}
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
      {/* Section: section_break_18 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={String(formData.frequency ?? '')}
              onChange={e => handleChange('frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Biweekly">Biweekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter Duration (Months)</label>
            <input
              type="number"
              step="1"
              value={formData.filter_duration != null ? Number(formData.filter_duration) : ''}
              onChange={e => handleChange('filter_duration', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_33 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PDF Name</label>
            <input
              type="text"
              value={String(formData.pdf_name ?? '')}
              onChange={e => handleChange('pdf_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: cc_to → Process Statement Of Accounts CC */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">CC To</label>
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
                  {(Array.isArray(formData.cc_to) ? (formData.cc_to as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.cc_to) ? formData.cc_to : [])];
                            rows.splice(idx, 1);
                            handleChange('cc_to', rows);
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
                  onClick={() => handleChange('cc_to', [...(Array.isArray(formData.cc_to) ? formData.cc_to : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_30 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              value={String(formData.body ?? '')}
              onChange={e => handleChange('body', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Help Text</label>
            <textarea
              value={String(formData.help_text ?? '')}
              onChange={e => handleChange('help_text', e.target.value)}
              rows={4}
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