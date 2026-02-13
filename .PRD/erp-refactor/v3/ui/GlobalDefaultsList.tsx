// List scaffold for Global Defaults
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { GlobalDefaults } from '../types/global-defaults.js';

interface GlobalDefaultsListProps {
  data: GlobalDefaults[];
  onRowClick?: (id: string) => void;
}

export function GlobalDefaultsList({ data, onRowClick }: GlobalDefaultsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Currency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hide Currency Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disable Rounded Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disable In Words</th>
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
              <td className="px-4 py-3 text-sm">{String(row.default_currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.hide_currency_symbol ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.disable_rounded_total ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.disable_in_words ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}