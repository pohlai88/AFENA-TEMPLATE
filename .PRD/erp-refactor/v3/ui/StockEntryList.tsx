// List scaffold for Stock Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { StockEntry } from '../types/stock-entry.js';

interface StockEntryListProps {
  data: StockEntry[];
  onRowClick?: (id: string) => void;
}

export function StockEntryList({ data, onRowClick }: StockEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Entry Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Source Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Target Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per Transferred</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Return</th>
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
              <td className="px-4 py-3 text-sm">{String(row.stock_entry_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.purpose ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_transferred ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.is_return ?? '')}</td>
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