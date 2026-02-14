// List scaffold for Subcontracting BOM
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SubcontractingBom } from '../types/subcontracting-bom.js';

interface SubcontractingBomListProps {
  data: SubcontractingBom[];
  onRowClick?: (id: string) => void;
}

export function SubcontractingBomList({ data, onRowClick }: SubcontractingBomListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Active</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finished Good</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finished Good BOM</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Item</th>
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
              <td className="px-4 py-3 text-sm">{String(row.is_active ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.finished_good ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.finished_good_bom ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.service_item ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}