"use client";

// Column definitions for Bin
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Bin } from "../types/bin.js";

export const binColumns: ColumnDef<Bin>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "actual_qty",
    header: "Actual Qty",
  },
  {
    accessorKey: "ordered_qty",
    header: "Ordered Qty",
  },
  {
    accessorKey: "reserved_qty",
    header: "Reserved Qty",
  },
];