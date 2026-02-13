// List scaffold for BOM Creator
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BomCreator } from '../types/bom-creator.js';

interface BomCreatorListProps {
  data: BomCreator[];
  onRowClick?: (id: string) => void;
}

export function BomCreatorList({ data, onRowClick }: BomCreatorListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finished Good</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
              <td className="px-4 py-3 text-sm">{String(row.currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.raw_material_cost ?? '')}</td>
              <td className="px-4 py-3 text-sm">
                {(row as any).docstatus === 0 ? 'Draft' : (row as any).docstatus === 1 ? 'Submitted' : 'Cancelled'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}