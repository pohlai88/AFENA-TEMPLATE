// List scaffold for Item Variant Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemVariantSettings } from '../types/item-variant-settings.js';

interface ItemVariantSettingsListProps {
  data: ItemVariantSettings[];
  onRowClick?: (id: string) => void;
}

export function ItemVariantSettingsList({ data, onRowClick }: ItemVariantSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Do not update variants on save</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allow Rename Attribute Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allow Variant UOM to be different from Template UOM</th>
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
              <td className="px-4 py-3 text-sm">{String(row.do_not_update_variants ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allow_rename_attribute_value ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allow_different_uom ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}