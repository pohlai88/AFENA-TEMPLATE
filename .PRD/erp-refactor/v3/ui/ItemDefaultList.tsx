// List scaffold for Item Default
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemDefault } from '../types/item-default.js';

interface ItemDefaultListProps {
  data: ItemDefault[];
  onRowClick?: (id: string) => void;
}

export function ItemDefaultList({ data, onRowClick }: ItemDefaultListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Price List</th>
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
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.default_warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.default_price_list ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}