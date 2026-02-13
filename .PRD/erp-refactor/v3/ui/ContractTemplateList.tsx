// List scaffold for Contract Template
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ContractTemplate } from '../types/contract-template.js';

interface ContractTemplateListProps {
  data: ContractTemplate[];
  onRowClick?: (id: string) => void;
}

export function ContractTemplateList({ data, onRowClick }: ContractTemplateListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Terms and Conditions</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requires Fulfilment</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Template Help</th>
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
              <td className="px-4 py-3 text-sm">{String(row.title ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.contract_terms ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.requires_fulfilment ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.contract_template_help ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}