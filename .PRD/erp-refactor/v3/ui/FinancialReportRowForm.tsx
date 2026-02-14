// Form scaffold for Financial Report Row
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { FinancialReportRow } from '../types/financial-report-row.js';

interface FinancialReportRowFormProps {
  initialData?: Partial<FinancialReportRow>;
  onSubmit: (data: Partial<FinancialReportRow>) => void;
  mode: 'create' | 'edit';
}

export function FinancialReportRowForm({ initialData = {}, onSubmit, mode }: FinancialReportRowFormProps) {
  const [formData, setFormData] = useState<Partial<FinancialReportRow>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Financial Report Row' : 'New Financial Report Row'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Reference</label>
            <input
              type="text"
              value={String(formData.reference_code ?? '')}
              onChange={e => handleChange('reference_code', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              value={String(formData.display_name ?? '')}
              onChange={e => handleChange('display_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Indent Level</label>
            <input
              type="number"
              step="1"
              value={formData.indentation_level != null ? Number(formData.indentation_level) : ''}
              onChange={e => handleChange('indentation_level', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Source</label>
            <select
              value={String(formData.data_source ?? '')}
              onChange={e => handleChange('data_source', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Account Data">Account Data</option>
              <option value="Calculated Amount">Calculated Amount</option>
              <option value="Custom API">Custom API</option>
              <option value="Blank Line">Blank Line</option>
              <option value="Column Break">Column Break</option>
              <option value="Section Break">Section Break</option>
            </select>
          </div>
          {formData.data_source === 'Account Data' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Balance Type</label>
            <select
              value={String(formData.balance_type ?? '')}
              onChange={e => handleChange('balance_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Opening Balance">Opening Balance</option>
              <option value="Closing Balance">Closing Balance</option>
              <option value="Period Movement (Debits - Credits)">Period Movement (Debits - Credits)</option>
            </select>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Value Type</label>
            <select
              value={String(formData.fieldtype ?? '')}
              onChange={e => handleChange('fieldtype', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Currency">Currency</option>
              <option value="Float">Float</option>
              <option value="Int">Int</option>
              <option value="Percent">Percent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={String(formData.color ?? '#000000')}
              onChange={e => handleChange('color', e.target.value)}
              className="mt-1 h-10 w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.bold_text}
              onChange={e => handleChange('bold_text', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Bold Text</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.italic_text}
              onChange={e => handleChange('italic_text', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Italic Text</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.hidden_calculation}
              onChange={e => handleChange('hidden_calculation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Hidden Line (Internal Use Only)</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.hide_when_empty}
              onChange={e => handleChange('hide_when_empty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Hide If Zero</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reverse_sign}
              onChange={e => handleChange('reverse_sign', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Reverse Sign</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_in_charts}
              onChange={e => handleChange('include_in_charts', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include in Charts</label>
          </div>
      {/* Section: section_break_ornw */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.data_source ==== "Account Data" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.advanced_filtering}
              onChange={e => handleChange('advanced_filtering', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Advanced Filtering</label>
          </div>
          )}
          {formData.data_source ==== "Account Data" && !formData.advanced_filtering && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">filters_editor</label>
            <textarea
              value={String(formData.filters_editor ?? '')}
              onChange={e => handleChange('filters_editor', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.data_source ==== "Account Data" && formData.advanced_filtering) || ["Calculated Amount", "Custom API"].includes(formData.data_source); && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Formula or Account Filter</label>
            <textarea
              value={String(formData.calculation_formula ?? '')}
              onChange={e => handleChange('calculation_formula', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_pvro */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">formula_description</label>
            <textarea
              value={String(formData.formula_description ?? '')}
              onChange={e => handleChange('formula_description', e.target.value)}
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