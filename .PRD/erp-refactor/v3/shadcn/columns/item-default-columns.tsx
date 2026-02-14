"use client";

// Column definitions for Item Default
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemDefault } from "../types/item-default.js";

export const itemDefaultColumns: ColumnDef<ItemDefault>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "default_warehouse",
    header: "Default Warehouse",
  },
  {
    accessorKey: "default_price_list",
    header: "Default Price List",
  },
];