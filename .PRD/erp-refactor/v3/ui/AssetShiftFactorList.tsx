// List scaffold for Asset Shift Factor
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetShiftFactor } from '../types/asset-shift-factor.js';

interface AssetShiftFactorListProps {
  data: AssetShiftFactor[];
  onRowClick?: (id: string) => void;
}

export function AssetShiftFactorList({ data, onRowClick }: AssetShiftFactorListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift Factor</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
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
              <td className="px-4 py-3 text-sm">{String(row.shift_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.shift_factor ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.default ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}