// List scaffold for Rename Tool
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { RenameTool } from '../types/rename-tool.js';

interface RenameToolListProps {
  data: RenameTool[];
  onRowClick?: (id: string) => void;
}

export function RenameToolList({ data, onRowClick }: RenameToolListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select DocType</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File to Rename</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rename Log</th>
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
              <td className="px-4 py-3 text-sm">{String(row.select_doctype ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.file_to_rename ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rename_log ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}