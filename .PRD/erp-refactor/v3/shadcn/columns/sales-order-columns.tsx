"use client";

// Column definitions for Sales Order
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesOrder } from "../types/sales-order.js";
import { Badge } from "@/components/ui/badge";

export const salesOrderColumns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
    cell: ({ row }) => {
      const val = row.getValue("delivery_date") as string;
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
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "per_delivered",
    header: "%  Delivered",
  },
  {
    accessorKey: "per_billed",
    header: "% Amount Billed",
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