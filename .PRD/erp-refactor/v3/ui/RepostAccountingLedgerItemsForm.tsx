// Form scaffold for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { RepostAccountingLedgerItems } from '../types/repost-accounting-ledger-items.js';

interface RepostAccountingLedgerItemsFormProps {
  initialData?: Partial<RepostAccountingLedgerItems>;
  onSubmit: (data: Partial<RepostAccountingLedgerItems>) => void;
  mode: 'create' | 'edit';
}

export function RepostAccountingLedgerItemsForm({ initialData = {}, onSubmit, mode }: RepostAccountingLedgerItemsFormProps) {
  const [formData, setFormData] = useState<Partial<RepostAccountingLedgerItems>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Repost Accounting Ledger Items' : 'New Repost Accounting Ledger Items'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Voucher Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.voucher_type ?? '')}
                onChange={e => {
                  handleChange('voucher_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="voucher_type"
              />
              {/* Link indicator */}
              {formData.voucher_type && (
                <button
                  type="button"
                  onClick={() => handleChange('voucher_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Voucher No</label>
            <input
              type="text"
              value={String(formData.voucher_no ?? '')}
              onChange={e => handleChange('voucher_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}