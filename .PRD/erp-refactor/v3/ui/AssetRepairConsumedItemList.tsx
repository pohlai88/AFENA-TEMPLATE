// List scaffold for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetRepairConsumedItem } from '../types/asset-repair-consumed-item.js';

interface AssetRepairConsumedItemListProps {
  data: AssetRepairConsumedItem[];
  onRowClick?: (id: string) => void;
}

export function AssetRepairConsumedItemList({ data, onRowClick }: AssetRepairConsumedItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valuation Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumed Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.valuation_rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.consumed_quantity ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.total_value ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}