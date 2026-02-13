"use client";

// Column definitions for Item Attribute
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemAttribute } from "../types/item-attribute.js";

export const itemAttributeColumns: ColumnDef<ItemAttribute>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "attribute_name",
    header: "Attribute Name",
  },
];