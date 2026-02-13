// List scaffold for Authorization Rule
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AuthorizationRule } from '../types/authorization-rule.js';

interface AuthorizationRuleListProps {
  data: AuthorizationRule[];
  onRowClick?: (id: string) => void;
}

export function AuthorizationRuleList({ data, onRowClick }: AuthorizationRuleListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Based On</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer / Item / Item Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicable To (Role)</th>
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
              <td className="px-4 py-3 text-sm">{String(row.transaction ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.based_on ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.master_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.system_role ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}