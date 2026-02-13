"use client";

// Column definitions for Quality Action
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityAction } from "../types/quality-action.js";

export const qualityActionColumns: ColumnDef<QualityAction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "corrective_preventive",
    header: "Corrective/Preventive",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "goal",
    header: "Goal",
  },
];