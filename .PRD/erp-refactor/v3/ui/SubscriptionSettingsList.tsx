// List scaffold for Subscription Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SubscriptionSettings } from '../types/subscription-settings.js';

interface SubscriptionSettingsListProps {
  data: SubscriptionSettings[];
  onRowClick?: (id: string) => void;
}

export function SubscriptionSettingsList({ data, onRowClick }: SubscriptionSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grace Period</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancel Subscription After Grace Period</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prorate</th>
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
              <td className="px-4 py-3 text-sm">{String(row.grace_period ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.cancel_after_grace ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.prorate ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}