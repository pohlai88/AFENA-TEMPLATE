// List scaffold for GL Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { GlEntry } from '../types/gl-entry.js';

interface GlEntryListProps {
  data: GlEntry[];
  onRowClick?: (id: string) => void;
}

export function GlEntryList({ data, onRowClick }: GlEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posting Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Center</th>
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
              <td className="px-4 py-3 text-sm">{String(row.posting_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.transaction_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.cost_center ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}