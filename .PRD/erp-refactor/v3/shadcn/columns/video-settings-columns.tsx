"use client";

// Column definitions for Video Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { VideoSettings } from "../types/video-settings.js";

export const videoSettingsColumns: ColumnDef<VideoSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "enable_youtube_tracking",
    header: "Enable YouTube Tracking",
    cell: ({ row }) => row.getValue("enable_youtube_tracking") ? "Yes" : "No",
  },
  {
    accessorKey: "api_key",
    header: "API Key",
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
  },
];