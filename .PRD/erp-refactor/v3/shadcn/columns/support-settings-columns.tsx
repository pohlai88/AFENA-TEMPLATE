"use client";

// Column definitions for Support Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupportSettings } from "../types/support-settings.js";

export const supportSettingsColumns: ColumnDef<SupportSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "track_service_level_agreement",
    header: "Track Service Level Agreement",
    cell: ({ row }) => row.getValue("track_service_level_agreement") ? "Yes" : "No",
  },
  {
    accessorKey: "allow_resetting_service_level_agreement",
    header: "Allow Resetting Service Level Agreement",
    cell: ({ row }) => row.getValue("allow_resetting_service_level_agreement") ? "Yes" : "No",
  },
  {
    accessorKey: "close_issue_after_days",
    header: "Close Issue After Days",
  },
  {
    accessorKey: "get_started_sections",
    header: "Get Started Sections",
  },
  {
    accessorKey: "show_latest_forum_posts",
    header: "Show Latest Forum Posts",
    cell: ({ row }) => row.getValue("show_latest_forum_posts") ? "Yes" : "No",
  },
];