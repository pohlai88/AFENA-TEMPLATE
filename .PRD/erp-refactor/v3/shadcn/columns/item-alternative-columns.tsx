"use client";

// Column definitions for Item Alternative
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemAlternative } from "../types/item-alternative.js";

export const itemAlternativeColumns: ColumnDef<ItemAlternative>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "alternative_item_code",
    header: "Alternative Item Code",
  },
];