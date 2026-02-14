// List scaffold for Party Specific Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PartySpecificItem } from '../types/party-specific-item.js';

interface PartySpecificItemListProps {
  data: PartySpecificItem[];
  onRowClick?: (id: string) => void;
}

export function PartySpecificItemList({ data, onRowClick }: PartySpecificItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restrict Items Based On</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Based On Value</th>
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
              <td className="px-4 py-3 text-sm">{String(row.party_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.party ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.restrict_based_on ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.based_on_value ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}