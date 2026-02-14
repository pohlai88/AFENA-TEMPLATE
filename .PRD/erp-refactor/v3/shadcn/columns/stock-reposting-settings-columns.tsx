"use client";

// Column definitions for Stock Reposting Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockRepostingSettings } from "../types/stock-reposting-settings.js";

export const stockRepostingSettingsColumns: ColumnDef<StockRepostingSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "limit_reposting_timeslot",
    header: "Limit timeslot for Stock Reposting",
    cell: ({ row }) => row.getValue("limit_reposting_timeslot") ? "Yes" : "No",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
  },
  {
    accessorKey: "end_time",
    header: "End Time",
  },
  {
    accessorKey: "limits_dont_apply_on",
    header: "Limits don't apply on",
  },
  {
    accessorKey: "item_based_reposting",
    header: "Use Item based reposting",
    cell: ({ row }) => row.getValue("item_based_reposting") ? "Yes" : "No",
  },
];