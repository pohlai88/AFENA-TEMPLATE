// Form scaffold for Cheque Print Template
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ChequePrintTemplate } from '../types/cheque-print-template.js';

interface ChequePrintTemplateFormProps {
  initialData?: Partial<ChequePrintTemplate>;
  onSubmit: (data: Partial<ChequePrintTemplate>) => void;
  mode: 'create' | 'edit';
}

export function ChequePrintTemplateForm({ initialData = {}, onSubmit, mode }: ChequePrintTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<ChequePrintTemplate>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Cheque Print Template' : 'New Cheque Print Template'}</h2>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">settings</label>
            <textarea
              value={String(formData.settings ?? '')}
              onChange={e => handleChange('settings', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_print_format}
              onChange={e => handleChange('has_print_format', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Print Format</label>
          </div>
      {/* Section: Primary Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Primary Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              value={String(formData.bank_name ?? '')}
              onChange={e => handleChange('bank_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Size</label>
            <select
              value={String(formData.cheque_size ?? '')}
              onChange={e => handleChange('cheque_size', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Regular">Regular</option>
              <option value="A4">A4</option>
            </select>
          </div>
          {formData.cheque_size==="A4" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting position from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.starting_position_from_top_edge != null ? Number(formData.starting_position_from_top_edge) : ''}
              onChange={e => handleChange('starting_position_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Width</label>
            <input
              type="number"
              step="any"
              value={formData.cheque_width != null ? Number(formData.cheque_width) : ''}
              onChange={e => handleChange('cheque_width', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Height</label>
            <input
              type="number"
              step="any"
              value={formData.cheque_height != null ? Number(formData.cheque_height) : ''}
              onChange={e => handleChange('cheque_height', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scanned Cheque</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_account_payable}
              onChange={e => handleChange('is_account_payable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Account Payable</label>
          </div>
          {!!formData.is_account_payable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.acc_pay_dist_from_top_edge != null ? Number(formData.acc_pay_dist_from_top_edge) : ''}
              onChange={e => handleChange('acc_pay_dist_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_account_payable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.acc_pay_dist_from_left_edge != null ? Number(formData.acc_pay_dist_from_left_edge) : ''}
              onChange={e => handleChange('acc_pay_dist_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_account_payable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Message to show</label>
            <input
              type="text"
              value={String(formData.message_to_show ?? '')}
              onChange={e => handleChange('message_to_show', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: date_and_payer_settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Date Settings</label>
            <textarea
              value={String(formData.date_settings ?? '')}
              onChange={e => handleChange('date_settings', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.date_dist_from_top_edge != null ? Number(formData.date_dist_from_top_edge) : ''}
              onChange={e => handleChange('date_dist_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting location from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.date_dist_from_left_edge != null ? Number(formData.date_dist_from_left_edge) : ''}
              onChange={e => handleChange('date_dist_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.payer_name_from_top_edge != null ? Number(formData.payer_name_from_top_edge) : ''}
              onChange={e => handleChange('payer_name_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting location from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.payer_name_from_left_edge != null ? Number(formData.payer_name_from_left_edge) : ''}
              onChange={e => handleChange('payer_name_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: amount_in_words_and_figure_settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">html_19</label>
            <textarea
              value={String(formData.html_19 ?? '')}
              onChange={e => handleChange('html_19', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.amt_in_words_from_top_edge != null ? Number(formData.amt_in_words_from_top_edge) : ''}
              onChange={e => handleChange('amt_in_words_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting location from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.amt_in_words_from_left_edge != null ? Number(formData.amt_in_words_from_left_edge) : ''}
              onChange={e => handleChange('amt_in_words_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Width of amount in word</label>
            <input
              type="number"
              step="any"
              value={formData.amt_in_word_width != null ? Number(formData.amt_in_word_width) : ''}
              onChange={e => handleChange('amt_in_word_width', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line spacing for amount in words</label>
            <input
              type="number"
              step="any"
              value={formData.amt_in_words_line_spacing != null ? Number(formData.amt_in_words_line_spacing) : ''}
              onChange={e => handleChange('amt_in_words_line_spacing', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.amt_in_figures_from_top_edge != null ? Number(formData.amt_in_figures_from_top_edge) : ''}
              onChange={e => handleChange('amt_in_figures_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting location from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.amt_in_figures_from_left_edge != null ? Number(formData.amt_in_figures_from_left_edge) : ''}
              onChange={e => handleChange('amt_in_figures_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: account_number_and_signatory_settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">account_no_settings</label>
            <textarea
              value={String(formData.account_no_settings ?? '')}
              onChange={e => handleChange('account_no_settings', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.acc_no_dist_from_top_edge != null ? Number(formData.acc_no_dist_from_top_edge) : ''}
              onChange={e => handleChange('acc_no_dist_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting location from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.acc_no_dist_from_left_edge != null ? Number(formData.acc_no_dist_from_left_edge) : ''}
              onChange={e => handleChange('acc_no_dist_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from top edge</label>
            <input
              type="number"
              step="any"
              value={formData.signatory_from_top_edge != null ? Number(formData.signatory_from_top_edge) : ''}
              onChange={e => handleChange('signatory_from_top_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting location from left edge</label>
            <input
              type="number"
              step="any"
              value={formData.signatory_from_left_edge != null ? Number(formData.signatory_from_left_edge) : ''}
              onChange={e => handleChange('signatory_from_left_edge', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Preview */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Preview</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">cheque_print_preview</label>
            <textarea
              value={String(formData.cheque_print_preview ?? '')}
              onChange={e => handleChange('cheque_print_preview', e.target.value)}
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