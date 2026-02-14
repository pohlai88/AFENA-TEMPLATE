// List scaffold for Prospect Opportunity
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProspectOpportunity } from '../types/prospect-opportunity.js';

interface ProspectOpportunityListProps {
  data: ProspectOpportunity[];
  onRowClick?: (id: string) => void;
}

export function ProspectOpportunityList({ data, onRowClick }: ProspectOpportunityListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal Owner</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing</th>
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
              <td className="px-4 py-3 text-sm">{String(row.opportunity ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.stage ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.deal_owner ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.probability ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.expected_closing ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}