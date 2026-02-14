// List scaffold for Material Request Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { MaterialRequestItem } from '../types/material-request-item.js';

interface MaterialRequestItemListProps {
  data: MaterialRequestItem[];
  onRowClick?: (id: string) => void;
}

export function MaterialRequestItemList({ data, onRowClick }: MaterialRequestItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required By</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UOM</th>
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
              <td className="px-4 py-3 text-sm">{String(row.schedule_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.uom ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}