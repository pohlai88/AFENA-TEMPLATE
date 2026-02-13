"use client";

// Column definitions for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityMeetingMinutes } from "../types/quality-meeting-minutes.js";

export const qualityMeetingMinutesColumns: ColumnDef<QualityMeetingMinutes>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "document_type",
    header: "Document Type",
  },
  {
    accessorKey: "document_name",
    header: "Document Name",
  },
  {
    accessorKey: "minute",
    header: "Minute",
  },
];