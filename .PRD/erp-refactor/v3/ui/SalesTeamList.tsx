// List scaffold for Sales Team
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SalesTeam } from '../types/sales-team.js';

interface SalesTeamListProps {
  data: SalesTeam[];
  onRowClick?: (id: string) => void;
}

export function SalesTeamList({ data, onRowClick }: SalesTeamListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Person</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact No.</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contribution (%)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contribution to Net Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incentives</th>
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
              <td className="px-4 py-3 text-sm">{String(row.sales_person ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.contact_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allocated_percentage ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allocated_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.commission_rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.incentives ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}