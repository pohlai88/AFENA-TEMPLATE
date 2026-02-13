// List scaffold for Asset Maintenance Task
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetMaintenanceTask } from '../types/asset-maintenance-task.js';

interface AssetMaintenanceTaskListProps {
  data: AssetMaintenanceTask[];
  onRowClick?: (id: string) => void;
}

export function AssetMaintenanceTaskList({ data, onRowClick }: AssetMaintenanceTaskListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance Task</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodicity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign To</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Completion Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.maintenance_task ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.maintenance_status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.periodicity ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.assign_to ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.next_due_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.last_completion_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}