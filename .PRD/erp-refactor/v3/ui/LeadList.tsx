// List scaffold for Lead
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Lead } from '../types/lead.js';

interface LeadListProps {
  data: Lead[];
  onRowClick?: (id: string) => void;
}

export function LeadList({ data, onRowClick }: LeadListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Territory</th>
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
              <td className="px-4 py-3 text-sm">{String(row.job_title ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.territory ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}