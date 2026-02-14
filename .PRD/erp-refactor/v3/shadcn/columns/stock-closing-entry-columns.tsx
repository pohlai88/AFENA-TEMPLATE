"use client";

// Column definitions for Stock Closing Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockClosingEntry } from "../types/stock-closing-entry.js";
import { Badge } from "@/components/ui/badge";

export const stockClosingEntryColumns: ColumnDef<StockClosingEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
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