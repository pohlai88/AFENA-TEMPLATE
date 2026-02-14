// List scaffold for Tax Withholding Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { TaxWithholdingEntry } from '../types/tax-withholding-entry.js';

interface TaxWithholdingEntryListProps {
  data: TaxWithholdingEntry[];
  onRowClick?: (id: string) => void;
}

export function TaxWithholdingEntryList({ data, onRowClick }: TaxWithholdingEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Withholding Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Withholding Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Taxable Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Tax Withheld</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxable Document Name</th>
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
              <td className="px-4 py-3 text-sm">{String(row.tax_withholding_category ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.tax_withholding_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.taxable_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.tax_rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.withholding_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.taxable_name ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}