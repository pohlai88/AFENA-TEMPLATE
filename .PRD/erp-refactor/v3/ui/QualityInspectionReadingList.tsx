// List scaffold for Quality Inspection Reading
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { QualityInspectionReading } from '../types/quality-inspection-reading.js';

interface QualityInspectionReadingListProps {
  data: QualityInspectionReading[];
  onRowClick?: (id: string) => void;
}

export function QualityInspectionReadingList({ data, onRowClick }: QualityInspectionReadingListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numeric</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reading Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reading 1</th>
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
              <td className="px-4 py-3 text-sm">{String(row.specification ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.numeric ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reading_value ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reading_1 ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}