"use client";

// Column definitions for Stock Reconciliation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockReconciliation } from "../types/stock-reconciliation.js";
import { Badge } from "@/components/ui/badge";

export const stockReconciliationColumns: ColumnDef<StockReconciliation>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "posting_time",
    header: "Posting Time",
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