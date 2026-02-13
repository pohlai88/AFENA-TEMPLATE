// List scaffold for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { MaintenanceVisitPurpose } from '../types/maintenance-visit-purpose.js';

interface MaintenanceVisitPurposeListProps {
  data: MaintenanceVisitPurpose[];
  onRowClick?: (id: string) => void;
}

export function MaintenanceVisitPurposeList({ data, onRowClick }: MaintenanceVisitPurposeListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Person</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Done</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.service_person ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.description ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.work_done ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}