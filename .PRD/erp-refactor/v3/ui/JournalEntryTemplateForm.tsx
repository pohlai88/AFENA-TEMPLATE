// Form scaffold for Journal Entry Template
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { JournalEntryTemplate } from '../types/journal-entry-template.js';

interface JournalEntryTemplateFormProps {
  initialData?: Partial<JournalEntryTemplate>;
  onSubmit: (data: Partial<JournalEntryTemplate>) => void;
  mode: 'create' | 'edit';
}

export function JournalEntryTemplateForm({ initialData = {}, onSubmit, mode }: JournalEntryTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<JournalEntryTemplate>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.template_title ?? 'Journal Entry Template' : 'New Journal Entry Template'}
      </h2>
      {/* Section: section_break_1 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Template Title</label>
            <input
              type="text"
              value={String(formData.template_title ?? '')}
              onChange={e => handleChange('template_title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Journal Entry Type</label>
            <select
              value={String(formData.voucher_type ?? '')}
              onChange={e => handleChange('voucher_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Journal Entry">Journal Entry</option>
              <option value="Inter Company Journal Entry">Inter Company Journal Entry</option>
              <option value="Bank Entry">Bank Entry</option>
              <option value="Cash Entry">Cash Entry</option>
              <option value="Credit Card Entry">Credit Card Entry</option>
              <option value="Debit Note">Debit Note</option>
              <option value="Credit Note">Credit Note</option>
              <option value="Contra Entry">Contra Entry</option>
              <option value="Excise Entry">Excise Entry</option>
              <option value="Write Off Entry">Write Off Entry</option>
              <option value="Opening Entry">Opening Entry</option>
              <option value="Depreciation Entry">Depreciation Entry</option>
              <option value="Exchange Rate Revaluation">Exchange Rate Revaluation</option>
            </select>
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Is Opening</label>
            <select
              value={String(formData.is_opening ?? '')}
              onChange={e => handleChange('is_opening', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.multi_currency}
              onChange={e => handleChange('multi_currency', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Multi Currency</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_3 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: accounts → Journal Entry Template Account */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Accounting Entries</label>
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
                  {(Array.isArray(formData.accounts) ? (formData.accounts as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.accounts) ? formData.accounts : [])];
                            rows.splice(idx, 1);
                            handleChange('accounts', rows);
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
                  onClick={() => handleChange('accounts', [...(Array.isArray(formData.accounts) ? formData.accounts : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
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