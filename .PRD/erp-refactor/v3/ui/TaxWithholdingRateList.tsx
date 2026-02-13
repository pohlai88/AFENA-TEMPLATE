// List scaffold for Tax Withholding Rate
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { TaxWithholdingRate } from '../types/tax-withholding-rate.js';

interface TaxWithholdingRateListProps {
  data: TaxWithholdingRate[];
  onRowClick?: (id: string) => void;
}

export function TaxWithholdingRateList({ data, onRowClick }: TaxWithholdingRateListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Withholding Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Withholding Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cumulative Threshold</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Threshold</th>
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
              <td className="px-4 py-3 text-sm">{String(row.from_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.tax_withholding_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.tax_withholding_rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.cumulative_threshold ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.single_threshold ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}