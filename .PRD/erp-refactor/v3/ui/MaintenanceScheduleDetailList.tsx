// List scaffold for Maintenance Schedule Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { MaintenanceScheduleDetail } from '../types/maintenance-schedule-detail.js';

interface MaintenanceScheduleDetailListProps {
  data: MaintenanceScheduleDetail[];
  onRowClick?: (id: string) => void;
}

export function MaintenanceScheduleDetailList({ data, onRowClick }: MaintenanceScheduleDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Person</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial No</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.scheduled_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.actual_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.sales_person ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.completion_status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.serial_no ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}