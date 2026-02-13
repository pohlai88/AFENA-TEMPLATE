// List scaffold for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SupplierScorecardScoringVariable } from '../types/supplier-scorecard-scoring-variable.js';

interface SupplierScorecardScoringVariableListProps {
  data: SupplierScorecardScoringVariable[];
  onRowClick?: (id: string) => void;
}

export function SupplierScorecardScoringVariableList({ data, onRowClick }: SupplierScorecardScoringVariableListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variable Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
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
              <td className="px-4 py-3 text-sm">{String(row.variable_label ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.value ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}