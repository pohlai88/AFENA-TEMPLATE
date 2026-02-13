"use client";

// Column definitions for Stock Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockEntry } from "../types/stock-entry.js";
import { Badge } from "@/components/ui/badge";

export const stockEntryColumns: ColumnDef<StockEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "stock_entry_type",
    header: "Stock Entry Type",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    accessorKey: "from_warehouse",
    header: "Default Source Warehouse",
  },
  {
    accessorKey: "to_warehouse",
    header: "Default Target Warehouse",
  },
  {
    accessorKey: "per_transferred",
    header: "Per Transferred",
  },
  {
    accessorKey: "is_return",
    header: "Is Return",
    cell: ({ row }) => row.getValue("is_return") ? "Yes" : "No",
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