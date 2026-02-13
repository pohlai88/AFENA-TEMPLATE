"use client";

// Column definitions for Price List
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PriceList } from "../types/price-list.js";

export const priceListColumns: ColumnDef<PriceList>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "buying",
    header: "Buying",
    cell: ({ row }) => row.getValue("buying") ? "Yes" : "No",
  },
  {
    accessorKey: "selling",
    header: "Selling",
    cell: ({ row }) => row.getValue("selling") ? "Yes" : "No",
  },
];