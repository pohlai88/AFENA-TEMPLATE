"use client";

// Column definitions for Quality Action Resolution
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityActionResolution } from "../types/quality-action-resolution.js";

export const qualityActionResolutionColumns: ColumnDef<QualityActionResolution>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "problem",
    header: "Problem",
  },
  {
    accessorKey: "resolution",
    header: "Resolution",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "responsible",
    header: "Responsible",
  },
  {
    accessorKey: "completion_by",
    header: "Completion By",
    cell: ({ row }) => {
      const val = row.getValue("completion_by") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];