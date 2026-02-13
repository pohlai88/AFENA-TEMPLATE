// List scaffold for BOM Update Tool
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BomUpdateTool } from '../types/bom-update-tool.js';

interface BomUpdateToolListProps {
  data: BomUpdateTool[];
  onRowClick?: (id: string) => void;
}

export function BomUpdateToolList({ data, onRowClick }: BomUpdateToolListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current BOM</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New BOM</th>
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
              <td className="px-4 py-3 text-sm">{String(row.current_bom ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.new_bom ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}