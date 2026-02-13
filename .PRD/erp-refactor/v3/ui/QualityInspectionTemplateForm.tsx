// Form scaffold for Quality Inspection Template
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityInspectionTemplate } from '../types/quality-inspection-template.js';

interface QualityInspectionTemplateFormProps {
  initialData?: Partial<QualityInspectionTemplate>;
  onSubmit: (data: Partial<QualityInspectionTemplate>) => void;
  mode: 'create' | 'edit';
}

export function QualityInspectionTemplateForm({ initialData = {}, onSubmit, mode }: QualityInspectionTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<QualityInspectionTemplate>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Inspection Template' : 'New Quality Inspection Template'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Inspection Template Name</label>
            <input
              type="text"
              value={String(formData.quality_inspection_template_name ?? '')}
              onChange={e => handleChange('quality_inspection_template_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {/* Child table: item_quality_inspection_parameter → Item Quality Inspection Parameter */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Quality Inspection Parameter</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.item_quality_inspection_parameter) ? (formData.item_quality_inspection_parameter as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.item_quality_inspection_parameter) ? formData.item_quality_inspection_parameter : [])];
                            rows.splice(idx, 1);
                            handleChange('item_quality_inspection_parameter', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('item_quality_inspection_parameter', [...(Array.isArray(formData.item_quality_inspection_parameter) ? formData.item_quality_inspection_parameter : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
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