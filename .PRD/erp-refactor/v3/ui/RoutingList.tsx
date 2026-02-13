// List scaffold for Routing
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Routing } from '../types/routing.js';

interface RoutingListProps {
  data: Routing[];
  onRowClick?: (id: string) => void;
}

export function RoutingList({ data, onRowClick }: RoutingListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Routing Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disabled</th>
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
              <td className="px-4 py-3 text-sm">{String(row.routing_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.disabled ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}