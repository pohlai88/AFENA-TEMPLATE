// List scaffold for UOM Category
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { UomCategory } from '../types/uom-category.js';

interface UomCategoryListProps {
  data: UomCategory[];
  onRowClick?: (id: string) => void;
}

export function UomCategoryList({ data, onRowClick }: UomCategoryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
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
              <td className="px-4 py-3 text-sm">{String(row.category_name ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}