// List scaffold for Plant Floor
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PlantFloor } from '../types/plant-floor.js';

interface PlantFloorListProps {
  data: PlantFloor[];
  onRowClick?: (id: string) => void;
}

export function PlantFloorList({ data, onRowClick }: PlantFloorListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plant Dashboard</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Summary</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
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
              <td className="px-4 py-3 text-sm">{String(row.plant_dashboard ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.stock_summary ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.floor_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}