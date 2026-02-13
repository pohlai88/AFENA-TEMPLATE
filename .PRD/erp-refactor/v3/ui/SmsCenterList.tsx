// List scaffold for SMS Center
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SmsCenter } from '../types/sms-center.js';

interface SmsCenterListProps {
  data: SmsCenter[];
  onRowClick?: (id: string) => void;
}

export function SmsCenterList({ data, onRowClick }: SmsCenterListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Send To</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
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
              <td className="px-4 py-3 text-sm">{String(row.send_to ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.customer ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.supplier ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.department ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}