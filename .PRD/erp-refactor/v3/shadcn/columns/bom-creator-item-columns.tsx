"use client";

// Column definitions for BOM Creator Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomCreatorItem } from "../types/bom-creator-item.js";

export const bomCreatorItemColumns: ColumnDef<BomCreatorItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "fg_item",
    header: "Finished Goods Item",
  },
  {
    accessorKey: "is_expandable",
    header: "Is Expandable",
    cell: ({ row }) => row.getValue("is_expandable") ? "Yes" : "No",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];