// List scaffold for Asset Maintenance
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetMaintenance } from '../types/asset-maintenance.js';

interface AssetMaintenanceListProps {
  data: AssetMaintenance[];
  onRowClick?: (id: string) => void;
}

export function AssetMaintenanceList({ data, onRowClick }: AssetMaintenanceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance Team</th>
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
              <td className="px-4 py-3 text-sm">{String(row.asset_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.maintenance_team ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}