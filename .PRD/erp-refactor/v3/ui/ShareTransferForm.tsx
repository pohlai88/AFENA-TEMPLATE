// Form scaffold for Share Transfer
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShareTransfer } from '../types/share-transfer.js';

interface ShareTransferFormProps {
  initialData?: Partial<ShareTransfer>;
  onSubmit: (data: Partial<ShareTransfer>) => void;
  mode: 'create' | 'edit';
}

export function ShareTransferForm({ initialData = {}, onSubmit, mode }: ShareTransferFormProps) {
  const [formData, setFormData] = useState<Partial<ShareTransfer>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Share Transfer' : 'New Share Transfer'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transfer Type</label>
            <select
              value={String(formData.transfer_type ?? '')}
              onChange={e => handleChange('transfer_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Issue">Issue</option>
              <option value="Purchase">Purchase</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: section_break_1 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.transfer_type !== 'Issue' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Shareholder (→ Shareholder)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Shareholder..."
                value={String(formData.from_shareholder ?? '')}
                onChange={e => {
                  handleChange('from_shareholder', e.target.value);
                  // TODO: Implement async search for Shareholder
                  // fetch(`/api/resource/Shareholder?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Shareholder"
                data-fieldname="from_shareholder"
              />
              {/* Link indicator */}
              {formData.from_shareholder && (
                <button
                  type="button"
                  onClick={() => handleChange('from_shareholder', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.transfer_type !== 'Issue' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Folio No</label>
            <input
              type="text"
              value={String(formData.from_folio_no ?? '')}
              onChange={e => handleChange('from_folio_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.transfer_type !== 'Purchase' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Shareholder (→ Shareholder)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Shareholder..."
                value={String(formData.to_shareholder ?? '')}
                onChange={e => {
                  handleChange('to_shareholder', e.target.value);
                  // TODO: Implement async search for Shareholder
                  // fetch(`/api/resource/Shareholder?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Shareholder"
                data-fieldname="to_shareholder"
              />
              {/* Link indicator */}
              {formData.to_shareholder && (
                <button
                  type="button"
                  onClick={() => handleChange('to_shareholder', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.transfer_type !== 'Purchase' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Folio No</label>
            <input
              type="text"
              value={String(formData.to_folio_no ?? '')}
              onChange={e => handleChange('to_folio_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_10 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!!formData.company && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Equity/Liability Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.equity_or_liability_account ?? '')}
                onChange={e => {
                  handleChange('equity_or_liability_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="equity_or_liability_account"
              />
              {/* Link indicator */}
              {formData.equity_or_liability_account && (
                <button
                  type="button"
                  onClick={() => handleChange('equity_or_liability_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(formData.transfer_type !== 'Transfer') && (formData.company) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.asset_account ?? '')}
                onChange={e => {
                  handleChange('asset_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="asset_account"
              />
              {/* Link indicator */}
              {formData.asset_account && (
                <button
                  type="button"
                  onClick={() => handleChange('asset_account', '')}
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
      {/* Section: section_break_4 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Share Type (→ Share Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Share Type..."
                value={String(formData.share_type ?? '')}
                onChange={e => {
                  handleChange('share_type', e.target.value);
                  // TODO: Implement async search for Share Type
                  // fetch(`/api/resource/Share Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Share Type"
                data-fieldname="share_type"
              />
              {/* Link indicator */}
              {formData.share_type && (
                <button
                  type="button"
                  onClick={() => handleChange('share_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From No</label>
            <input
              type="number"
              step="1"
              value={formData.from_no != null ? Number(formData.from_no) : ''}
              onChange={e => handleChange('from_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              step="any"
              value={formData.rate != null ? Number(formData.rate) : ''}
              onChange={e => handleChange('rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Shares</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_shares != null ? Number(formData.no_of_shares) : ''}
              onChange={e => handleChange('no_of_shares', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To No</label>
            <input
              type="number"
              step="1"
              value={formData.to_no != null ? Number(formData.to_no) : ''}
              onChange={e => handleChange('to_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_11 */}
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
        </div>
      </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={String(formData.remarks ?? '')}
              onChange={e => handleChange('remarks', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Share Transfer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Share Transfer..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Share Transfer
                  // fetch(`/api/resource/Share Transfer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Share Transfer"
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