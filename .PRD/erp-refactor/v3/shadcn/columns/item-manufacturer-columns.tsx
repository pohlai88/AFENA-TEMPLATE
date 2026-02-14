"use client";

// Column definitions for Item Manufacturer
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemManufacturer } from "../types/item-manufacturer.js";

export const itemManufacturerColumns: ColumnDef<ItemManufacturer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "manufacturer_part_no",
    header: "Manufacturer Part Number",
  },
  {
    accessorKey: "is_default",
    header: "Is Default",
    cell: ({ row }) => row.getValue("is_default") ? "Yes" : "No",
  },
];