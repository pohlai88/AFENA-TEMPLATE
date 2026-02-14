// Form scaffold for Bank Statement Import
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BankStatementImport } from '../types/bank-statement-import.js';

interface BankStatementImportFormProps {
  initialData?: Partial<BankStatementImport>;
  onSubmit: (data: Partial<BankStatementImport>) => void;
  mode: 'create' | 'edit';
}

export function BankStatementImportForm({ initialData = {}, onSubmit, mode }: BankStatementImportFormProps) {
  const [formData, setFormData] = useState<Partial<BankStatementImport>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bank Statement Import' : 'New Bank Statement Import'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">Bank Account (→ Bank Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bank Account..."
                value={String(formData.bank_account ?? '')}
                onChange={e => {
                  handleChange('bank_account', e.target.value);
                  // TODO: Implement async search for Bank Account
                  // fetch(`/api/resource/Bank Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Bank Account"
                data-fieldname="bank_account"
              />
              {/* Link indicator */}
              {formData.bank_account && (
                <button
                  type="button"
                  onClick={() => handleChange('bank_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.bank_account && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank (→ Bank)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bank..."
                value={String(formData.bank ?? '')}
                onChange={e => {
                  handleChange('bank', e.target.value);
                  // TODO: Implement async search for Bank
                  // fetch(`/api/resource/Bank?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bank"
                data-fieldname="bank"
              />
              {/* Link indicator */}
              {formData.bank && (
                <button
                  type="button"
                  onClick={() => handleChange('bank', '')}
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
              checked={!!formData.import_mt940_fromat}
              onChange={e => handleChange('import_mt940_fromat', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Import MT940 Fromat</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.custom_delimiters}
              onChange={e => handleChange('custom_delimiters', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Custom delimiters</label>
          </div>
          {!!formData.custom_delimiters && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Delimiter options</label>
            <input
              type="text"
              value={String(formData.delimiter_options ?? '')}
              onChange={e => handleChange('delimiter_options', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.__islocal && !formData.import_file && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Import from Google Sheets</label>
            <input
              type="text"
              value={String(formData.google_sheets_url ?? '')}
              onChange={e => handleChange('google_sheets_url', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.__islocal && !formData.import_file && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">html_5</label>
            <textarea
              value={String(formData.html_5 ?? '')}
              onChange={e => handleChange('html_5', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Import File</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Success">Success</option>
              <option value="Partial Success">Partial Success</option>
              <option value="Error">Error</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Template Options</label>
            <textarea
              value={String(formData.template_options ?? '')}
              onChange={e => handleChange('template_options', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_csv_sniffer}
              onChange={e => handleChange('use_csv_sniffer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use CSV Sniffer</label>
          </div>
      {/* Section: Import File Errors and Warnings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Import File Errors and Warnings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Template Warnings</label>
            <textarea
              value={String(formData.template_warnings ?? '')}
              onChange={e => handleChange('template_warnings', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Import Warnings</label>
            <textarea
              value={String(formData.import_warnings ?? '')}
              onChange={e => handleChange('import_warnings', e.target.value)}
              rows={4}
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
            <label className="block text-sm font-medium text-gray-700">Import Preview</label>
            <textarea
              value={String(formData.import_preview ?? '')}
              onChange={e => handleChange('import_preview', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Import Log */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Import Log</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_failed_logs}
              onChange={e => handleChange('show_failed_logs', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Failed Logs</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Import Log Preview</label>
            <textarea
              value={String(formData.import_log_preview ?? '')}
              onChange={e => handleChange('import_log_preview', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.reference_doctype ?? '')}
                onChange={e => {
                  handleChange('reference_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="reference_doctype"
              />
              {/* Link indicator */}
              {formData.reference_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('reference_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Import Type</label>
            <select
              value={String(formData.import_type ?? '')}
              onChange={e => handleChange('import_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Insert New Records">Insert New Records</option>
              <option value="Update Existing Records">Update Existing Records</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.submit_after_import}
              onChange={e => handleChange('submit_after_import', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Submit After Import</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.mute_emails}
              onChange={e => handleChange('mute_emails', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Don't Send Emails</label>
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