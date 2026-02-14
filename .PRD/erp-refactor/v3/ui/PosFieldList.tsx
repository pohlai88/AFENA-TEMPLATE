// List scaffold for POS Field
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PosField } from '../types/pos-field.js';

interface PosFieldListProps {
  data: PosField[];
  onRowClick?: (id: string) => void;
}

export function PosFieldList({ data, onRowClick }: PosFieldListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fieldname</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fieldtype</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Options</th>
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
              <td className="px-4 py-3 text-sm">{String(row.fieldname ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.label ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.fieldtype ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.options ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}