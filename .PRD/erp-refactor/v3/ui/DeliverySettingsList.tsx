// List scaffold for Delivery Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { DeliverySettings } from '../types/delivery-settings.js';

interface DeliverySettingsListProps {
  data: DeliverySettings[];
  onRowClick?: (id: string) => void;
}

export function DeliverySettingsList({ data, onRowClick }: DeliverySettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispatch Notification Template</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispatch Notification Attachment</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Send with Attachment</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delay between Delivery Stops</th>
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
              <td className="px-4 py-3 text-sm">{String(row.dispatch_template ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.dispatch_attachment ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.send_with_attachment ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.stop_delay ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}