// List scaffold for Item Lead Time
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemLeadTime } from '../types/item-lead-time.js';

interface ItemLeadTimeListProps {
  data: ItemLeadTime[];
  onRowClick?: (id: string) => void;
}

export function ItemLeadTimeList({ data, onRowClick }: ItemLeadTimeListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buffer Time</th>
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
              <td className="px-4 py-3 text-sm">{String(row.capacity_per_day ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.purchase_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.buffer_time ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}