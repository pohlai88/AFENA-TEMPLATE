// Form scaffold for Financial Report Template
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { FinancialReportTemplate } from '../types/financial-report-template.js';

interface FinancialReportTemplateFormProps {
  initialData?: Partial<FinancialReportTemplate>;
  onSubmit: (data: Partial<FinancialReportTemplate>) => void;
  mode: 'create' | 'edit';
}

export function FinancialReportTemplateForm({ initialData = {}, onSubmit, mode }: FinancialReportTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<FinancialReportTemplate>>(initialData);

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
        {mode === 'edit' ? formData.template_name ?? 'Financial Report Template' : 'New Financial Report Template'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Template Name</label>
            <input
              type="text"
              value={String(formData.template_name ?? '')}
              onChange={e => handleChange('template_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={String(formData.report_type ?? '')}
              onChange={e => handleChange('report_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Profit and Loss Statement">Profit and Loss Statement</option>
              <option value="Balance Sheet">Balance Sheet</option>
              <option value="Cash Flow">Cash Flow</option>
              <option value="Custom Financial Statement">Custom Financial Statement</option>
            </select>
          </div>
          {frappe.boot.developer_mode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Module (for Export) (→ Module Def)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Module Def..."
                value={String(formData.module ?? '')}
                onChange={e => {
                  handleChange('module', e.target.value);
                  // TODO: Implement async search for Module Def
                  // fetch(`/api/resource/Module Def?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Module Def"
                data-fieldname="module"
              />
              {/* Link indicator */}
              {formData.module && (
                <button
                  type="button"
                  onClick={() => handleChange('module', '')}
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
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
      {/* Section: section_break_fvlw */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: rows → Financial Report Row */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Report Line Items</label>
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
                  {(Array.isArray(formData.rows) ? (formData.rows as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.rows) ? formData.rows : [])];
                            rows.splice(idx, 1);
                            handleChange('rows', rows);
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
                  onClick={() => handleChange('rows', [...(Array.isArray(formData.rows) ? formData.rows : []), {}])}
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