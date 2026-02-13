// List scaffold for Shipment Parcel
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ShipmentParcel } from '../types/shipment-parcel.js';

interface ShipmentParcelListProps {
  data: ShipmentParcel[];
  onRowClick?: (id: string) => void;
}

export function ShipmentParcelList({ data, onRowClick }: ShipmentParcelListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Length (cm)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Width (cm)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height (cm)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (kg)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
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
              <td className="px-4 py-3 text-sm">{String(row.length ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.width ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.height ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.weight ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.count ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}