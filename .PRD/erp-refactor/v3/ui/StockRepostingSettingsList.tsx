// List scaffold for Stock Reposting Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { StockRepostingSettings } from '../types/stock-reposting-settings.js';

interface StockRepostingSettingsListProps {
  data: StockRepostingSettings[];
  onRowClick?: (id: string) => void;
}

export function StockRepostingSettingsList({ data, onRowClick }: StockRepostingSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit timeslot for Stock Reposting</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limits don't apply on</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Use Item based reposting</th>
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
              <td className="px-4 py-3 text-sm">{String(row.limit_reposting_timeslot ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.start_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.end_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.limits_dont_apply_on ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.item_based_reposting ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}