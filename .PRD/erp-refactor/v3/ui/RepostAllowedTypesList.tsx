// List scaffold for Repost Allowed Types
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { RepostAllowedTypes } from '../types/repost-allowed-types.js';

interface RepostAllowedTypesListProps {
  data: RepostAllowedTypes[];
  onRowClick?: (id: string) => void;
}

export function RepostAllowedTypesList({ data, onRowClick }: RepostAllowedTypesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctype</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowed</th>
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
              <td className="px-4 py-3 text-sm">{String(row.document_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allowed ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}