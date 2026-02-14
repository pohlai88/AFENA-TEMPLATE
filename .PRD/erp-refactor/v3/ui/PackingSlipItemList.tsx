// List scaffold for Packing Slip Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PackingSlipItem } from '../types/packing-slip-item.js';

interface PackingSlipItemListProps {
  data: PackingSlipItem[];
  onRowClick?: (id: string) => void;
}

export function PackingSlipItemList({ data, onRowClick }: PackingSlipItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Weight</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page Break</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Note Item</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.net_weight ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.page_break ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.dn_detail ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}