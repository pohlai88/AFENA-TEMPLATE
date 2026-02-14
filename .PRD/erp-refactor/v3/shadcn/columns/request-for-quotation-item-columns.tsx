"use client";

// Column definitions for Request for Quotation Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RequestForQuotationItem } from "../types/request-for-quotation-item.js";

export const requestForQuotationItemColumns: ColumnDef<RequestForQuotationItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "schedule_date",
    header: "Required Date",
    cell: ({ row }) => {
      const val = row.getValue("schedule_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
];