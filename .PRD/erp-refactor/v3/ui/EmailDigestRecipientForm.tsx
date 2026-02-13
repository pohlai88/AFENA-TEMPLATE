// Form scaffold for Email Digest Recipient
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { EmailDigestRecipient } from '../types/email-digest-recipient.js';

interface EmailDigestRecipientFormProps {
  initialData?: Partial<EmailDigestRecipient>;
  onSubmit: (data: Partial<EmailDigestRecipient>) => void;
  mode: 'create' | 'edit';
}

export function EmailDigestRecipientForm({ initialData = {}, onSubmit, mode }: EmailDigestRecipientFormProps) {
  const [formData, setFormData] = useState<Partial<EmailDigestRecipient>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Email Digest Recipient' : 'New Email Digest Recipient'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.recipient ?? '')}
                onChange={e => {
                  handleChange('recipient', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="User"
                data-fieldname="recipient"
              />
              {/* Link indicator */}
              {formData.recipient && (
                <button
                  type="button"
                  onClick={() => handleChange('recipient', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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