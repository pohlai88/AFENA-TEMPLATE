"use client";

// Column definitions for Item Attribute Value
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemAttributeValue } from "../types/item-attribute-value.js";

export const itemAttributeValueColumns: ColumnDef<ItemAttributeValue>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "attribute_value",
    header: "Attribute Value",
  },
  {
    accessorKey: "abbr",
    header: "Abbreviation",
  },
];