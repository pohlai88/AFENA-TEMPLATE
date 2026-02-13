// Form scaffold for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityMeetingAgenda } from '../types/quality-meeting-agenda.js';

interface QualityMeetingAgendaFormProps {
  initialData?: Partial<QualityMeetingAgenda>;
  onSubmit: (data: Partial<QualityMeetingAgenda>) => void;
  mode: 'create' | 'edit';
}

export function QualityMeetingAgendaForm({ initialData = {}, onSubmit, mode }: QualityMeetingAgendaFormProps) {
  const [formData, setFormData] = useState<Partial<QualityMeetingAgenda>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Meeting Agenda' : 'New Quality Meeting Agenda'}</h2>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Agenda</label>
            <textarea
              value={String(formData.agenda ?? '')}
              onChange={e => handleChange('agenda', e.target.value)}
              rows={4}
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