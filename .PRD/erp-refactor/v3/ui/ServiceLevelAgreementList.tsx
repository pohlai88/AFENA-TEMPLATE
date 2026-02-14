// List scaffold for Service Level Agreement
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ServiceLevelAgreement } from '../types/service-level-agreement.js';

interface ServiceLevelAgreementListProps {
  data: ServiceLevelAgreement[];
  onRowClick?: (id: string) => void;
}

export function ServiceLevelAgreementList({ data, onRowClick }: ServiceLevelAgreementListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Level Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
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
              <td className="px-4 py-3 text-sm">{String(row.service_level ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.entity ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}