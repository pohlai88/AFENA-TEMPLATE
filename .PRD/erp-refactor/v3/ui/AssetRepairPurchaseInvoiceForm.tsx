// Form scaffold for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetRepairPurchaseInvoice } from '../types/asset-repair-purchase-invoice.js';

interface AssetRepairPurchaseInvoiceFormProps {
  initialData?: Partial<AssetRepairPurchaseInvoice>;
  onSubmit: (data: Partial<AssetRepairPurchaseInvoice>) => void;
  mode: 'create' | 'edit';
}

export function AssetRepairPurchaseInvoiceForm({ initialData = {}, onSubmit, mode }: AssetRepairPurchaseInvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<AssetRepairPurchaseInvoice>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Repair Purchase Invoice' : 'New Asset Repair Purchase Invoice'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Invoice (→ Purchase Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Invoice..."
                value={String(formData.purchase_invoice ?? '')}
                onChange={e => {
                  handleChange('purchase_invoice', e.target.value);
                  // TODO: Implement async search for Purchase Invoice
                  // fetch(`/api/resource/Purchase Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Invoice"
                data-fieldname="purchase_invoice"
              />
              {/* Link indicator */}
              {formData.purchase_invoice && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_invoice', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expense Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.expense_account ?? '')}
                onChange={e => {
                  handleChange('expense_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="expense_account"
              />
              {/* Link indicator */}
              {formData.expense_account && (
                <button
                  type="button"
                  onClick={() => handleChange('expense_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Repair Cost</label>
            <input
              type="number"
              step="any"
              value={formData.repair_cost != null ? Number(formData.repair_cost) : ''}
              onChange={e => handleChange('repair_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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