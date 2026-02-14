"use client";

// Column definitions for Email Campaign
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmailCampaign } from "../types/email-campaign.js";

export const emailCampaignColumns: ColumnDef<EmailCampaign>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "campaign_name",
    header: "Campaign",
  },
  {
    accessorKey: "email_campaign_for",
    header: "Email Campaign For ",
  },
];