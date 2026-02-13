// List scaffold for Party Link
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PartyLink } from '../types/party-link.js';

interface PartyLinkListProps {
  data: PartyLink[];
  onRowClick?: (id: string) => void;
}

export function PartyLinkList({ data, onRowClick }: PartyLinkListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Role</th>
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
              <td className="px-4 py-3 text-sm">{String(row.primary_role ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}