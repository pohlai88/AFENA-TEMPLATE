// List scaffold for Asset Category Account
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetCategoryAccount } from '../types/asset-category-account.js';

interface AssetCategoryAccountListProps {
  data: AssetCategoryAccount[];
  onRowClick?: (id: string) => void;
}

export function AssetCategoryAccountList({ data, onRowClick }: AssetCategoryAccountListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fixed Asset Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accumulated Depreciation Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depreciation Expense Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Work In Progress Account</th>
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
              <td className="px-4 py-3 text-sm">{String(row.company_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.fixed_asset_account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.accumulated_depreciation_account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.depreciation_expense_account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.capital_work_in_progress_account ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}