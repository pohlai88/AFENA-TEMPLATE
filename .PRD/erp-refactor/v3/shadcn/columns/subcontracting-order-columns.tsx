"use client";

// Column definitions for Subcontracting Order
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingOrder } from "../types/subcontracting-order.js";
import { Badge } from "@/components/ui/badge";

export const subcontractingOrderColumns: ColumnDef<SubcontractingOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("transaction_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "per_received",
    header: "% Received",
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