// List scaffold for Item Group
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemGroup } from '../types/item-group.js';

interface ItemGroupListProps {
  data: ItemGroup[];
  onRowClick?: (id: string) => void;
}

export function ItemGroupList({ data, onRowClick }: ItemGroupListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Group Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Item Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Group</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_group_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.parent_item_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.is_group ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}