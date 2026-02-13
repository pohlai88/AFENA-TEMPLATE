// List scaffold for Stock Entry Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { StockEntryDetail } from '../types/stock-entry-detail.js';

interface StockEntryDetailListProps {
  data: StockEntryDetail[];
  onRowClick?: (id: string) => void;
}

export function StockEntryDetailList({ data, onRowClick }: StockEntryDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Rate (as per Stock UOM)</th>
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
              <td className="px-4 py-3 text-sm">{String(row.s_warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.t_warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.basic_rate ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}