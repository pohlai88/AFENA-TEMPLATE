// Form scaffold for Tax Withholding Entry
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TaxWithholdingEntry } from '../types/tax-withholding-entry.js';

interface TaxWithholdingEntryFormProps {
  initialData?: Partial<TaxWithholdingEntry>;
  onSubmit: (data: Partial<TaxWithholdingEntry>) => void;
  mode: 'create' | 'edit';
}

export function TaxWithholdingEntryForm({ initialData = {}, onSubmit, mode }: TaxWithholdingEntryFormProps) {
  const [formData, setFormData] = useState<Partial<TaxWithholdingEntry>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Tax Withholding Entry' : 'New Tax Withholding Entry'}</h2>
      {/* Section: section_break_krko */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax ID</label>
            <input
              type="text"
              value={String(formData.tax_id ?? '')}
              onChange={e => handleChange('tax_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Category (→ Tax Withholding Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Category..."
                value={String(formData.tax_withholding_category ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_category', e.target.value);
                  // TODO: Implement async search for Tax Withholding Category
                  // fetch(`/api/resource/Tax Withholding Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Category"
                data-fieldname="tax_withholding_category"
              />
              {/* Link indicator */}
              {formData.tax_withholding_category && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Group (→ Tax Withholding Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Group..."
                value={String(formData.tax_withholding_group ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_group', e.target.value);
                  // TODO: Implement async search for Tax Withholding Group
                  // fetch(`/api/resource/Tax Withholding Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Group"
                data-fieldname="tax_withholding_group"
              />
              {/* Link indicator */}
              {formData.tax_withholding_group && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Taxable Amount</label>
            <input
              type="number"
              step="any"
              value={formData.taxable_amount != null ? Number(formData.taxable_amount) : ''}
              onChange={e => handleChange('taxable_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate</label>
            <input
              type="number"
              step="any"
              value={formData.tax_rate != null ? Number(formData.tax_rate) : ''}
              onChange={e => handleChange('tax_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Tax Withheld</label>
            <input
              type="number"
              step="any"
              value={formData.withholding_amount != null ? Number(formData.withholding_amount) : ''}
              onChange={e => handleChange('withholding_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Applicable For */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Applicable For</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxable Document Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.taxable_doctype ?? '')}
                onChange={e => {
                  handleChange('taxable_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="taxable_doctype"
              />
              {/* Link indicator */}
              {formData.taxable_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('taxable_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxable Document Name</label>
            <input
              type="text"
              value={String(formData.taxable_name ?? '')}
              onChange={e => handleChange('taxable_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxable Date</label>
            <input
              type="date"
              value={String(formData.taxable_date ?? '')}
              onChange={e => handleChange('taxable_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.conversion_rate != null ? Number(formData.conversion_rate) : ''}
              onChange={e => handleChange('conversion_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Under Withheld Reason</label>
            <select
              value={String(formData.under_withheld_reason ?? '')}
              onChange={e => handleChange('under_withheld_reason', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Threshold Exemption">Threshold Exemption</option>
              <option value="Lower Deduction Certificate">Lower Deduction Certificate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lower Deduction Certificate (→ Lower Deduction Certificate)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Lower Deduction Certificate..."
                value={String(formData.lower_deduction_certificate ?? '')}
                onChange={e => {
                  handleChange('lower_deduction_certificate', e.target.value);
                  // TODO: Implement async search for Lower Deduction Certificate
                  // fetch(`/api/resource/Lower Deduction Certificate?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Lower Deduction Certificate"
                data-fieldname="lower_deduction_certificate"
              />
              {/* Link indicator */}
              {formData.lower_deduction_certificate && (
                <button
                  type="button"
                  onClick={() => handleChange('lower_deduction_certificate', '')}
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
      {/* Section: Deducted From */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Deducted From</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Withholding Document Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.withholding_doctype ?? '')}
                onChange={e => {
                  handleChange('withholding_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="withholding_doctype"
              />
              {/* Link indicator */}
              {formData.withholding_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('withholding_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Withholding Document Name</label>
            <input
              type="text"
              value={String(formData.withholding_name ?? '')}
              onChange={e => handleChange('withholding_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Withholding Date</label>
            <input
              type="date"
              value={String(formData.withholding_date ?? '')}
              onChange={e => handleChange('withholding_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_ggna */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Settled">Settled</option>
              <option value="Under Withheld">Under Withheld</option>
              <option value="Over Withheld">Over Withheld</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.created_by_migration}
              onChange={e => handleChange('created_by_migration', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Created By Migration</label>
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