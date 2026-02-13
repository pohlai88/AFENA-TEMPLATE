// List scaffold for Pegged Currencies
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PeggedCurrencies } from '../types/pegged-currencies.js';

interface PeggedCurrenciesListProps {
  data: PeggedCurrencies[];
  onRowClick?: (id: string) => void;
}

export function PeggedCurrenciesList({ data, onRowClick }: PeggedCurrenciesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}