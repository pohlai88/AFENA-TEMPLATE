"use client";

// Column definitions for Campaign Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CampaignItem } from "../types/campaign-item.js";

export const campaignItemColumns: ColumnDef<CampaignItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "campaign",
    header: "Campaign",
  },
];