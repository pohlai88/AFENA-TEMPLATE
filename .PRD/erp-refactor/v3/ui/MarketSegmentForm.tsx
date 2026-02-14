// Form scaffold for Market Segment
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { MarketSegment } from '../types/market-segment.js';

interface MarketSegmentFormProps {
  initialData?: Partial<MarketSegment>;
  onSubmit: (data: Partial<MarketSegment>) => void;
  mode: 'create' | 'edit';
}

export function MarketSegmentForm({ initialData = {}, onSubmit, mode }: MarketSegmentFormProps) {
  const [formData, setFormData] = useState<Partial<MarketSegment>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Market Segment' : 'New Market Segment'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Market Segment</label>
            <input
              type="text"
              value={String(formData.market_segment ?? '')}
              onChange={e => handleChange('market_segment', e.target.value)}
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