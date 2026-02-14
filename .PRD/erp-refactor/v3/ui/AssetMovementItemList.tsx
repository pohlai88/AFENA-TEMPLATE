// List scaffold for Asset Movement Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetMovementItem } from '../types/asset-movement-item.js';

interface AssetMovementItemListProps {
  data: AssetMovementItem[];
  onRowClick?: (id: string) => void;
}

export function AssetMovementItemList({ data, onRowClick }: AssetMovementItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Employee</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Employee</th>
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
              <td className="px-4 py-3 text-sm">{String(row.asset ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.source_location ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_employee ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.target_location ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_employee ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}