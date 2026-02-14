"use client";

// Column definitions for POS Opening Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosOpeningEntry } from "../types/pos-opening-entry.js";
import { Badge } from "@/components/ui/badge";

export const posOpeningEntryColumns: ColumnDef<PosOpeningEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "period_start_date",
    header: "Period Start Date",
    cell: ({ row }) => {
      const val = row.getValue("period_start_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "period_end_date",
    header: "Period End Date",
    cell: ({ row }) => {
      const val = row.getValue("period_end_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "posting_date",
    header: "Posting Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "pos_profile",
    header: "POS Profile",
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];