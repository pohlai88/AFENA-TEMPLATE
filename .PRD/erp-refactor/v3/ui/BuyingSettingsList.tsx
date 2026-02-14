// List scaffold for Buying Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BuyingSettings } from '../types/buying-settings.js';

interface BuyingSettingsListProps {
  data: BuyingSettings[];
  onRowClick?: (id: string) => void;
}

export function BuyingSettingsList({ data, onRowClick }: BuyingSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier Naming By</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Supplier Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Buying Price List</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action If Same Rate is Not Maintained</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Allowed to Override Stop Action</th>
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
              <td className="px-4 py-3 text-sm">{String(row.supp_master_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.supplier_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.buying_price_list ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.maintain_same_rate_action ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.role_to_override_stop_action ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}