// List scaffold for Loyalty Point Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { LoyaltyPointEntry } from '../types/loyalty-point-entry.js';

interface LoyaltyPointEntryListProps {
  data: LoyaltyPointEntry[];
  onRowClick?: (id: string) => void;
}

export function LoyaltyPointEntryList({ data, onRowClick }: LoyaltyPointEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty Points</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.customer ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.invoice ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.loyalty_points ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.expiry_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}