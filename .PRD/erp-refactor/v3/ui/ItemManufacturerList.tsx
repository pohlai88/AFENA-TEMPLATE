// List scaffold for Item Manufacturer
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemManufacturer } from '../types/item-manufacturer.js';

interface ItemManufacturerListProps {
  data: ItemManufacturer[];
  onRowClick?: (id: string) => void;
}

export function ItemManufacturerList({ data, onRowClick }: ItemManufacturerListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer Part Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Default</th>
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
              <td className="px-4 py-3 text-sm">{String(row.manufacturer ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.manufacturer_part_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.is_default ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}