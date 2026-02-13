// Form scaffold for Bisect Nodes
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BisectNodes } from '../types/bisect-nodes.js';

interface BisectNodesFormProps {
  initialData?: Partial<BisectNodes>;
  onSubmit: (data: Partial<BisectNodes>) => void;
  mode: 'create' | 'edit';
}

export function BisectNodesForm({ initialData = {}, onSubmit, mode }: BisectNodesFormProps) {
  const [formData, setFormData] = useState<Partial<BisectNodes>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bisect Nodes' : 'New Bisect Nodes'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Root (→ Bisect Nodes)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bisect Nodes..."
                value={String(formData.root ?? '')}
                onChange={e => {
                  handleChange('root', e.target.value);
                  // TODO: Implement async search for Bisect Nodes
                  // fetch(`/api/resource/Bisect Nodes?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bisect Nodes"
                data-fieldname="root"
              />
              {/* Link indicator */}
              {formData.root && (
                <button
                  type="button"
                  onClick={() => handleChange('root', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Left Child (→ Bisect Nodes)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bisect Nodes..."
                value={String(formData.left_child ?? '')}
                onChange={e => {
                  handleChange('left_child', e.target.value);
                  // TODO: Implement async search for Bisect Nodes
                  // fetch(`/api/resource/Bisect Nodes?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bisect Nodes"
                data-fieldname="left_child"
              />
              {/* Link indicator */}
              {formData.left_child && (
                <button
                  type="button"
                  onClick={() => handleChange('left_child', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Right Child (→ Bisect Nodes)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bisect Nodes..."
                value={String(formData.right_child ?? '')}
                onChange={e => {
                  handleChange('right_child', e.target.value);
                  // TODO: Implement async search for Bisect Nodes
                  // fetch(`/api/resource/Bisect Nodes?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bisect Nodes"
                data-fieldname="right_child"
              />
              {/* Link indicator */}
              {formData.right_child && (
                <button
                  type="button"
                  onClick={() => handleChange('right_child', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Period_from_date</label>
            <input
              type="datetime-local"
              value={String(formData.period_from_date ?? '')}
              onChange={e => handleChange('period_from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Period To Date</label>
            <input
              type="datetime-local"
              value={String(formData.period_to_date ?? '')}
              onChange={e => handleChange('period_to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Difference</label>
            <input
              type="number"
              step="any"
              value={formData.difference != null ? Number(formData.difference) : ''}
              onChange={e => handleChange('difference', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Balance Sheet Summary</label>
            <input
              type="number"
              step="any"
              value={formData.balance_sheet_summary != null ? Number(formData.balance_sheet_summary) : ''}
              onChange={e => handleChange('balance_sheet_summary', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profit and Loss Summary</label>
            <input
              type="number"
              step="any"
              value={formData.profit_loss_summary != null ? Number(formData.profit_loss_summary) : ''}
              onChange={e => handleChange('profit_loss_summary', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.generated}
              onChange={e => handleChange('generated', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Generated</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}