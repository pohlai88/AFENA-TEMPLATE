"use client";

// Column definitions for Quality Meeting
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityMeeting } from "../types/quality-meeting.js";

export const qualityMeetingColumns: ColumnDef<QualityMeeting>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];