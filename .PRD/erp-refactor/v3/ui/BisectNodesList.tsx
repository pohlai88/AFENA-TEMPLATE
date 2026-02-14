// List scaffold for Bisect Nodes
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BisectNodes } from '../types/bisect-nodes.js';

interface BisectNodesListProps {
  data: BisectNodes[];
  onRowClick?: (id: string) => void;
}

export function BisectNodesList({ data, onRowClick }: BisectNodesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Root</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Left Child</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Right Child</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period_from_date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period To Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.root ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.left_child ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.right_child ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.period_from_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.period_to_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}