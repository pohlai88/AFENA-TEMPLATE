// List scaffold for Pegged Currency Details
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PeggedCurrencyDetails } from '../types/pegged-currency-details.js';

interface PeggedCurrencyDetailsListProps {
  data: PeggedCurrencyDetails[];
  onRowClick?: (id: string) => void;
}

export function PeggedCurrencyDetailsList({ data, onRowClick }: PeggedCurrencyDetailsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegged Against</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exchange Rate</th>
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
              <td className="px-4 py-3 text-sm">{String(row.source_currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.pegged_against ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.pegged_exchange_rate ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}