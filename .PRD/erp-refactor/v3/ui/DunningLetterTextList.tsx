// List scaffold for Dunning Letter Text
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { DunningLetterText } from '../types/dunning-letter-text.js';

interface DunningLetterTextListProps {
  data: DunningLetterText[];
  onRowClick?: (id: string) => void;
}

export function DunningLetterTextList({ data, onRowClick }: DunningLetterTextListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body Text</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Text</th>
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
              <td className="px-4 py-3 text-sm">{String(row.language ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.body_text ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.closing_text ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}