// Form scaffold for Authorization Control
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AuthorizationControl } from '../types/authorization-control.js';

interface AuthorizationControlFormProps {
  initialData?: Partial<AuthorizationControl>;
  onSubmit: (data: Partial<AuthorizationControl>) => void;
  mode: 'create' | 'edit';
}

export function AuthorizationControlForm({ initialData = {}, onSubmit, mode }: AuthorizationControlFormProps) {
  const [formData, setFormData] = useState<Partial<AuthorizationControl>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Authorization Control' : 'New Authorization Control'}</h2>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}