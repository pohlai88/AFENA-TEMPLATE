// List scaffold for Asset Value Adjustment
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetValueAdjustment } from '../types/asset-value-adjustment.js';

interface AssetValueAdjustmentListProps {
  data: AssetValueAdjustment[];
  onRowClick?: (id: string) => void;
}

export function AssetValueAdjustmentList({ data, onRowClick }: AssetValueAdjustmentListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finance Book</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Asset Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Asset Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
              <td className="px-4 py-3 text-sm">{String(row.finance_book ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.current_asset_value ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.new_asset_value ?? '')}</td>
              <td className="px-4 py-3 text-sm">
                {(row as any).docstatus === 0 ? 'Draft' : (row as any).docstatus === 1 ? 'Submitted' : 'Cancelled'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}