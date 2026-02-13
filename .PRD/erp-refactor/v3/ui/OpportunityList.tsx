// List scaffold for Opportunity
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Opportunity } from '../types/opportunity.js';

interface OpportunityListProps {
  data: Opportunity[];
  onRowClick?: (id: string) => void;
}

export function OpportunityList({ data, onRowClick }: OpportunityListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Series</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity From</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity Type</th>
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
              <td className="px-4 py-3 text-sm">{String(row.naming_series ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.opportunity_from ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.opportunity_type ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}