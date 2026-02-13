"use client";

// Column definitions for Campaign
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Campaign } from "../types/campaign.js";

export const campaignColumns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];