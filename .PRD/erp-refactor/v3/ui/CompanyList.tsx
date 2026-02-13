// List scaffold for Company
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Company } from '../types/company.js';

interface CompanyListProps {
  data: Company[];
  onRowClick?: (id: string) => void;
}

export function CompanyList({ data, onRowClick }: CompanyListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accounts Frozen Till Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles Allowed to Set and Edit Frozen Account Entries</th>
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
              <td className="px-4 py-3 text-sm">{String(row.country ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.parent_company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.accounts_frozen_till_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.role_allowed_for_frozen_entries ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}