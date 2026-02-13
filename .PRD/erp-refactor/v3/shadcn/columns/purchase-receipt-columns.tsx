"use client";

// Column definitions for Purchase Receipt
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseReceipt } from "../types/purchase-receipt.js";
import { Badge } from "@/components/ui/badge";

export const purchaseReceiptColumns: ColumnDef<PurchaseReceipt>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "posting_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) => {
      const val = row.getValue("grand_total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "per_returned",
    header: "% Returned",
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