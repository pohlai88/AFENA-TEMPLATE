"use client";

// Column definitions for Item Variant Attribute
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemVariantAttribute } from "../types/item-variant-attribute.js";

export const itemVariantAttributeColumns: ColumnDef<ItemVariantAttribute>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "attribute",
    header: "Attribute",
  },
  {
    accessorKey: "attribute_value",
    header: "Attribute Value",
  },
];