"use client";

// Column definitions for Packing Slip Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PackingSlipItem } from "../types/packing-slip-item.js";

export const packingSlipItemColumns: ColumnDef<PackingSlipItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "net_weight",
    header: "Net Weight",
  },
  {
    accessorKey: "page_break",
    header: "Page Break",
    cell: ({ row }) => row.getValue("page_break") ? "Yes" : "No",
  },
  {
    accessorKey: "dn_detail",
    header: "Delivery Note Item",
  },
];