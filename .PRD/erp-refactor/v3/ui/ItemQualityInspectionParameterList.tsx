// List scaffold for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemQualityInspectionParameter } from '../types/item-quality-inspection-parameter.js';

interface ItemQualityInspectionParameterListProps {
  data: ItemQualityInspectionParameter[];
  onRowClick?: (id: string) => void;
}

export function ItemQualityInspectionParameterList({ data, onRowClick }: ItemQualityInspectionParameterListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acceptance Criteria Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numeric</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maximum Value</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.id)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3 text-sm">{row.id}</td>
              <td className="px-4 py-3 text-sm">{String(row.specification ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.value ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.numeric ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.min_value ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.max_value ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}