"use client";

// Column definitions for Item Variant
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemVariant } from "../types/item-variant.js";

export const itemVariantColumns: ColumnDef<ItemVariant>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_attribute",
    header: "Item Attribute",
  },
  {
    accessorKey: "item_attribute_value",
    header: "Item Attribute Value",
  },
];