// List scaffold for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SupplierScorecardScoringCriteria } from '../types/supplier-scorecard-scoring-criteria.js';

interface SupplierScorecardScoringCriteriaListProps {
  data: SupplierScorecardScoringCriteria[];
  onRowClick?: (id: string) => void;
}

export function SupplierScorecardScoringCriteriaList({ data, onRowClick }: SupplierScorecardScoringCriteriaListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criteria Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criteria Weight</th>
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
              <td className="px-4 py-3 text-sm">{String(row.criteria_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.score ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.weight ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}