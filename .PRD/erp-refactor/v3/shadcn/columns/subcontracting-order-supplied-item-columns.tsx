"use client";

// Column definitions for Subcontracting Order Supplied Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingOrderSuppliedItem } from "../types/subcontracting-order-supplied-item.js";

export const subcontractingOrderSuppliedItemColumns: ColumnDef<SubcontractingOrderSuppliedItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "main_item_code",
    header: "Item Code",
  },
  {
    accessorKey: "rm_item_code",
    header: "Raw Material Item Code",
  },
  {
    accessorKey: "reserve_warehouse",
    header: "Reserve Warehouse",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "required_qty",
    header: "Required Qty",
  },
  {
    accessorKey: "supplied_qty",
    header: "Supplied Qty",
  },
];