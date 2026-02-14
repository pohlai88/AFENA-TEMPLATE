// List scaffold for Loyalty Program Collection
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { LoyaltyProgramCollection } from '../types/loyalty-program-collection.js';

interface LoyaltyProgramCollectionListProps {
  data: LoyaltyProgramCollection[];
  onRowClick?: (id: string) => void;
}

export function LoyaltyProgramCollectionList({ data, onRowClick }: LoyaltyProgramCollectionListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum Total Spent</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection Factor (=1 LP)</th>
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
              <td className="px-4 py-3 text-sm">{String(row.tier_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.min_spent ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.collection_factor ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}