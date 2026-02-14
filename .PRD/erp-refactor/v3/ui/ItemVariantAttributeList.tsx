// List scaffold for Item Variant Attribute
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemVariantAttribute } from '../types/item-variant-attribute.js';

interface ItemVariantAttributeListProps {
  data: ItemVariantAttribute[];
  onRowClick?: (id: string) => void;
}

export function ItemVariantAttributeList({ data, onRowClick }: ItemVariantAttributeListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute Value</th>
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
              <td className="px-4 py-3 text-sm">{String(row.attribute ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.attribute_value ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}