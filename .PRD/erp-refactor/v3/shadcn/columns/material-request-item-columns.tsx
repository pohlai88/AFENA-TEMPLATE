"use client";

// Column definitions for Material Request Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaterialRequestItem } from "../types/material-request-item.js";

export const materialRequestItemColumns: ColumnDef<MaterialRequestItem>[] = [
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
    header: "Required By",
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
    accessorKey: "warehouse",
    header: "Target Warehouse",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];