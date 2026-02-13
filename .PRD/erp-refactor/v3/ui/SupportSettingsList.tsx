// List scaffold for Support Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SupportSettings } from '../types/support-settings.js';

interface SupportSettingsListProps {
  data: SupportSettings[];
  onRowClick?: (id: string) => void;
}

export function SupportSettingsList({ data, onRowClick }: SupportSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Track Service Level Agreement</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allow Resetting Service Level Agreement</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Issue After Days</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Get Started Sections</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show Latest Forum Posts</th>
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
              <td className="px-4 py-3 text-sm">{String(row.track_service_level_agreement ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allow_resetting_service_level_agreement ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.close_issue_after_days ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.get_started_sections ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.show_latest_forum_posts ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}