// List scaffold for Quality Review
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { QualityReview } from '../types/quality-review.js';

interface QualityReviewListProps {
  data: QualityReview[];
  onRowClick?: (id: string) => void;
}

export function QualityReviewList({ data, onRowClick }: QualityReviewListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.goal ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}