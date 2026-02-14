// List scaffold for Item Tax Template
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemTaxTemplate } from '../types/item-tax-template.js';

interface ItemTaxTemplateListProps {
  data: ItemTaxTemplate[];
  onRowClick?: (id: string) => void;
}

export function ItemTaxTemplateList({ data, onRowClick }: ItemTaxTemplateListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
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
              <td className="px-4 py-3 text-sm">{String(row.title ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}