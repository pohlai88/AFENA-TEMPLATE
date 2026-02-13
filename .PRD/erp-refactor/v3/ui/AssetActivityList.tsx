// List scaffold for Asset Activity
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetActivity } from '../types/asset-activity.js';

interface AssetActivityListProps {
  data: AssetActivity[];
  onRowClick?: (id: string) => void;
}

export function AssetActivityList({ data, onRowClick }: AssetActivityListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
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
              <td className="px-4 py-3 text-sm">{String(row.asset ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.user ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.subject ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}