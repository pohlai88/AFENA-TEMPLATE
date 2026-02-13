// List scaffold for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { QualityFeedbackParameter } from '../types/quality-feedback-parameter.js';

interface QualityFeedbackParameterListProps {
  data: QualityFeedbackParameter[];
  onRowClick?: (id: string) => void;
}

export function QualityFeedbackParameterList({ data, onRowClick }: QualityFeedbackParameterListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
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
              <td className="px-4 py-3 text-sm">{String(row.parameter ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rating ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.feedback ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}