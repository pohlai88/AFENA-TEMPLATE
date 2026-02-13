// List scaffold for Vehicle
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Vehicle } from '../types/vehicle.js';

interface VehicleListProps {
  data: Vehicle[];
  onRowClick?: (id: string) => void;
}

export function VehicleList({ data, onRowClick }: VehicleListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odometer Value (Last)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel UOM</th>
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
              <td className="px-4 py-3 text-sm">{String(row.model ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.last_odometer ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.vehicle_value ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.fuel_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.uom ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}