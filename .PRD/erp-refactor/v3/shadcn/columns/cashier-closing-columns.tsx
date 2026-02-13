"use client";

// Column definitions for Cashier Closing
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CashierClosing } from "../types/cashier-closing.js";
import { Badge } from "@/components/ui/badge";

export const cashierClosingColumns: ColumnDef<CashierClosing>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "net_amount",
    header: "Net Amount",
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