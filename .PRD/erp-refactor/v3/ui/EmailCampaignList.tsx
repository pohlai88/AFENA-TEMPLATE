// List scaffold for Email Campaign
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { EmailCampaign } from '../types/email-campaign.js';

interface EmailCampaignListProps {
  data: EmailCampaign[];
  onRowClick?: (id: string) => void;
}

export function EmailCampaignList({ data, onRowClick }: EmailCampaignListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Campaign For </th>
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
              <td className="px-4 py-3 text-sm">{String(row.campaign_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.email_campaign_for ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}