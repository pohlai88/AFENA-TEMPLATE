// List scaffold for Item Alternative
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemAlternative } from '../types/item-alternative.js';

interface ItemAlternativeListProps {
  data: ItemAlternative[];
  onRowClick?: (id: string) => void;
}

export function ItemAlternativeList({ data, onRowClick }: ItemAlternativeListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alternative Item Code</th>
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
              <td className="px-4 py-3 text-sm">{String(row.alternative_item_code ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}