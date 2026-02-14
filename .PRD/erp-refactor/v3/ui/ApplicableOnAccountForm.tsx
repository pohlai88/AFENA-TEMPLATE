// Form scaffold for Applicable On Account
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ApplicableOnAccount } from '../types/applicable-on-account.js';

interface ApplicableOnAccountFormProps {
  initialData?: Partial<ApplicableOnAccount>;
  onSubmit: (data: Partial<ApplicableOnAccount>) => void;
  mode: 'create' | 'edit';
}

export function ApplicableOnAccountForm({ initialData = {}, onSubmit, mode }: ApplicableOnAccountFormProps) {
  const [formData, setFormData] = useState<Partial<ApplicableOnAccount>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Applicable On Account' : 'New Applicable On Account'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounts (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.applicable_on_account ?? '')}
                onChange={e => {
                  handleChange('applicable_on_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="applicable_on_account"
              />
              {/* Link indicator */}
              {formData.applicable_on_account && (
                <button
                  type="button"
                  onClick={() => handleChange('applicable_on_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_mandatory}
              onChange={e => handleChange('is_mandatory', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Mandatory</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}