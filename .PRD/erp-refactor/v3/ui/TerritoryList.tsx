// List scaffold for Territory
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Territory } from '../types/territory.js';

interface TerritoryListProps {
  data: Territory[];
  onRowClick?: (id: string) => void;
}

export function TerritoryList({ data, onRowClick }: TerritoryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Territory Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Territory</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Territory Manager</th>
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
              <td className="px-4 py-3 text-sm">{String(row.territory_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.parent_territory ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.is_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.territory_manager ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}