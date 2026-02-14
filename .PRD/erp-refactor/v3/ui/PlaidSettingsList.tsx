// List scaffold for Plaid Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PlaidSettings } from '../types/plaid-settings.js';

interface PlaidSettingsListProps {
  data: PlaidSettings[];
  onRowClick?: (id: string) => void;
}

export function PlaidSettingsList({ data, onRowClick }: PlaidSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plaid Client ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plaid Secret</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plaid Environment</th>
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
              <td className="px-4 py-3 text-sm">{String(row.plaid_client_id ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.plaid_secret ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.plaid_env ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}