// List scaffold for Putaway Rule
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PutawayRule } from '../types/putaway-rule.js';

interface PutawayRuleListProps {
  data: PutawayRule[];
  onRowClick?: (id: string) => void;
}

export function PutawayRuleList({ data, onRowClick }: PutawayRuleListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
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
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.priority ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.capacity ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}